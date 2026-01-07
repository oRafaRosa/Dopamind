import React, { useState } from 'react';
import { Settings, Shield, Crown, TrendingUp, Award, Lock, Flame, Zap, Skull, Star, Medal } from 'lucide-react';
import { useNavigate } from '../components/Layout';
import ProModal from '../components/ProModal';
import StatsRadar from '../components/StatsRadar';
import CalendarWidget from '../components/CalendarWidget';
import BadgeDetailModal from '../components/BadgeDetailModal';
import { Badge, Profile as ProfileType } from '../types';

const MOCK_BADGES: Badge[] = [
    { 
        id: '1', 
        slug: 'streak-7', 
        name: 'Week Warrior', 
        description: 'Mantenha um streak (sequência) de 7 dias consecutivos.', 
        icon_name: 'Flame', 
        unlocked_at: '2023-10-10' 
    },
    { 
        id: '2', 
        slug: 'xp-10k', 
        name: 'High Born', 
        description: 'Acumule um total de 10.000 XP na sua jornada.', 
        icon_name: 'Zap', 
        unlocked_at: '2023-09-15' 
    },
    { 
        id: '3', 
        slug: 'perfect-10', 
        name: 'Perfect Ten', 
        description: 'Complete 10 dias perfeitos (todas as tarefas) em um único mês.', 
        icon_name: 'Medal', 
        unlocked_at: undefined 
    },
    { 
        id: '4', 
        slug: 'hard-mode', 
        name: 'Survivor', 
        description: 'Complete 1 Challenge em dificuldade Hard Mode sem falhar nenhum dia.', 
        icon_name: 'Skull', 
        unlocked_at: undefined 
    }, 
    { 
        id: '5', 
        slug: 'early', 
        name: 'Founder', 
        description: 'Usuário Beta: Esteve aqui antes do hype.', 
        icon_name: 'Star', 
        unlocked_at: '2023-01-01' 
    },
];

const MOCK_PROFILE: ProfileType = {
  id: '1',
  username: 'rafa_player',
  display_name: 'Rafa Player',
  avatar_url: 'https://picsum.photos/100/100',
  is_pro: false,
  total_xp: 3420,
  aura_level: 27,
  streak: 6,
  credits: 450,
  stats: {
    str: 65,
    int: 80,
    foc: 45,
    spi: 30,
    cha: 55
  }
};

const Profile = () => {
    const navigate = useNavigate();
    const [isProModalOpen, setIsProModalOpen] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
    const profile = MOCK_PROFILE;

    const getBadgeIcon = (name: string) => {
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

    return (
        <div className="space-y-6 animate-slide-up pb-20">
            {/* Header Card */}
            <div className="bg-card border border-gray-800 rounded-2xl p-6 text-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-800/50 to-transparent"></div>
                 
                 <div className="relative z-10">
                    <div className="relative inline-block">
                        <img src={profile.avatar_url} className="w-24 h-24 rounded-full mx-auto border-4 border-card shadow-xl" alt="Profile" />
                        {/* Status Badge */}
                        <div className="absolute bottom-0 right-0 bg-gray-800 text-[10px] font-bold px-2 py-0.5 rounded border border-gray-600 text-gray-400">
                            FREE
                        </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-white mt-4">{profile.display_name}</h2>
                    <p className="text-gray-500 text-sm">@{profile.username}</p>
                    
                    <div className="flex justify-center mt-6 space-x-8">
                        <div className="text-center">
                            <div className="text-2xl font-display font-bold text-white">{profile.aura_level}</div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Aura Level</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-display font-bold text-orange-500">{profile.streak}</div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Streak</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-display font-bold text-neon-blue">84%</div>
                            <div className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Win Rate</div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* RPG Stats Radar */}
            <div>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1 flex items-center justify-between">
                    <span>Atributos</span>
                    <span className="text-[9px] bg-gray-800 px-2 py-0.5 rounded text-gray-400">CLASS: HYBRID</span>
                 </h3>
                 <div className="bg-card border border-gray-800 rounded-2xl p-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Crown size={80} />
                    </div>
                    {/* Ensure stats exist before rendering */}
                    {profile.stats && <StatsRadar stats={profile.stats} />}
                    
                    <div className="grid grid-cols-5 gap-1 text-center pb-4 px-2">
                        <div>
                            <div className="text-[10px] text-emerald-500 font-bold">STR</div>
                            <div className="text-[9px] text-gray-500">Corpo</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-blue-500 font-bold">INT</div>
                            <div className="text-[9px] text-gray-500">Mente</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-purple-500 font-bold">FOC</div>
                            <div className="text-[9px] text-gray-500">Trab</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-amber-500 font-bold">SPI</div>
                            <div className="text-[9px] text-gray-500">Espír</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-pink-500 font-bold">CHA</div>
                            <div className="text-[9px] text-gray-500">Social</div>
                        </div>
                    </div>
                 </div>
            </div>

            {/* Calendar Consistency View */}
            <CalendarWidget />

            {/* Badges Section */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Conquistas</h3>
                <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide px-1">
                    {MOCK_BADGES.map((badge) => {
                        const Icon = getBadgeIcon(badge.icon_name);
                        return (
                            <button 
                                key={badge.id}
                                onClick={() => setSelectedBadge(badge)}
                                className={`flex-shrink-0 w-20 h-28 bg-card border rounded-xl flex flex-col items-center justify-center p-2 text-center relative transition-all active:scale-95 ${
                                    badge.unlocked_at 
                                    ? 'border-neon-purple/30 shadow-lg shadow-neon-purple/5' 
                                    : 'border-gray-800 opacity-60'
                                }`}
                            >
                                 <div className={`mb-3 p-2.5 rounded-full ${
                                     badge.unlocked_at 
                                     ? 'bg-neon-purple/10 text-neon-purple' 
                                     : 'bg-gray-800 text-gray-500 grayscale'
                                 }`}>
                                     <Icon size={20} />
                                 </div>
                                 <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">{badge.name}</span>
                                 {!badge.unlocked_at && (
                                    <div className="absolute top-2 right-2 text-gray-600">
                                        <Lock size={10} />
                                    </div>
                                 )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Pro Card */}
            <div 
                onClick={() => setIsProModalOpen(true)}
                className="bg-gradient-to-r from-neon-purple/10 to-blue-500/10 border border-neon-purple/40 rounded-2xl p-6 relative overflow-hidden group cursor-pointer hover:border-neon-purple transition-all active:scale-[0.99]"
            >
                <div className="absolute top-2 right-2">
                    <Crown className="text-neon-purple animate-pulse-slow" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">DOPAMIND PRO</h3>
                <ul className="space-y-2 mb-4">
                    <li className="flex items-center text-sm text-gray-300">
                        <Shield size={14} className="mr-2 text-neon-purple" /> Unlock Hard Mode
                    </li>
                    <li className="flex items-center text-sm text-gray-300">
                        <Shield size={14} className="mr-2 text-neon-purple" /> Create Challenges
                    </li>
                    <li className="flex items-center text-sm text-gray-300">
                        <Shield size={14} className="mr-2 text-neon-purple" /> Friends Analytics
                    </li>
                </ul>
                <button className="w-full bg-neon-purple text-white font-bold py-3 rounded-lg text-sm shadow-lg shadow-neon-purple/20">
                    UNLOCK HARD MODE
                </button>
            </div>

            {/* Settings List */}
            <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
                <div 
                    onClick={() => navigate('/app/profile/settings')}
                    className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <Settings size={20} className="text-gray-400" />
                        <span className="text-sm font-medium text-white">Configurações</span>
                    </div>
                </div>
                <div 
                    onClick={() => navigate('/app/profile/history')}
                    className="p-4 flex items-center justify-between border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                    <div className="flex items-center space-x-3">
                        <TrendingUp size={20} className="text-gray-400" />
                        <span className="text-sm font-medium text-white">Histórico de XP (Ledger)</span>
                    </div>
                </div>
            </div>

            <div className="text-center pb-8 pt-4">
                <p className="text-[10px] text-gray-700 font-mono">DOPAMIND v0.3.1 • Built with Aura</p>
            </div>

            <ProModal isOpen={isProModalOpen} onClose={() => setIsProModalOpen(false)} />
            <BadgeDetailModal 
                badge={selectedBadge} 
                isOpen={!!selectedBadge} 
                onClose={() => setSelectedBadge(null)} 
            />
        </div>
    );
};

export default Profile;