import React, { useEffect, useState } from 'react';
import { Zap, X } from 'lucide-react';

interface XPModalProps {
  xp: number;
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

const XPModal: React.FC<XPModalProps> = ({ xp, message, isOpen, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  if (!isOpen && !show) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose} />
      
      <div className={`relative bg-card border border-neon-green/30 w-full max-w-xs p-8 rounded-2xl shadow-2xl shadow-neon-green/20 text-center transform transition-all duration-500 ${show ? 'scale-100 translate-y-0' : 'scale-90 translate-y-10'}`}>
        
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
             <div className="relative">
                <div className="absolute inset-0 bg-neon-green blur-xl opacity-50 rounded-full animate-pulse-slow"></div>
                <div className="relative bg-black border-2 border-neon-green rounded-full p-4">
                    <Zap className="text-neon-green w-10 h-10" fill="currentColor" />
                </div>
             </div>
        </div>

        <h2 className="text-3xl font-display font-bold text-white mt-6 mb-2">NICE.</h2>
        <div className="text-neon-green text-5xl font-black font-display tracking-tighter mb-4">
          +{xp} <span className="text-lg font-bold text-gray-400">XP</span>
        </div>
        
        <p className="text-gray-300 font-medium italic">"{message}"</p>

        <button 
            onClick={handleClose}
            className="mt-6 text-sm text-gray-500 hover:text-white uppercase tracking-widest font-bold"
        >
            Fechar
        </button>
      </div>
    </div>
  );
};

export default XPModal;