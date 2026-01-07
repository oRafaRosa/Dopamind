import React, { useState } from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Lock, Brain, Heart, Zap, Shield, Crown } from 'lucide-react';
import { SkillNode } from '../types';

const SKILLS: SkillNode[] = [
    { id: 'core', name: 'Awakening', description: 'O início da jornada.', cost: 0, req_stat: 'int', req_value: 0, unlocked: true, icon: 'Brain', position: { x: 50, y: 90 } },
    { id: 's1', name: 'Iron Will', description: 'Streak protection passiva (1x/mês).', cost: 500, req_stat: 'spi', req_value: 10, unlocked: false, icon: 'Shield', position: { x: 25, y: 70 }, parentId: 'core' },
    { id: 's2', name: 'Focus Flow', description: '+10% XP em Deep Work.', cost: 400, req_stat: 'foc', req_value: 15, unlocked: false, icon: 'Zap', position: { x: 75, y: 70 }, parentId: 'core' },
    { id: 's3', name: 'Social Magnet', description: 'Ver stats de amigos.', cost: 300, req_stat: 'cha', req_value: 20, unlocked: false, icon: 'Heart', position: { x: 50, y: 50 }, parentId: 'core' },
    { id: 's4', name: 'Titan', description: 'Desbloqueia badge "Titan".', cost: 1000, req_stat: 'str', req_value: 50, unlocked: false, icon: 'Crown', position: { x: 50, y: 20 }, parentId: 's3' },
];

const SkillTree = () => {
    const navigate = useNavigate();
    const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);

    const getIcon = (name: string) => {
        switch(name) {
            case 'Brain': return Brain;
            case 'Shield': return Shield;
            case 'Zap': return Zap;
            case 'Heart': return Heart;
            case 'Crown': return Crown;
            default: return Brain;
        }
    };

    return (
        <div className="h-screen flex flex-col bg-background animate-fade-in overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full p-4 z-50 flex justify-between items-center bg-background/80 backdrop-blur-md">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-right">
                    <h1 className="text-xl font-display font-bold text-white">NEURAL GRID</h1>
                    <p className="text-xs text-neon-blue font-mono">5 Skill Points Available</p>
                </div>
            </div>

            <div className="flex-1 relative overflow-auto">
                {/* Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {SKILLS.map(skill => {
                        if (!skill.parentId) return null;
                        const parent = SKILLS.find(s => s.id === skill.parentId);
                        if (!parent) return null;
                        return (
                            <line 
                                key={`line-${skill.id}`}
                                x1={`${parent.position.x}%`} 
                                y1={`${parent.position.y}%`} 
                                x2={`${skill.position.x}%`} 
                                y2={`${skill.position.y}%`} 
                                stroke={skill.unlocked ? '#a855f7' : '#374151'} 
                                strokeWidth="2"
                                strokeDasharray={skill.unlocked ? '0' : '5,5'}
                            />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {SKILLS.map(skill => {
                    const Icon = getIcon(skill.icon);
                    return (
                        <button
                            key={skill.id}
                            onClick={() => setSelectedSkill(skill)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                                skill.unlocked 
                                ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                                : 'bg-gray-900 border-gray-700 text-gray-600 grayscale'
                            }`}
                            style={{ left: `${skill.position.x}%`, top: `${skill.position.y}%` }}
                        >
                            <Icon size={24} />
                            {!skill.unlocked && <Lock size={12} className="absolute bottom-1" />}
                        </button>
                    );
                })}
            </div>

            {/* Detail Panel */}
            {selectedSkill && (
                <div className="absolute bottom-0 left-0 w-full bg-card border-t border-gray-800 p-6 animate-slide-up z-50">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-white">{selectedSkill.name}</h3>
                            <p className="text-sm text-gray-400">{selectedSkill.description}</p>
                        </div>
                        <button onClick={() => setSelectedSkill(null)} className="text-gray-500"><ArrowLeft size={20} className="rotate-[-90deg]" /></button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-xs font-mono text-gray-500">
                            REQ: {selectedSkill.req_stat.toUpperCase()} {selectedSkill.req_value}+
                        </div>
                        {selectedSkill.unlocked ? (
                            <span className="text-neon-green font-bold text-sm">INSTALLED</span>
                        ) : (
                            <button className="bg-neon-purple text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-purple-600 transition-colors">
                                UNLOCK ({selectedSkill.cost} XP)
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SkillTree;