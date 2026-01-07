import React from 'react';
import { RankingUser } from '../types';
import { Trophy, Shield } from 'lucide-react';

const RANKING_DATA: RankingUser[] = [
  { id: 'u1', username: 'cyber_monk', rank: 1, aura_level: 42, total_xp: 215000, is_pro: true, avatar_url: 'https://picsum.photos/101/101' },
  { id: 'u2', username: 'dopa_king', rank: 2, aura_level: 38, total_xp: 180300, is_pro: true, avatar_url: 'https://picsum.photos/102/102' },
  { id: 'u3', username: 'iron_lady', rank: 3, aura_level: 35, total_xp: 154000, is_pro: false, avatar_url: 'https://picsum.photos/103/103' },
  { id: 'u4', username: 'rafa_player', rank: 4, aura_level: 27, total_xp: 89000, is_pro: false, avatar_url: 'https://picsum.photos/100/100' }, // Current User
  { id: 'u5', username: 'noob_master', rank: 5, aura_level: 22, total_xp: 65000, is_pro: false, avatar_url: 'https://picsum.photos/105/105' },
];

const Ranking = () => {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="text-center py-4">
        <h1 className="text-3xl font-display font-bold text-white tracking-widest">LEADERBOARD</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Global Season 1</p>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        <button className="px-4 py-2 bg-neon-purple text-white text-sm font-bold rounded-lg shadow-lg shadow-neon-purple/20">Global</button>
        <button className="px-4 py-2 bg-card border border-gray-800 text-gray-400 text-sm font-bold rounded-lg hover:text-white">Friends</button>
      </div>

      {/* Top 3 Podium (Visual) - Simplification for list view mobile first */}
      
      <div className="space-y-3">
        {RANKING_DATA.map((user) => {
           const isCurrentUser = user.username === 'rafa_player';
           return (
            <div 
                key={user.id} 
                className={`flex items-center justify-between p-4 rounded-xl border ${
                    isCurrentUser 
                    ? 'bg-neon-purple/10 border-neon-purple/50' 
                    : 'bg-card border-gray-800'
                }`}
            >
                <div className="flex items-center space-x-4">
                    <div className={`w-8 text-center font-display font-bold text-lg ${
                        user.rank === 1 ? 'text-yellow-400' : 
                        user.rank === 2 ? 'text-gray-300' : 
                        user.rank === 3 ? 'text-orange-400' : 'text-gray-600'
                    }`}>
                        {user.rank}
                    </div>
                    <div className="relative">
                        <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full bg-gray-700" />
                        {user.is_pro && (
                             <div className="absolute -bottom-1 -right-1 bg-neon-purple text-white p-0.5 rounded-full border border-black">
                                <Shield size={8} fill="currentColor" />
                             </div>
                        )}
                    </div>
                    <div>
                        <div className={`font-bold text-sm ${isCurrentUser ? 'text-white' : 'text-gray-300'}`}>
                            {user.username} {isCurrentUser && '(Você)'}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">Aura {user.aura_level}</div>
                    </div>
                </div>
                
                <div className="text-right">
                    <div className="font-display font-bold text-white text-sm">
                        {user.total_xp.toLocaleString()} XP
                    </div>
                </div>
            </div>
           );
        })}
      </div>

      <div className="text-center text-xs text-gray-600 mt-8">
        Farmando Aura em tempo real...
      </div>
    </div>
  );
};

export default Ranking;