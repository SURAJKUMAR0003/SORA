import React, { useState, useEffect } from 'react';
import { useHospital } from '../context/HospitalContext';
import { speechService, SpeechVoiceOption } from '../utils/speechService';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  CheckCircle,
  HelpCircle,
  Radio
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'sora' | 'user';
  text: string;
  timestamp: string;
  actionTaken?: string;
}

export const VoiceAssistant: React.FC = () => {
  const {
    robotState,
    handleVoiceCommand,
    isVoiceSpeaking,
    isVoiceMuted,
    toggleMuteVoice,
    speakSora
  } = useHospital();

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechVoiceOption[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>('');

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'sora',
      text: "Hello! I am SORA, your autonomous hospital assistant. You can speak to me or type your request below.",
      timestamp: '15:25'
    }
  ]);

  // Load voices
  useEffect(() => {
    const voices = speechService.getVoices();
    setAvailableVoices(voices);
    if (voices.length > 0 && !selectedVoiceURI) {
      setSelectedVoiceURI(voices[0].voiceURI);
    }
  }, [selectedVoiceURI]);

  // Handle voice selection change
  const handleVoiceChange = (uri: string) => {
    setSelectedVoiceURI(uri);
    speechService.setVoiceByURI(uri);
    speakSora("Voice profile updated.", 'friendly');
  };

  // Process User Submission (from mic or text)
  const processQuery = (query: string) => {
    if (!query.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: time
    };

    setChatHistory(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      const actionResult = handleVoiceCommand(query);

      const soraMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'sora',
        text: actionResult,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionTaken: actionResult
      };

      setChatHistory(prev => [...prev, soraMsg]);
    }, 450);
  };

  // Trigger Microphone Recognition
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const rec = speechService.createRecognition(
      (transcript) => {
        setIsListening(false);
        processQuery(transcript);
      },
      (error) => {
        setIsListening(false);
        console.warn("Speech recognition notice:", error);
      },
      (listening) => {
        setIsListening(listening);
      }
    );

    if (rec.isSupported) {
      rec.start();
    } else {
      setSpeechSupported(false);
      speakSora("Microphone access is not supported or not permitted by this browser. Please use the text input below.", 'thinking');
    }
  };

  // Repeat last SORA utterance
  const repeatLastResponse = () => {
    const lastSoraMsg = [...chatHistory].reverse().find(m => m.sender === 'sora');
    if (lastSoraMsg) {
      speakSora(lastSoraMsg.text, 'friendly');
    }
  };

  const sampleCommands = [
    "Take me to the pharmacy.",
    "Where is the emergency department?",
    "Find the cardiology department.",
    "Show me available doctors.",
    "I want to book an appointment.",
    "Where is the MRI department?",
    "Take me to the billing counter.",
    "Call hospital staff for assistance."
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              SORA MULTIMODAL AI VOICE ASSISTANT
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SPEECHSYNTHESIS + NATURAL INTENTS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive voice dialogues, natural language command routing, and audible vocal responses
            </p>
          </div>
        </div>

        {/* Voice Selector & Mute Controls */}
        <div className="flex items-center gap-3">
          {availableVoices.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Voice Engine:</span>
              <select
                value={selectedVoiceURI}
                onChange={(e) => handleVoiceChange(e.target.value)}
                className="bg-navy-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 max-w-[190px]"
              >
                {availableVoices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name.replace('Microsoft', '').replace('Google', '')} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={toggleMuteVoice}
            className={`p-2 rounded-xl border transition ${
              isVoiceMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-navy-900 text-cyan-400 border-cyan-500/30 hover:bg-navy-800'
            }`}
            title={isVoiceMuted ? 'Unmute SORA' : 'Mute SORA'}
          >
            {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={repeatLastResponse}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            Repeat
          </button>
        </div>
      </div>

      {/* Main Dialogue Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Waveform & Visual State Avatar (5 Cols) */}
        <div className="lg:col-span-5 glass-panel-glow p-6 rounded-3xl flex flex-col justify-between items-center text-center border border-cyan-500/30 relative overflow-hidden">
          {/* State Indicator Badge */}
          <div className="w-full flex justify-between items-center text-xs">
            <span className="px-3 py-1 rounded-full bg-navy-900/80 border border-cyan-500/30 text-cyan-300 font-mono-num font-bold">
              {isListening && 'STATUS: LISTENING...'}
              {isThinking && 'STATUS: PROCESSING INTENT...'}
              {isVoiceSpeaking && 'STATUS: SORA SPEAKING...'}
              {!isListening && !isThinking && !isVoiceSpeaking && 'STATUS: STANDBY READY'}
            </span>
            <span className="text-[11px] text-slate-400">
              Web Audio Synth v2.4
            </span>
          </div>

          {/* SORA Holographic Avatar & Animated Waveform */}
          <div className="my-8 relative flex flex-col items-center">
            {/* Outer Pulsing Concentric Rings */}
            <div className={`w-44 h-44 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
              isListening
                ? 'border-emerald-400 shadow-2xl shadow-emerald-500/30 scale-105'
                : isVoiceSpeaking
                ? 'border-cyan-400 shadow-2xl shadow-cyan-500/40 animate-pulse'
                : isThinking
                ? 'border-amber-400 animate-spin'
                : 'border-cyan-500/30'
            }`}>
              <div className={`w-36 h-36 rounded-full bg-gradient-to-tr from-navy-900 via-navy-800 to-cyan-950 flex flex-col items-center justify-center border border-cyan-400/30 shadow-inner`}>
                <Bot className={`w-14 h-14 ${
                  isListening ? 'text-emerald-400 animate-bounce' : isVoiceSpeaking ? 'text-cyan-300' : 'text-cyan-400'
                }`} />
                <span className="text-[11px] font-bold text-white tracking-widest mt-1">
                  SORA AI
                </span>
              </div>
            </div>

            {/* Audio Waveform Bars Visualization */}
            <div className="flex items-center justify-center gap-1.5 h-12 mt-6">
              {[4, 8, 14, 22, 28, 18, 12, 24, 16, 7].map((height, idx) => (
                <div
                  key={`wave-${idx}`}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isListening
                      ? 'bg-emerald-400'
                      : isVoiceSpeaking
                      ? 'bg-cyan-400'
                      : isThinking
                      ? 'bg-amber-400'
                      : 'bg-slate-700 h-2'
                  }`}
                  style={{
                    height: (isListening || isVoiceSpeaking)
                      ? `${Math.max(6, (height * (1 + Math.sin(Date.now() / 200 + idx))))}px`
                      : '6px'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Large Push-to-Talk Mic Action Button */}
          <div className="w-full flex flex-col items-center gap-3">
            <button
              onClick={toggleListening}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/50 scale-110'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-navy-950 hover:scale-105 shadow-cyan-500/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
            <div className="text-center">
              <span className="text-sm font-bold text-white block">
                {isListening ? 'Listening to speech... Click to Stop' : 'Click to Speak with SORA'}
              </span>
              <span className="text-xs text-slate-400">
                {speechSupported ? 'Microphone audio processed locally' : 'Microphone unavailable — use text input'}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Text Conversation History & Command Prompts (7 Cols) */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-3xl flex flex-col justify-between border border-slate-800 min-h-[500px]">
          {/* Chat Messages Log */}
          <div className="flex-1 overflow-y-auto max-h-[380px] space-y-3 pr-2 mb-4">
            {chatHistory.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'sora' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600/90 text-white rounded-br-none shadow-md'
                      : 'bg-navy-900/90 border border-cyan-500/30 text-slate-100 rounded-bl-none shadow-lg'
                  }`}
                >
                  <p className="font-medium text-sm">{msg.text}</p>
                  
                  {msg.actionTaken && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1.5 text-[11px] text-cyan-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      Executed: {msg.actionTaken}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-right mt-1 font-mono-num">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick Pre-set Voice Commands Chips */}
          <div className="mb-4">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Frequently Spoken Commands (Click to Test):
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sampleCommands.map((cmd, idx) => (
                <button
                  key={`cmd-${idx}`}
                  onClick={() => processQuery(cmd)}
                  className="px-2.5 py-1 rounded-lg bg-navy-900 hover:bg-navy-800 border border-slate-700 hover:border-cyan-400 text-[11px] text-slate-300 transition"
                >
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>

          {/* Text Input Fallback Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processQuery(inputQuery);
            }}
            className="flex items-center gap-2 pt-2 border-t border-slate-800"
          >
            <input
              type="text"
              placeholder="Type a command or ask SORA a question..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-navy-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-navy-950 font-bold transition shadow-lg"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
