import React, { useState } from 'react';
import { useParams, useNavigate } from '../components/Layout';
import { ArrowLeft, Clock, Users, Shield, Zap, CheckCircle2 } from 'lucide-react';
import { Challenge } from '../types';

// Mock Data (in a real app, fetch from Supabase by ID)
const MOCK_CHALLENGES: Record<string, Challenge> = {
  '1': {
    id: '1',
    title: 'Reset Dopamina',
    description: '14 dias para recalibrar seu sistema de recompensa. Corte o ruído.',
    duration_days: 14,
    difficulty: 'Hard Mode',
    reward_xp: 1200,
    pro_only: true,
    participants: 412,
    joined: false,
    rules: [
      'Sem redes sociais (exceto trabalho)',
      'Zero açúcar refinado',
      'Sem conteúdo adulto',
      'Leitura obrigatória (10 pág/dia)'
    ]
  },
  '2': {
    id: '2',
    title: 'Corpo em Ordem',
    description: 'O básico que funciona. Hidratação e movimento constante.',
    duration_days: 30,
    difficulty: 'Casual',
    reward_xp: 1500,
    pro_only: false,
    participants: 1205,
    joined: true,
    rules: [
      'Beber 3L de água',
      '30 min de movimento (qualquer)',
      'Foto do treino (evidência)'
    ]
  },
  '3': {
    id: '3',
    title: 'Monge Moderno',
    description: 'Foco total. Elimine distrações e domine sua atenção.',
    duration_days: 7,
    difficulty: 'Hard Mode',
    reward_xp: 800,
    pro_only: true,
    participants: 89,
    joined: false,
    rules: [
      'Meditação (10 min)',
      'Sem música no trabalho',
      'Celular em modo avião após 20h'
    ]
  }
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  
  const challenge = id ? MOCK_CHALLENGES[id] : null;

  if (!challenge) {
    return <div className="p-8 text-center text-gray-500">Challenge not found.</div>;
  }

  // Use local state to toggle join for demo, or initial state
  const isJoined = joined || challenge.joined;

  const handleJoin = () => {
    setJoined(true);
    // In real app: call Supabase insert challenge_members
  };

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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        challenge.difficulty === 'Hard Mode' 
                        ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    }`}>
                        {challenge.difficulty.toUpperCase()}
                    </span>
                    {challenge.pro_only && (
                        <span className="bg-neon-purple/20 text-neon-purple text-[10px] font-bold px-2 py-0.5 rounded border border-neon-purple/30">PRO</span>
                    )}
                </div>
                <h1 className="text-3xl font-display font-bold text-white leading-none">{challenge.title}</h1>
            </div>
        </div>

        <div className="p-6">
            <div className="flex items-center justify-between mb-6 text-sm text-gray-400">
                <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-neon-purple" />
                    <span>{challenge.duration_days} dias</span>
                </div>
                <div className="flex items-center">
                    <Users size={16} className="mr-2 text-neon-blue" />
                    <span>{challenge.participants} players</span>
                </div>
                <div className="flex items-center text-neon-green font-bold">
                    <Zap size={16} className="mr-1" fill="currentColor" />
                    <span>+{challenge.reward_xp} XP</span>
                </div>
            </div>

            <p className="text-gray-300 mb-8 leading-relaxed">
                {challenge.description}
            </p>

            <div className="space-y-4 mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Regras do Jogo</h3>
                <ul className="space-y-3">
                    {challenge.rules?.map((rule, index) => (
                        <li key={index} className="flex items-start text-gray-400 text-sm">
                            <div className="mt-1 mr-3 w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0"></div>
                            {rule}
                        </li>
                    ))}
                </ul>
            </div>

            {isJoined ? (
                <div className="w-full bg-gray-800 border border-gray-700 text-gray-300 font-bold py-4 rounded-xl flex items-center justify-center space-x-2">
                    <CheckCircle2 size={20} className="text-neon-green" />
                    <span>DESAFIO ATIVO</span>
                </div>
            ) : (
                <button 
                    onClick={handleJoin}
                    className="w-full bg-neon-purple hover:bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-neon-purple/20 transition-all transform active:scale-95"
                >
                    ACEITAR DESAFIO
                </button>
            )}

            {!isJoined && challenge.difficulty === 'Hard Mode' && (
                <p className="text-center text-[10px] text-red-500 mt-4 uppercase font-bold tracking-wider">
                    ⚠️ Atenção: Falhar um dia resulta em eliminação.
                </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetail;