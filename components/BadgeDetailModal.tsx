import React from 'react';
import { Badge } from '../types';
import { X, Lock, Calendar, Award, Flame, Zap, Skull, Crown, Star, Medal } from 'lucide-react';

interface BadgeDetailModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
}

const BadgeDetailModal: React.FC<BadgeDetailModalProps> = ({ badge, isOpen, onClose }) => {
  if (!isOpen || !badge) return null;

  // Helper to resolve icon string to component
  const getIcon = (name: string) => {
    switch(name) {
        case 'Flame': return Flame;
        case 'Zap': return Zap;
        case 'Skull': return Skull;
        case 'Crown': return Crown;
        case 'Star': return Star;
        case 'Medal': return Medal;
        default: return Award;
    }
  };

  const IconComponent = getIcon(badge.icon_name);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-4 animate-fade-in">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-card border border-gray-800 w-full max-w-sm rounded-2xl p-6 relative z-10 animate-slide-up shadow-2xl shadow-purple-900/20">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
            </button>
            
            <div className="flex flex-col items-center text-center">
                {/* Badge Icon Container */}
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 transition-all duration-500 ${
                    badge.unlocked_at 
                    ? 'bg-neon-purple/10 border-neon-purple text-neon-purple shadow-[0_0_20px_rgba(168,85,247,0.4)]' 
                    : 'bg-gray-900 border-gray-700 text-gray-600 grayscale'
                }`}>
                    <IconComponent size={40} />
                </div>

                <h2 className="text-2xl font-display font-bold text-white mb-2">{badge.name}</h2>
                <p className="text-gray-400 mb-6 leading-relaxed text-sm">{badge.description}</p>

                {/* Status Box */}
                <div className="w-full bg-gray-900/50 rounded-xl p-4 border border-gray-800">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Status</span>
                        {badge.unlocked_at ? (
                            <span className="text-neon-green font-bold flex items-center text-xs tracking-wider">
                                DESBLOQUEADO
                            </span>
                        ) : (
                            <span className="text-gray-500 font-bold flex items-center text-xs tracking-wider">
                                <Lock size={12} className="mr-1" /> BLOQUEADO
                            </span>
                        )}
                    </div>
                    {badge.unlocked_at && (
                         <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-gray-800">
                            <span className="text-gray-500 font-bold uppercase tracking-wider text-xs">Desbloqueado em</span>
                            <span className="text-gray-300 flex items-center text-xs font-mono">
                                <Calendar size={12} className="mr-1" /> {badge.unlocked_at}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default BadgeDetailModal;