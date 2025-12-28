/**
 * Audio Management System
 * Handles ambient soundscapes, sound effects, and audio playback with Web Audio API
 */

class AudioManager {
  constructor() {
    this.context = null;
    this.ambientGain = null;
    this.effectsGain = null;
    this.masterGain = null;
    this.audioBuffers = new Map();
    this.activeSources = new Set();
    this.ambientSource = null;
    this.isMuted = false;
    this.isInitialized = false;
  }

  /**
   * Initialize audio context (requires user gesture)
   */
  async init() {
    if (this.isInitialized) return;

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain nodes for mixing
      this.masterGain = this.context.createGain();
      this.masterGain.connect(this.context.destination);
      
      this.ambientGain = this.context.createGain();
      this.ambientGain.connect(this.masterGain);
      this.ambientGain.gain.value = 0.3; // Subtle ambient volume
      
      this.effectsGain = this.context.createGain();
      this.effectsGain.connect(this.masterGain);
      this.effectsGain.gain.value = 0.5; // Medium effects volume
      
      this.isInitialized = true;
      console.log('Audio system initialized');
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  /**
   * Resume audio context if suspended (handle browser autoplay policies)
   */
  async resume() {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  /**
   * Load audio file and decode it
   */
  async loadAudio(url, key) {
    if (this.audioBuffers.has(key)) {
      return this.audioBuffers.get(key);
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio ${url}:`, error);
      return null;
    }
  }

  /**
   * Play a sound effect
   */
  async playEffect(url, options = {}) {
    if (!this.isInitialized || this.isMuted) return;

    await this.resume();

    const { volume = 1.0, loop = false, rate = 1.0 } = options;

    try {
      const buffer = await this.loadAudio(url, url);
      if (!buffer) return;

      const source = this.context.createBufferSource();
      source.buffer = buffer;
      
      const gainNode = this.context.createGain();
      gainNode.gain.value = volume;
      
      source.connect(gainNode);
      gainNode.connect(this.effectsGain);
      
      source.loop = loop;
      source.playbackRate.value = rate;
      
      this.activeSources.add(source);
      
      source.onended = () => {
        this.activeSources.delete(source);
      };
      
      source.start(0);
      return source;
    } catch (error) {
      console.error('Error playing effect:', error);
    }
  }

  /**
   * Start ambient background loop
   */
  async startAmbient(url) {
    if (!this.isInitialized || this.isMuted) return;
    if (this.ambientSource) return; // Already playing

    await this.resume();

    try {
      const buffer = await this.loadAudio(url, 'ambient');
      if (!buffer) return;

      this.ambientSource = this.context.createBufferSource();
      this.ambientSource.buffer = buffer;
      this.ambientSource.loop = true;
      this.ambientSource.connect(this.ambientGain);
      this.ambientSource.start(0);
    } catch (error) {
      console.error('Error starting ambient:', error);
    }
  }

  /**
   * Stop ambient background
   */
  stopAmbient() {
    if (this.ambientSource) {
      this.ambientSource.stop();
      this.ambientSource = null;
    }
  }

  /**
   * Fade ambient volume
   */
  fadeAmbient(targetVolume, duration = 2.0) {
    if (!this.ambientGain) return;
    
    const currentTime = this.context.currentTime;
    this.ambientGain.gain.cancelScheduledValues(currentTime);
    this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(targetVolume, currentTime + duration);
  }

  /**
   * Play interaction sound (subtle click/whoosh)
   */
  playClick() {
    if (!this.isInitialized || this.isMuted) return;
    
    this.resume();
    
    // Generate a subtle click sound
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.effectsGain);
    
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    
    const now = this.context.currentTime;
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  }

  /**
   * Play success chime
   */
  playSuccess() {
    if (!this.isInitialized || this.isMuted) return;
    
    this.resume();
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.effectsGain);
    
    const now = this.context.currentTime;
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    
    oscillator.start(now);
    oscillator.stop(now + 0.4);
  }

  /**
   * Play failure/discordant tone
   */
  playFailure() {
    if (!this.isInitialized || this.isMuted) return;
    
    this.resume();
    
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.effectsGain);
    
    const now = this.context.currentTime;
    oscillator.frequency.setValueAtTime(220, now); // A3
    oscillator.frequency.setValueAtTime(207.65, now + 0.15); // G#3 (dissonant)
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }

  /**
   * Toggle mute state
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.masterGain) {
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
    }
    
    return this.isMuted;
  }

  /**
   * Set master volume
   */
  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    this.activeSources.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.activeSources.clear();
    this.stopAmbient();
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopAll();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
    this.isInitialized = false;
  }
}

// Singleton instance
export const audioManager = new AudioManager();

// Convenience functions
export const initAudio = () => audioManager.init();
export const playEffect = (url, options) => audioManager.playEffect(url, options);
export const startAmbient = (url) => audioManager.startAmbient(url);
export const stopAmbient = () => audioManager.stopAmbient();
export const fadeAmbient = (volume, duration) => audioManager.fadeAmbient(volume, duration);
export const playClick = () => audioManager.playClick();
export const playSuccess = () => audioManager.playSuccess();
export const playFailure = () => audioManager.playFailure();
export const toggleMute = () => audioManager.toggleMute();
export const setVolume = (volume) => audioManager.setVolume(volume);
