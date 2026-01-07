import React, { useState } from 'react';
import { X, Check, Zap, Crown, Shield } from 'lucide-react';

interface ProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProModal: React.FC<ProModalProps> = ({ isOpen, onClose }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsLoading(true);
    // Simulate checkout
    setTimeout(() => {
        setIsLoading(false);
        alert("Checkout simulado! Bem-vindo ao Hard Mode.");
        onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-card w-full max-w-md rounded-3xl border border-neon-purple/30 overflow-hidden relative shadow-2xl shadow-neon-purple/20">
        
        {/* Header Image/Gradient */}
        <div className="h-32 bg-gradient-to-br from-neon-purple/20 via-purple-900/40 to-black relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors backdrop-blur-sm"
            >
                <X size={20} />
            </button>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center border-4 border-card shadow-lg shadow-neon-purple/50">
                    <Crown size={32} className="text-white" fill="currentColor" />
                </div>
            </div>
        </div>

        <div className="pt-10 pb-8 px-6 text-center">
            <h2 className="text-2xl font-display font-bold text-white mb-1">UNLOCK HARD MODE</h2>
            <p className="text-gray-400 text-sm mb-6">A evolução real não é de graça. Invista na sua máquina.</p>

            {/* Benefits */}
            <div className="space-y-3 mb-8 text-left bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <Shield size={16} className="text-neon-purple flex-shrink-0" />
                    <span>Acesso a Challenges exclusivos & Hard Mode</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <Zap size={16} className="text-neon-purple flex-shrink-0" />
                    <span>Multiplicador de XP (1.5x)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-300">
                    <Crown size={16} className="text-neon-purple flex-shrink-0" />
                    <span>Crie seus próprios Desafios e convide amigos</span>
                </div>
            </div>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center space-x-4 mb-6">
                <button 
                    onClick={() => setBillingCycle('monthly')}
                    className={`text-sm font-bold px-4 py-2 rounded-lg transition-colors ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Mensal
                </button>
                <button 
                    onClick={() => setBillingCycle('yearly')}
                    className={`relative text-sm font-bold px-4 py-2 rounded-lg transition-colors ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                >
                    Anual
                    <span className="absolute -top-3 -right-2 bg-neon-green text-black text-[9px] px-1.5 py-0.5 rounded font-black transform rotate-6">
                        -45% OFF
                    </span>
                </button>
            </div>

            {/* Price Display */}
            <div className="mb-6">
                {billingCycle === 'yearly' ? (
                    <div className="animate-slide-up">
                        <div className="flex items-center justify-center space-x-2">
                            <span className="text-Gray-500 line-through text-sm">R$ 358,80</span>
                            <span className="text-4xl font-display font-bold text-white">R$ 199,90</span>
                            <span className="text-gray-500 text-sm">/ano</span>
                        </div>
                        <p className="text-neon-green text-xs font-bold mt-1">Apenas R$ 16,60 / mês</p>
                    </div>
                ) : (
                    <div className="animate-slide-up">
                         <div className="flex items-center justify-center space-x-2">
                            <span className="text-4xl font-display font-bold text-white">R$ 29,90</span>
                            <span className="text-gray-500 text-sm">/mês</span>
                        </div>
                        <p className="text-gray-500 text-xs font-bold mt-1">Cancele quando quiser</p>
                    </div>
                )}
            </div>

            <button 
                onClick={handleSubscribe}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-neon-purple to-purple-600 hover:from-purple-500 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-neon-purple/20 transform active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
                {isLoading ? (
                    <span>Processando...</span>
                ) : (
                    <>
                        <Zap size={20} fill="currentColor" />
                        <span>ATIVAR HARD MODE</span>
                    </>
                )}
            </button>
            
            <p className="text-[10px] text-gray-600 mt-4">
                Pagamento seguro processado via Stripe. <br/>
                Sua dopamina agradece.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ProModal;