import React, { useState, useEffect } from 'react';
import { Skull, Users, Clock, Swords, Trophy } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getActiveBossRaid, getUserBossContribution, getBossTimeLeft, BossRaid } from '../services/boss';

const BossRaidWidget = () => {
    const [boss, setBoss] = useState<BossRaid | null>(null);
    const [userDamage, setUserDamage] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBossData();
        
        // Refresh every 30 seconds
        const interval = setInterval(loadBossData, 30000);
        return () => clearInterval(interval);
    }, []);

    const loadBossData = async () => {
        try {
            const bossData = await getActiveBossRaid();
            
            if (bossData) {
                setBoss(bossData);

                // Get user contribution if logged in
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const contribution = await getUserBossContribution(bossData.id, user.id);
                    setUserDamage(contribution?.damage_dealt || 0);
                }
            }
        } catch (error) {
            console.error('Error loading boss data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-red-900/20 to-black border border-red-500/30 rounded-2xl p-4">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-800 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    if (!boss) {
        return null; // No active boss
    }

    const percentage = Math.max(0, ((boss.total_hp - boss.current_hp) / boss.total_hp) * 100);
    const isDefeated = boss.status === 'defeated';
    const timeLeft = getBossTimeLeft(boss.week_end);

    return (
        <div className={`bg-gradient-to-r ${isDefeated ? 'from-green-900/20 to-black border-green-500/30' : 'from-red-900/20 to-black border-red-500/30'} border rounded-2xl p-0.5 relative overflow-hidden group`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <div className={`${isDefeated ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30 animate-pulse-slow'} p-1.5 rounded-lg border`}>
                            {isDefeated ? (
                                <Trophy className="text-green-500" size={18} />
                            ) : (
                                <Skull className="text-red-500" size={18} />
                            )}
                        </div>
                        <span className={`text-[10px] font-bold ${isDefeated ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-500/5'} uppercase tracking-widest border px-2 py-0.5 rounded`}>
                            {isDefeated ? 'Derrotado' : 'Boss Semanal'}
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 font-mono">
                        <Clock size={12} className="mr-1" />
                        {timeLeft}
                    </div>
                </div>

                <h3 className="text-lg font-black font-display text-white uppercase tracking-wider mb-1">
                    {boss.name}
                </h3>
                <p className="text-[10px] text-gray-500 mb-4 line-clamp-2">{boss.description}</p>

                {/* HP Bar */}
                <div className="relative h-6 bg-gray-900 rounded-full border border-gray-700 overflow-hidden mb-2">
                    <div 
                        className={`absolute top-0 left-0 h-full transition-all duration-500 ease-out ${isDefeated ? 'bg-gradient-to-r from-green-600 to-green-800' : 'bg-gradient-to-r from-red-600 to-red-800'}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md z-10">
                        {boss.current_hp.toLocaleString()} / {boss.total_hp.toLocaleString()} HP
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-400">
                            <Users size={12} className="mr-1" />
                            <span className="font-mono">{boss.participants || 0} lutadores</span>
                        </div>
                        {userDamage > 0 && (
                            <div className="flex items-center text-neon-purple">
                                <Swords size={12} className="mr-1" />
                                <span className="font-mono font-bold">{userDamage.toLocaleString()} dano</span>
                            </div>
                        )}
                    </div>
                    <div className="text-yellow-400 font-bold">
                        {isDefeated ? '🎉 Recompensa disponível!' : `🎁 +${boss.reward_credits}¢`}
                    </div>
                </div>

                {isDefeated && (
                    <div className="mt-3 pt-3 border-t border-green-500/20">
                        <div className="text-center text-green-400 font-bold text-xs animate-pulse">
                            ⚔️ VITÓRIA! O boss foi derrotado pela comunidade!
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BossRaidWidget;