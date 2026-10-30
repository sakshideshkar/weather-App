/**
 * Ambient Weather Audio Engine (Web Audio API)
 * Synthesizes natural, gentle weather soundscapes offline with zero external audio assets.
 */

class WeatherAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.currentEffect = null;
    this.activeNodes = [];
    this.isPlaying = false;
    this.volume = 0.35;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.masterGain = this.audioCtx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        this.masterGain.connect(this.audioCtx.destination);
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  stop() {
    if (!this.isPlaying) return;
    this.activeNodes.forEach((node) => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch {
        // cleanup
      }
    });
    this.activeNodes = [];
    this.isPlaying = false;
    this.currentEffect = null;
  }

  playWeatherSound(weatherType = 'clear-day') {
    this.init();
    if (!this.audioCtx) return;

    // Stop current sound smoothly
    this.stop();
    this.isPlaying = true;
    this.currentEffect = weatherType;

    const ctx = this.audioCtx;

    if (weatherType === 'rain' || weatherType === 'thunderstorm') {
      this.playRain(ctx, weatherType === 'thunderstorm');
    } else if (weatherType === 'snow' || weatherType === 'fog' || weatherType === 'clouds') {
      this.playWind(ctx);
    } else if (weatherType === 'starry-night' || weatherType === 'night-clouds') {
      this.playNight(ctx);
    } else {
      // clear-day
      this.playWarmBreeze(ctx);
    }
  }

  // Generate pink/white noise buffer
  createNoiseBuffer(ctx, duration = 3) {
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02; // pinkish noise
      lastOut = data[i];
      data[i] *= 3.5;
    }
    return buffer;
  }

  playRain(ctx, isThunder = false) {
    const noiseBuffer = this.createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);

    const rainGain = ctx.createGain();
    rainGain.gain.setValueAtTime(0.18, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, rainGain);

    if (isThunder) {
      // Thunder periodic low rumble
      const thunderInterval = setInterval(() => {
        if (!this.isPlaying) {
          clearInterval(thunderInterval);
          return;
        }
        const osc = ctx.createOscillator();
        const thunderGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(55, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + 1.2);

        thunderGain.gain.setValueAtTime(0.25, ctx.currentTime);
        thunderGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);

        osc.connect(thunderGain);
        thunderGain.connect(this.masterGain);
        osc.start();
        osc.stop(ctx.currentTime + 1.8);
      }, 7000);

      this.activeNodes.push({ stop: () => clearInterval(thunderInterval) });
    }
  }

  playWind(ctx) {
    const noiseBuffer = this.createNoiseBuffer(ctx, 4);
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);
    filter.Q.setValueAtTime(3, ctx.currentTime);

    // LFO to modulate wind gusts
    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.12, ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(windGain);
    windGain.connect(this.masterGain);

    lfo.start();
    noiseSource.start();
    this.activeNodes.push(noiseSource, filter, lfo, lfoGain, windGain);
  }

  playNight(ctx) {
    // Gentle cricket chirps using pulsed high frequency oscillator
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(4200, ctx.currentTime);

    const mod = ctx.createOscillator();
    mod.type = 'square';
    mod.frequency.setValueAtTime(14, ctx.currentTime);

    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(0.04, ctx.currentTime);

    const nightGain = ctx.createGain();
    nightGain.gain.setValueAtTime(0.035, ctx.currentTime);

    osc.connect(nightGain);
    mod.connect(modGain);
    nightGain.connect(this.masterGain);

    osc.start();
    mod.start();
    this.activeNodes.push(osc, mod, modGain, nightGain);
  }

  playWarmBreeze(ctx) {
    // Soft soothing harmonic tones
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(220, ctx.currentTime);
    osc2.frequency.setValueAtTime(330, ctx.currentTime);

    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    gain1.gain.setValueAtTime(0.02, ctx.currentTime);
    gain2.gain.setValueAtTime(0.015, ctx.currentTime);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(this.masterGain);
    gain2.connect(this.masterGain);

    osc1.start();
    osc2.start();
    this.activeNodes.push(osc1, osc2, gain1, gain2);
  }
}

export const weatherAudio = new WeatherAudioEngine();

