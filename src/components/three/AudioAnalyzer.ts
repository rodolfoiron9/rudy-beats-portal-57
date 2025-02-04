export class AudioAnalyzer {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private source?: MediaElementAudioSourceNode;
  private lastAnalysisTime: number = 0;
  private readonly analysisInterval: number = 16; // ~60fps
  private lastAnalysis: { bass: number; kick: number; snare: number } = {
    bass: 0,
    kick: 0,
    snare: 0
  };

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256; // Reduced from higher values for better performance
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
    const currentTime = Date.now();
    
    // Return cached analysis if within interval
    if (currentTime - this.lastAnalysisTime < this.analysisInterval) {
      return this.lastAnalysis;
    }

    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Optimize frequency calculations
    this.lastAnalysis = {
      bass: Math.max(...Array.from(this.dataArray.slice(0, 4))),
      kick: Math.max(...Array.from(this.dataArray.slice(4, 8))),
      snare: Math.max(...Array.from(this.dataArray.slice(8, 16)))
    };

    this.lastAnalysisTime = currentTime;
    return this.lastAnalysis;
  }

  disconnect() {
    if (this.source) {
      this.source.disconnect();
      this.source = undefined;
    }
  }
}