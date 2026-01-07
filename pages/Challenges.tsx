import React from 'react';
import { Challenge } from '../types';
import { Lock, Users, Clock, Check, Plus } from 'lucide-react';
import { useNavigate } from '../components/Layout';

const CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: 'Reset Dopamina',
    description: '14 dias sem redes sociais, açúcar e conteúdo adulto. Limpe sua mente.',
    duration_days: 14,
    difficulty: 'Hard Mode',
    reward_xp: 1200,
    pro_only: true,
    participants: 412,
    joined: false
  },
  {
    id: '2',
    title: 'Corpo em Ordem',
    description: 'Beber 3L de água e treinar 30min todo dia.',
    duration_days: 30,
    difficulty: 'Casual',
    reward_xp: 1500,
    pro_only: false,
    participants: 1205,
    joined: true
  },
  {
    id: '3',
    title: 'Monge Moderno',
    description: 'Meditação e leitura diária. Sem música durante trabalho.',
    duration_days: 7,
    difficulty: 'Hard Mode',
    reward_xp: 800,
    pro_only: true,
    participants: 89,
    joined: false
  }
];

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-display text-white">CHALLENGES</h1>
        <div className="bg-gray-800 p-1 rounded-lg flex text-xs font-bold">
            <button className="bg-card text-white px-3 py-1 rounded shadow-sm">Todos</button>
            <button className="text-gray-500 px-3 py-1 hover:text-white">Meus</button>
        </div>
      </div>

      <div className="grid gap-4">
        {CHALLENGES.map((challenge) => (
            <div 
                key={challenge.id} 
                onClick={() => navigate(`/app/challenges/${challenge.id}`)}
                className="bg-card border border-gray-800 rounded-2xl p-5 relative overflow-hidden group cursor-pointer hover:border-gray-700 transition-all active:scale-[0.98]"
            >
                {/* Background Glow for Joined */}
                {challenge.joined && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-green/5 rounded-full blur-2xl -translate-y-10 translate-x-10 pointer-events-none"></div>
                )}
                
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-2">
                        {challenge.pro_only && (
                            <span className="bg-neon-purple/20 text-neon-purple text-[10px] font-bold px-2 py-0.5 rounded border border-neon-purple/30">PRO</span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            challenge.difficulty === 'Hard Mode' 
                            ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                            : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        }`}>
                            {challenge.difficulty.toUpperCase()}
                        </span>
                    </div>
                    {challenge.joined ? (
                        <div className="flex items-center text-neon-green text-xs font-bold bg-neon-green/10 px-2 py-1 rounded-full">
                            <Check size={12} className="mr-1" /> ATIVO
                        </div>
                    ) : (
                        <div className="text-neon-purple text-xs font-bold">
                            +{challenge.reward_xp} XP
                        </div>
                    )}
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{challenge.title}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">{challenge.description}</p>

                <div className="flex items-center justify-between border-t border-gray-800 pt-4 mt-2">
                    <div className="flex space-x-4 text-xs text-gray-500 font-medium">
                        <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {challenge.duration_days} dias
                        </div>
                        <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {challenge.participants}
                        </div>
                    </div>

                    <div className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        challenge.joined 
                        ? 'bg-gray-800 text-gray-400'
                        : challenge.pro_only 
                            ? 'bg-gray-800 text-gray-400 border border-gray-700 flex items-center' 
                            : 'bg-white text-black'
                    }`}>
                        {challenge.joined ? 'Ver Progresso' : challenge.pro_only ? <><Lock size={14} className="mr-1"/> Locked</> : 'Detalhes'}
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* PRO CTA */}
      <div className="bg-gradient-to-br from-neon-purple/20 to-blue-600/10 border border-neon-purple/30 rounded-2xl p-6 text-center mt-8">
        <h3 className="text-lg font-bold text-white mb-2">Crie seu próprio Desafio</h3>
        <p className="text-sm text-gray-300 mb-4">Convide amigos, defina regras Hard Mode e veja quem aguenta.</p>
        <button 
            onClick={() => navigate('/app/challenges/create')}
            className="bg-neon-purple text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-neon-purple/20 hover:scale-105 transition-transform flex items-center justify-center space-x-2 mx-auto"
        >
            <Plus size={16} />
            <span>CRIAR (PRO)</span>
        </button>
      </div>
    </div>
  );
};

export default Challenges;