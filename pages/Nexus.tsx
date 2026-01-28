import React from 'react';
import { useNavigate } from '../components/Layout';
import { Brain, Swords, ShoppingBag, Book, Sparkles, Zap, Eye, Terminal, Timer } from 'lucide-react';

const TOOLS = [
    { id: 'focus', title: 'Deep Work Terminal', desc: 'Protocolo de foco gamificado.', icon: Terminal, color: 'text-neon-purple', path: '/app/focus' },
    { id: 'power-hour', title: 'Power Hour', desc: 'Foco intensivo com multiplicadores.', icon: Timer, color: 'text-blue-500', path: '/app/power-hour' },
    { id: 'skills', title: 'Neural Skill Tree', desc: 'Evolua suas perks e habilidades.', icon: Brain, color: 'text-neon-blue', path: '/app/skills' },
    { id: 'pvp', title: 'Protocolo Duelo', desc: 'Aposte seus créditos com rivais.', icon: Swords, color: 'text-red-500', path: '/app/pvp' },
    { id: 'oracle', title: 'The Oracle', desc: 'Mentoria IA Estoica/Goggins.', icon: Eye, color: 'text-neon-green', path: '/app/oracle' },
    { id: 'logs', title: 'System Logs', desc: 'Diário com feedback neural.', icon: Book, color: 'text-yellow-500', path: '/app/logs' },
    { id: 'roulette', title: 'Dopamine Roulette', desc: 'Gerador de desafios e XP.', icon: Sparkles, color: 'text-pink-500', path: '/app/roulette' },
    { id: 'shop', title: 'Black Market', desc: 'Loja de itens e upgrades.', icon: ShoppingBag, color: 'text-white', path: '/app/shop' },
];

const Nexus = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-slide-up pb-20">
            <div className="mb-8 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-neon-purple/20 blur-[50px] rounded-full pointer-events-none"></div>
                <h1 className="text-3xl font-display font-black text-white tracking-widest relative z-10 flex items-center justify-center">
                    <Sparkles className="mr-2 text-neon-purple" size={24} />
                    NEXUS
                </h1>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">System Modules v2.0</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {TOOLS.map((tool) => (
                    <div
                        key={tool.id}
                        onClick={() => navigate(tool.path)}
                        className="bg-card border border-gray-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-600 hover:bg-gray-800/50 transition-all group aspect-square"
                    >
                        <div className={`bg-gray-900 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform border border-gray-800 group-hover:border-gray-600`}>
                            <tool.icon size={28} className={tool.color} />
                        </div>
                        <h3 className="font-bold text-white text-sm mb-1">{tool.title}</h3>
                        <p className="text-[10px] text-gray-500 leading-tight px-2">{tool.desc}</p>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-gray-900/30 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase">System Status</h4>
                    <p className="text-[10px] text-gray-600 font-mono">All modules operational</p>
                </div>
                <Zap size={16} className="text-neon-green animate-pulse" />
            </div>
        </div>
    );
};


export default Nexus;