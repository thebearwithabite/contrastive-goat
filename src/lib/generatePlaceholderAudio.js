/**
 * Generate placeholder audio files using Web Audio API
 * These can be replaced with real audio files later
 */

/**
 * Generate an audio file and trigger download
 */
async function generateAudioFile(name, duration, generator) {
  const sampleRate = 44100;
  const numChannels = 1;
  const numSamples = sampleRate * duration;
  
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioBuffer = audioContext.createBuffer(numChannels, numSamples, sampleRate);
  const channelData = audioBuffer.getChannelData(0);
  
  // Generate audio samples
  generator(channelData, sampleRate, duration);
  
  // Convert to WAV (we'll use WAV instead of M4A for simplicity)
  const wav = audioBufferToWav(audioBuffer);
  const blob = new Blob([wav], { type: 'audio/wav' });
  
  // Trigger download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  
  audioContext.close();
}

/**
 * Convert AudioBuffer to WAV format
 */
function audioBufferToWav(buffer) {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;
  
  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);
  
  // Write WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write audio data
  floatTo16BitPCM(view, 44, data);
  
  return arrayBuffer;
}

function interleave(buffer) {
  if (buffer.numberOfChannels === 1) {
    return buffer.getChannelData(0);
  }
  const length = buffer.length * buffer.numberOfChannels;
  const result = new Float32Array(length);
  const channelData = [];
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channelData.push(buffer.getChannelData(i));
  }
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      result[i * buffer.numberOfChannels + channel] = channelData[channel][i];
    }
  }
  return result;
}

function writeString(view, offset, string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function floatTo16BitPCM(view, offset, input) {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

/**
 * Soft rain ambience generator
 */
function generateSoftRain(data, sampleRate, duration) {
  for (let i = 0; i < data.length; i++) {
    // White noise filtered to sound like rain
    const noise = (Math.random() * 2 - 1) * 0.1;
    const t = i / sampleRate;
    // Low frequency modulation for gentle variation
    const modulation = Math.sin(t * 0.5) * 0.5 + 0.5;
    data[i] = noise * modulation * 0.3;
  }
}

/**
 * Metal scrape generator
 */
function generateMetalScrape(data, sampleRate, duration) {
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // Harsh, descending frequency with noise
    const freq = 2000 - (t / duration) * 1500;
    const noise = (Math.random() * 2 - 1) * 0.5;
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.3;
    // Envelope
    const envelope = Math.exp(-t * 3);
    data[i] = (tone + noise) * envelope;
  }
}

/**
 * Distant piano generator
 */
function generateDistantPiano(data, sampleRate, duration) {
  // A melancholic chord progression
  const notes = [
    { freq: 261.63, time: 0, duration: 0.5 }, // C4
    { freq: 329.63, time: 0, duration: 0.5 }, // E4
    { freq: 392.00, time: 0, duration: 0.5 }, // G4
    { freq: 293.66, time: 1.0, duration: 0.5 }, // D4
    { freq: 349.23, time: 1.0, duration: 0.5 }, // F4
    { freq: 440.00, time: 1.0, duration: 0.5 }, // A4
  ];
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    let sample = 0;
    
    for (const note of notes) {
      if (t >= note.time && t < note.time + note.duration) {
        const noteT = t - note.time;
        const envelope = Math.exp(-noteT * 3);
        // Piano-like harmonics
        sample += Math.sin(2 * Math.PI * note.freq * noteT) * envelope * 0.3;
        sample += Math.sin(2 * Math.PI * note.freq * 2 * noteT) * envelope * 0.1;
        sample += Math.sin(2 * Math.PI * note.freq * 3 * noteT) * envelope * 0.05;
      }
    }
    
    // Add reverb effect (simplified)
    data[i] = sample * 0.5;
  }
}

/**
 * Alarm beep generator
 */
function generateAlarmBeep(data, sampleRate, duration) {
  const beepFreq = 880; // A5
  const beepDuration = 0.1;
  const beepInterval = 0.3;
  
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    const inBeep = (t % beepInterval) < beepDuration;
    
    if (inBeep) {
      const beepT = t % beepInterval;
      const envelope = Math.min(beepT / 0.01, 1) * Math.min((beepDuration - beepT) / 0.01, 1);
      data[i] = Math.sin(2 * Math.PI * beepFreq * t) * envelope * 0.4;
    } else {
      data[i] = 0;
    }
  }
}

/**
 * Ambient drone generator
 */
function generateAmbientDrone(data, sampleRate, duration) {
  for (let i = 0; i < data.length; i++) {
    const t = i / sampleRate;
    // Multiple overlapping sine waves for rich drone
    const fundamental = 110; // A2
    let sample = 0;
    sample += Math.sin(2 * Math.PI * fundamental * t) * 0.15;
    sample += Math.sin(2 * Math.PI * fundamental * 1.5 * t) * 0.1;
    sample += Math.sin(2 * Math.PI * fundamental * 2 * t) * 0.08;
    sample += Math.sin(2 * Math.PI * fundamental * 3 * t) * 0.05;
    // Slow amplitude modulation
    sample *= 0.7 + 0.3 * Math.sin(t * 0.25);
    data[i] = sample;
  }
}

/**
 * Generate all placeholder files
 */
export async function generateAllPlaceholders() {
  console.log('Generating placeholder audio files...');
  
  await generateAudioFile('soft_rain.wav', 5, generateSoftRain);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await generateAudioFile('metal_scrape.wav', 2, generateMetalScrape);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await generateAudioFile('distant_piano.wav', 3, generateDistantPiano);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await generateAudioFile('alarm_beep.wav', 3, generateAlarmBeep);
  await new Promise(resolve => setTimeout(resolve, 500));
  
  await generateAudioFile('ambient_drone.wav', 10, generateAmbientDrone);
  
  console.log('All placeholder audio files generated!');
  console.log('Rename .wav files to .m4a and place in /public/audio/');
}

// Make available globally for console use
if (typeof window !== 'undefined') {
  window.generatePlaceholderAudio = generateAllPlaceholders;
}
