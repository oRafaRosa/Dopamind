import React from 'react';
import { Users, UserPlus } from 'lucide-react';

const Friends = () => {
  return (
    <div className="animate-slide-up pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-display font-bold text-white">SQUAD</h1>
           <p className="text-gray-500 text-xs uppercase tracking-widest">Seus aliados de guerra</p>
        </div>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center p-4 bg-gray-800/50 rounded-2xl mb-4">
          <Users className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Sistema de Aliados</h3>
        <p className="text-gray-400 text-sm mb-6">
          Em breve você poderá formar squads com outros jogadores, competir juntos e compartilhar conquistas.
        </p>
        <button
          disabled
          className="bg-gray-700 text-gray-500 px-6 py-3 rounded-lg font-bold cursor-not-allowed flex items-center space-x-2 mx-auto"
        >
          <UserPlus size={18} />
          <span>EM BREVE</span>
        </button>
      </div>
    </div>
  );
};

export default Friends;