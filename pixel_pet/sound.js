// Retro sound effects and background music using Web Audio API
class AudioManager {
  constructor() {
    this.ctx = null;
    this.bgmInterval = null;
    this.bgmVolumeNode = null;
    this.isPlayingBGM = false;
    this.bgmTempo = 130; // BPM
    this.bgmSequence = [
      // Melody notes (freq, duration in beats)
      // Section A
      { note: 'E5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'A5', dur: 1 },
      { note: 'E5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'B5', dur: 0.5 }, { note: 'A5', dur: 0.5 },
      { note: 'D5', dur: 0.5 }, { note: 'F5', dur: 0.5 }, { note: 'G5', dur: 1 },
      { note: 'C5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'F5', dur: 1 },
      
      // Section B
      { note: 'E5', dur: 0.5 }, { note: 'G5', dur: 0.5 }, { note: 'A5', dur: 1 },
      { note: 'C6', dur: 0.5 }, { note: 'B5', dur: 0.5 }, { note: 'G5', dur: 1 },
      { note: 'A5', dur: 0.5 }, { note: 'F5', dur: 0.5 }, { note: 'D5', dur: 1 },
      { note: 'G5', dur: 0.5 }, { note: 'E5', dur: 0.5 }, { note: 'C5', dur: 1 },
    ];
    this.noteFreqs = {
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
      'G5': 783.99, 'A5': 880.00, 'B5': 987.77, 'C6': 1046.50
    };
    this.isMuted = false;
  }

  init() {
    if (this.ctx) return;
    // Create AudioContext on user interaction
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create main volume nodes
    this.bgmVolumeNode = this.ctx.createGain();
    this.bgmVolumeNode.gain.setValueAtTime(0.05, this.ctx.currentTime); // Low BGM volume
    this.bgmVolumeNode.connect(this.ctx.destination);
  }

  playTone(freq, type, duration, gainStart, gainEnd, slideFreq = null) {
    if (!this.ctx) this.init();
    if (this.isMuted) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    if (slideFreq) {
      osc.frequency.exponentialRampToValueAtTime(slideFreq, this.ctx.currentTime + duration);
    }

    gainNode.gain.setValueAtTime(gainStart, this.ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(gainEnd, this.ctx.currentTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  // Cute jump / bounce sound
  playBoing() {
    this.playTone(150, 'triangle', 0.15, 0.3, 0.01, 400);
  }

  // Munching / eating crunchy sound
  playEat() {
    // Crunch is made of a quick succession of short high-to-low noise/triangle sweeps
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.playTone(300, 'square', 0.05, 0.2, 0.01, 100);
    setTimeout(() => {
      this.playTone(250, 'square', 0.05, 0.2, 0.01, 80);
    }, 60);
    setTimeout(() => {
      this.playTone(350, 'triangle', 0.08, 0.2, 0.01, 150);
    }, 120);
  }

  // Sparkling / love / petting sound
  playLove() {
    // A quick ascending retro arpeggio (C major vibe)
    const notes = [523, 659, 784, 1046];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.1, 0.15, 0.01);
      }, idx * 50);
    });
  }

  // Snoring sleeping sound
  playSnore() {
    // Gentle low-to-high swell and back
    this.playTone(180, 'sine', 0.6, 0.01, 0.1, 200);
    setTimeout(() => {
      this.playTone(200, 'sine', 0.6, 0.1, 0.01, 180);
    }, 600);
  }

  // Level up / purchase success fan-fare
  playSuccess() {
    const notes = [523, 659, 784, 1046, 784, 1046];
    const delays = [0, 80, 160, 240, 360, 440];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.15, 0.2, 0.01);
      }, delays[idx]);
    });
  }

  // Hit wall / error buzz
  playHurt() {
    this.playTone(120, 'sawtooth', 0.12, 0.25, 0.01, 60);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  // Simple background music sequencer
  startBGM() {
    this.init();
    if (this.isPlayingBGM) return;
    this.isPlayingBGM = true;

    let step = 0;
    const playNextNote = () => {
      if (!this.isPlayingBGM || this.isMuted) return;

      const item = this.bgmSequence[step];
      const freq = this.noteFreqs[item.note];
      const beatDuration = 60 / this.bgmTempo;
      const actualDuration = item.dur * beatDuration;

      // Play soft square wave note
      if (freq && this.ctx && this.ctx.state !== 'suspended') {
        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        osc.type = 'triangle'; // triangle is softer and less intrusive
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + actualDuration - 0.02);

        osc.connect(gainNode);
        gainNode.connect(this.bgmVolumeNode);

        osc.start();
        osc.stop(this.ctx.currentTime + actualDuration);
      }

      step = (step + 1) % this.bgmSequence.length;
      this.bgmInterval = setTimeout(playNextNote, actualDuration * 1000);
    };

    playNextNote();
  }

  stopBGM() {
    this.isPlayingBGM = false;
    if (this.bgmInterval) {
      clearTimeout(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

const audio = new AudioManager();
