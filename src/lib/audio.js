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
    this.failedUrls = new Set(); // Cache failed URLs to avoid retrying
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

    // Check if this URL has previously failed
    if (this.failedUrls.has(url)) {
      return null;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(key, audioBuffer);
      return audioBuffer;
    } catch (error) {
      console.warn(`Failed to load audio ${url}:`, error);
      this.failedUrls.add(url); // Cache failed URL
      return null;
    }
  }

  /**
   * Play a sound effect
   */
  async playEffect(url, options = {}) {
    if (!this.isInitialized || this.isMuted) {
      if (!this.isInitialized) {
        console.warn(`Audio not initialized. Call init() first before playing: ${url}`);
      }
      return;
    }

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
  async playClick() {
    // Use actual click audio file instead of synthesized sound
    return this.playEffect('/audio/click.m4a', { volume: 0.5 });
  }

  /**
   * Play success chime
   */
  async playSuccess() {
    // Use actual success audio file instead of synthesized sound
    return this.playEffect('/audio/correct.m4a', { volume: 0.6 });
  }

  /**
   * Play failure/discordant tone
   */
  async playFailure() {
    // Use actual wrong/failure audio file instead of synthesized sound
    return this.playEffect('/audio/wrong.m4a', { volume: 0.6 });
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
