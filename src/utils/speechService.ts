// SORA Voice & Speech Recognition Service

export interface SpeechVoiceOption {
  name: string;
  lang: string;
  voiceURI: string;
}

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isSpeaking = false;
  private isMuted = false;
  private onSpeakingChangeCallbacks: ((speaking: boolean) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
    // Prefer clear female English voices
    const preferredVoice = this.voices.find(v => 
      (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Natural')) &&
      v.lang.startsWith('en')
    ) || this.voices.find(v => v.lang.startsWith('en')) || this.voices[0];

    if (preferredVoice && !this.selectedVoice) {
      this.selectedVoice = preferredVoice;
    }
  }

  public getVoices(): SpeechVoiceOption[] {
    if (!this.synth) return [];
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
    return this.voices
      .filter(v => v.lang.startsWith('en') || v.lang.startsWith('es') || v.lang.startsWith('fr') || v.lang.startsWith('hi'))
      .map(v => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI
      }));
  }

  public setVoiceByURI(uri: string) {
    const found = this.voices.find(v => v.voiceURI === uri);
    if (found) {
      this.selectedVoice = found;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth) {
      this.synth.cancel();
      this.setSpeaking(false);
    }
  }

  public isVoiceMuted(): boolean {
    return this.isMuted;
  }

  public onSpeakingChange(cb: (speaking: boolean) => void) {
    this.onSpeakingChangeCallbacks.push(cb);
  }

  private setSpeaking(val: boolean) {
    this.isSpeaking = val;
    this.onSpeakingChangeCallbacks.forEach(cb => cb(val));
  }

  public speak(text: string, onEnd?: () => void) {
    if (this.isMuted || !this.synth) {
      if (onEnd) setTimeout(onEnd, 1200);
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending utterances

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.pitch = 1.05;
      utterance.rate = 0.98;

      utterance.onstart = () => {
        this.setSpeaking(true);
      };

      utterance.onend = () => {
        this.setSpeaking(false);
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        this.setSpeaking(false);
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch {
      this.setSpeaking(false);
      if (onEnd) onEnd();
    }
  }

  public stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.setSpeaking(false);
    }
  }

  // Create Speech Recognition instance if supported
  public createRecognition(
    onResult: (transcript: string) => void,
    onError: (err: string) => void,
    onStateChange: (listening: boolean) => void
  ): { start: () => void; stop: () => void; isSupported: boolean } {
    if (typeof window === 'undefined') {
      return { start: () => {}, stop: () => {}, isSupported: false };
    }

    const windowAny = window as unknown as {
      SpeechRecognition?: new () => any;
      webkitSpeechRecognition?: new () => any;
    };
    const SpeechRecognitionClass = windowAny.SpeechRecognition || windowAny.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      return { start: () => {}, stop: () => {}, isSupported: false };
    }

    try {
      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        onStateChange(true);
      };

      recognition.onend = () => {
        onStateChange(false);
      };

      recognition.onerror = (event: any) => {
        onStateChange(false);
        onError(event.error || 'Speech recognition error');
      };

      recognition.onresult = (event: any) => {
        onStateChange(false);
        if (event.results && event.results[0] && event.results[0][0]) {
          const transcript = event.results[0][0].transcript;
          onResult(transcript);
        }
      };

      return {
        start: () => {
          try {
            recognition.start();
          } catch {
            // Already started
          }
        },
        stop: () => {
          try {
            recognition.stop();
          } catch {
            // Ignore
          }
        },
        isSupported: true
      };
    } catch {
      return { start: () => {}, stop: () => {}, isSupported: false };
    }
  }
}

export const speechService = new SpeechService();
