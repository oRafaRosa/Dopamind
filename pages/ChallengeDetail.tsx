import React from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Shield, Zap } from 'lucide-react';

const ChallengeDetail = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={20} className="mr-1" /> Voltar
      </button>

      <div className="bg-card border border-gray-800 rounded-3xl overflow-hidden relative">
        <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800 p-6 relative">
            <div className="absolute top-0 right-0 p-6 opacity-20">
                <Shield size={120} className="text-white" />
            </div>
            <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded border border-red-500/20">
                        HARD MODE
                    </span>
                    <span className="bg-neon-purple/20 text-neon-purple text-[10px] font-bold px-2 py-0.5 rounded border border-neon-purple/30">PRO</span>
                </div>
                <h1 className="text-3xl font-display font-bold text-white leading-none">Sistema de Desafios</h1>
            </div>
        </div>

        <div className="p-6 text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gray-800/50 rounded-2xl mb-4">
                <Zap className="w-12 h-12 text-neon-purple" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Desafios Avançados</h3>
            <p className="text-gray-400 text-sm mb-6">
                Em breve você poderá participar de desafios especiais com outros jogadores, ganhar recompensas exclusivas e competir por posições no ranking.
            </p>
            <button
                onClick={() => navigate('/challenges')}
                className="bg-gray-700 text-gray-300 px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors"
            >
                VOLTAR PARA DESAFIOS
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;