import React, { useState, useEffect, useRef } from 'react';

interface VoiceInputProps {
  onSendMessage: (text: string) => void;
  isProcessing: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onSendMessage, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as any;
    const SpeechRecognition = win.webkitSpeechRecognition || win.SpeechRecognition;

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results)
          // @ts-ignore
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscript(currentTranscript);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      if (transcript) {
        onSendMessage(transcript);
        setTranscript('');
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && transcript.trim() && !isProcessing) {
      onSendMessage(transcript);
      setTranscript('');
    }
  };

  return (
    <div className="relative">
      <div className={`
        glass-panel p-2 rounded-2xl flex items-center gap-3 transition-all duration-300
        ${isListening ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' : 'border-slate-700'}
      `}>
        <button
          onClick={toggleListening}
          className={`
            p-4 rounded-xl transition-all duration-300 flex-shrink-0
            ${isListening 
              ? 'bg-red-500/20 text-red-400 animate-pulse' 
              : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            }
          `}
        >
          {isListening ? (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4z" /></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          )}
        </button>

        <input
          type="text"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Say something or type command..."}
          className="bg-transparent w-full outline-none text-slate-100 placeholder-slate-500"
          disabled={isProcessing}
        />

        {isProcessing && (
          <div className="pr-4">
             <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Visualizer bars when listening */}
      {isListening && (
        <div className="absolute -top-12 left-0 right-0 flex justify-center items-end gap-1 h-10 pointer-events-none">
           {[...Array(12)].map((_, i) => (
             <div 
                key={i} 
                className="w-1 bg-cyan-500 rounded-full animate-bounce"
                style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                }} 
             />
           ))}
        </div>
      )}
    </div>
  );
};

export default VoiceInput;