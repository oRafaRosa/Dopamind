import React, { useEffect, useState } from 'react';
import { Trophy, CheckCircle2, Zap, Star } from 'lucide-react';

interface PerfectDayModalProps {
  xpGained: number; // Total XP (Task + Bonus)
  isOpen: boolean;
  onClose: () => void;
}

const PerfectDayModal: React.FC<PerfectDayModalProps> = ({ xpGained, isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      playSound();
      // Auto close after 4 seconds to let the user bask in glory
      const timer = setTimeout(() => {
        handleClose();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 500);
  };

  const playSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        
        const ctx = new AudioContext();
        const t = ctx.currentTime;
        
        // Melodic sequence for "Success"
        const playNote = (freq: number, startTime: number, duration: number, type: OscillatorType = 'sine') => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.1, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        // Chord: C major up sweep
        playNote(523.25, t, 0.2, 'triangle'); // C5
        playNote(659.25, t + 0.1, 0.2, 'triangle'); // E5
        playNote(783.99, t + 0.2, 0.4, 'triangle'); // G5
        playNote(1046.50, t + 0.3, 0.8, 'sine'); // C6 (High finish)
        
    } catch (e) {
        console.error("Audio play failed", e);
    }
  };

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center px-4 transition-all duration-500 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={handleClose} />
      
      {/* Background Rays Animation */}
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${show ? 'opacity-30' : 'opacity-0'}`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-gradient-to-r from-transparent via-neon-green/20 to-transparent animate-[spin_10s_linear_infinite]" />
      </div>

      <div className={`relative w-full max-w-sm text-center transform transition-all duration-700 ${show ? 'scale-100 translate-y-0' : 'scale-75 translate-y-20'}`}>
        
        {/* Animated Icon */}
        <div className="relative mb-8 inline-block">
             <div className="absolute inset-0 bg-neon-green blur-2xl opacity-60 rounded-full animate-pulse"></div>
             <div className="relative bg-black border-4 border-neon-green rounded-full p-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                <Trophy className="text-neon-green w-16 h-16 animate-bounce" strokeWidth={1.5} />
             </div>
             {/* Stars */}
             <Star className="absolute -top-2 -right-4 text-yellow-400 fill-yellow-400 w-8 h-8 animate-[ping_1s_ease-in-out_infinite]" />
             <Star className="absolute bottom-0 -left-6 text-yellow-400 fill-yellow-400 w-6 h-6 animate-[bounce_2s_infinite]" />
        </div>

        <h2 className="text-6xl font-display font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 italic tracking-tighter mb-2 drop-shadow-2xl">
            GG.
        </h2>
        
        <div className="text-2xl font-bold text-white tracking-widest uppercase mb-6 border-y border-neon-green/30 py-2 bg-neon-green/5">
            DIA COMPLETO
        </div>
        
        <div className="space-y-2 mb-8">
            <div className="text-neon-green text-5xl font-black font-display tracking-tight drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            +{xpGained} XP
            </div>
            <p className="text-gray-400 text-sm font-medium">Bônus de Perfeição Incluído</p>
        </div>

        <button 
            onClick={handleClose}
            className="bg-white text-black font-bold py-3 px-8 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
        >
            RESGATAR RECOMPENSA
        </button>
      </div>
    </div>
  );
};

export default PerfectDayModal;