import React from 'react';
import { RankingUser } from '../types';
import { Trophy, Shield, Medal, Crown } from 'lucide-react';

const RANKING_DATA: RankingUser[] = [
  { 
    id: 'u1', 
    username: 'cyber_monk', 
    rank: 1, 
    aura_level: 42, 
    total_xp: 215000, 
    is_pro: true, 
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    badges: 24 
  },
  { 
    id: 'u2', 
    username: 'dopa_king', 
    rank: 2, 
    aura_level: 38, 
    total_xp: 180300, 
    is_pro: true, 
    avatar_url: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
    badges: 18
  },
  { 
    id: 'u3', 
    username: 'iron_lady', 
    rank: 3, 
    aura_level: 35, 
    total_xp: 154000, 
    is_pro: false, 
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    badges: 12
  },
  { 
    id: 'u4', 
    username: 'rafa_player', 
    rank: 4, 
    aura_level: 27, 
    total_xp: 89000, 
    is_pro: false, 
    avatar_url: 'https://picsum.photos/100/100',
    badges: 5
  },
  { 
    id: 'u5', 
    username: 'noob_master', 
    rank: 5, 
    aura_level: 22, 
    total_xp: 65000, 
    is_pro: false, 
    avatar_url: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&auto=format&fit=crop',
    badges: 3
  },
];

const Ranking = () => {
  return (
    <div className="space-y-6 animate-slide-up pb-20">
      <div className="text-center py-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-neon-purple/20 blur-3xl rounded-full pointer-events-none"></div>
        <h1 className="text-3xl font-display font-bold text-white tracking-widest relative z-10">LEADERBOARD</h1>
        <p className="text-gray-500 text-xs uppercase tracking-widest mt-1">Global Season 1</p>
      </div>

      <div className="flex justify-center space-x-2 mb-6">
        <button className="px-4 py-2 bg-neon-purple text-white text-sm font-bold rounded-lg shadow-lg shadow-neon-purple/20 transition-transform active:scale-95">Global</button>
        <button className="px-4 py-2 bg-card border border-gray-800 text-gray-400 text-sm font-bold rounded-lg hover:text-white transition-transform active:scale-95">Friends</button>
      </div>
      
      <div className="space-y-3">
        {RANKING_DATA.map((user) => {
           const isCurrentUser = user.username === 'rafa_player';
           return (
            <div 
                key={user.id} 
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isCurrentUser 
                    ? 'bg-neon-purple/10 border-neon-purple/50 shadow-lg shadow-neon-purple/5' 
                    : 'bg-card border-gray-800 hover:border-gray-700'
                }`}
            >
                <div className="flex items-center space-x-4">
                    {/* Rank Number */}
                    <div className={`w-6 text-center font-display font-bold text-lg ${
                        user.rank === 1 ? 'text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]' : 
                        user.rank === 2 ? 'text-gray-300' : 
                        user.rank === 3 ? 'text-orange-400' : 'text-gray-600'
                    }`}>
                        {user.rank}
                    </div>

                    {/* Avatar with PRO Frame logic */}
                    <div className="relative group">
                        <div className={`relative p-[2px] rounded-full ${
                            user.is_pro 
                            ? 'bg-gradient-to-tr from-neon-purple via-blue-500 to-neon-purple animate-pulse-slow shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                            : 'bg-transparent'
                        }`}>
                             <img 
                                src={user.avatar_url} 
                                alt={user.username} 
                                className={`w-12 h-12 rounded-full object-cover border-2 ${
                                    user.is_pro ? 'border-transparent' : 'border-gray-700'
                                }`} 
                            />
                        </div>

                        {/* PRO Badge/Icon */}
                        {user.is_pro && (
                             <div className="absolute -top-2 -right-1 bg-black text-neon-purple p-1 rounded-full border border-neon-purple/50 shadow-lg z-10">
                                <Crown size={10} fill="currentColor" />
                             </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div>
                        <div className="flex items-center space-x-1">
                            <span className={`font-bold text-sm ${isCurrentUser ? 'text-white' : 'text-gray-200'}`}>
                                {user.username}
                            </span>
                            {isCurrentUser && <span className="text-[10px] text-gray-500 font-mono">(Você)</span>}
                        </div>
                        <div className="flex items-center space-x-3 mt-0.5">
                             <span className="text-xs text-neon-purple font-bold">Lvl {user.aura_level}</span>
                             
                             {/* Badge Count Indicator */}
                             {user.badges > 0 && (
                                <div className="flex items-center text-[10px] text-gray-500 bg-gray-900 px-1.5 py-0.5 rounded border border-gray-800">
                                    <Medal size={10} className="mr-1 text-yellow-500" />
                                    {user.badges}
                                </div>
                             )}
                        </div>
                    </div>
                </div>
                
                {/* XP Column */}
                <div className="text-right">
                    <div className="font-display font-bold text-white text-sm">
                        {(user.total_xp / 1000).toFixed(1)}k <span className="text-gray-600 text-[10px]">XP</span>
                    </div>
                </div>
            </div>
           );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-900/30 rounded-xl border border-gray-800/50 text-center">
        <p className="text-xs text-gray-500 mb-2">Quer sua moldura neon?</p>
        <button className="text-neon-purple text-xs font-bold uppercase tracking-widest border-b border-neon-purple pb-0.5 hover:text-white hover:border-white transition-colors">
            Virar PRO agora
        </button>
      </div>
    </div>
  );
};

export default Ranking;