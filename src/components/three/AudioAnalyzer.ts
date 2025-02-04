export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private source?: MediaElementAudioSourceNode;

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  connectAudio(audioElement: HTMLAudioElement) {
    if (this.source) {
      this.source.disconnect();
    }
    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getFrequencyData() {
    this.analyser.getByteFrequencyData(this.dataArray);
    // Get bass (0-100Hz), kick (100-200Hz), and snare (200-400Hz) frequencies
    const bass = Math.max(...Array.from(this.dataArray.slice(0, 4)));
    const kick = Math.max(...Array.from(this.dataArray.slice(4, 8)));
    const snare = Math.max(...Array.from(this.dataArray.slice(8, 16)));
    return { bass, kick, snare };
  }
}