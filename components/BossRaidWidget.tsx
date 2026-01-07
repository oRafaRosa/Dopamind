import React, { useState, useEffect } from 'react';
import { Skull, Users, Clock, Swords } from 'lucide-react';
import { BossRaid } from '../types';

const MOCK_BOSS: BossRaid = {
    name: "A ENTIDADE DA PROCRASTINAÇÃO",
    description: "Um parasita psíquico alimentado por dopamina barata e scrolling infinito.",
    total_hp: 1000000,
    current_hp: 458920,
    time_left: "08:12:45",
    participants: 4512,
    reward_credits: 500
};

const BossRaidWidget = () => {
    const [boss, setBoss] = useState(MOCK_BOSS);

    // Simulate damage over time
    useEffect(() => {
        const interval = setInterval(() => {
            setBoss(prev => ({
                ...prev,
                current_hp: Math.max(0, prev.current_hp - Math.floor(Math.random() * 500))
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const percentage = (boss.current_hp / boss.total_hp) * 100;

    return (
        <div className="bg-gradient-to-r from-red-900/20 to-black border border-red-500/30 rounded-2xl p-0.5 relative overflow-hidden group mb-6">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            
            <div className="bg-card/90 backdrop-blur-sm rounded-xl p-4 relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                        <div className="bg-red-500/10 p-1.5 rounded-lg border border-red-500/30 animate-pulse-slow">
                            <Skull className="text-red-500" size={18} />
                        </div>
                        <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-500/20 px-2 py-0.5 rounded bg-red-500/5">
                            World Boss
                        </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400 font-mono">
                        <Clock size={12} className="mr-1" />
                        {boss.time_left}
                    </div>
                </div>

                <h3 className="text-lg font-black font-display text-white uppercase tracking-wider mb-1">
                    {boss.name}
                </h3>
                <p className="text-[10px] text-gray-500 mb-4 truncate">{boss.description}</p>

                {/* HP Bar */}
                <div className="relative h-6 bg-gray-900 rounded-full border border-gray-700 overflow-hidden mb-2">
                    <div 
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 to-red-800 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md z-10">
                        {boss.current_hp.toLocaleString()} / {boss.total_hp.toLocaleString()} HP
                    </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <div className="flex items-center">
                        <Users size={12} className="mr-1" />
                        {boss.participants.toLocaleString()} Atacando
                    </div>
                    <div className="flex items-center text-yellow-500 font-bold">
                        <Swords size={12} className="mr-1" />
                        Recompensa: {boss.reward_credits} $C
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BossRaidWidget;