import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, Zap, Gamepad2, Code, Cpu, Activity, Rocket } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up pb-10">
      <div className="flex items-center mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-400 hover:text-white"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display font-bold text-white ml-2">SYSTEM INFO</h1>
      </div>

      <div className="space-y-8">
        
        {/* Hero Section */}
        <div className="relative text-center py-8 overflow-hidden rounded-3xl bg-card border border-neon-purple/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-neon-purple/20 blur-[60px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-black rounded-2xl border-2 border-neon-purple flex items-center justify-center mb-4 shadow-lg shadow-neon-purple/20 animate-pulse-slow">
                    <Brain size={40} className="text-neon-purple" />
                </div>
                <h1 className="text-4xl font-display font-black text-white tracking-tighter mb-1">
                    DOPAMIND
                </h1>
                <p className="text-xs font-mono text-neon-purple uppercase tracking-[0.2em] mb-4">
                    Neuro-Gamification Protocol
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green text-[10px] font-bold uppercase tracking-wider">
                    <Activity size={12} className="mr-1.5" />
                    Systems Online
                </div>
            </div>
        </div>

        {/* The Philosophy */}
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1">A Missão</h3>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Zap size={100} className="text-white" />
                </div>
                
                <h2 className="text-xl font-bold text-white mb-4 leading-tight">
                    Não seja escravo da sua química.<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Seja o mestre.</span>
                </h2>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Seu cérebro foi programado para buscar recompensas. As redes sociais hackearam isso para te viciar em dopamina barata. O <strong className="text-white">Dopamind</strong> inverte o jogo.
                </p>

                <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                        <Gamepad2 size={20} className="text-neon-green" />
                        <span className="text-sm text-gray-300">Transformamos dor (esforço) em XP.</span>
                    </div>
                    <div className="flex items-center space-x-3 bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                        <Rocket size={20} className="text-orange-500" />
                        <span className="text-sm text-gray-300">Progresso visual = Combustível mental.</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Developer Credit - R² Solutions Group */}
        <div className="mt-12">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1 text-center">Arquitetado Por</h3>
            
            <div className="bg-card border border-gray-800 rounded-2xl p-8 text-center relative overflow-hidden group hover:border-neon-blue/50 transition-colors duration-500">
                {/* Tech Background Effect */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,26,0.9),rgba(18,18,26,0.9)),url('https://www.transparenttextures.com/patterns/circuit-board.png')] opacity-30"></div>
                
                <div className="relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/20 transform group-hover:scale-110 transition-transform duration-300">
                        <Cpu size={32} className="text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-display font-bold text-white mb-1">
                        R² Solutions Group
                    </h3>
                    <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-6">
                        Tech & Consulting
                    </p>
                    
                    <div className="text-gray-400 text-sm italic mb-6">
                        "Building digital infrastructure for the next generation of high performers."
                    </div>

                    <button className="text-[10px] text-gray-500 hover:text-white border-b border-gray-700 hover:border-white pb-0.5 transition-all">
                        visite o site oficial
                    </button>
                </div>
            </div>
        </div>

        {/* Footer Version */}
        <div className="text-center pt-8 pb-4">
            <div className="flex items-center justify-center space-x-2 text-gray-700 mb-2">
                <Code size={12} />
                <span className="text-[10px] font-mono">CODEBASE: REACT + TS + TAILWIND</span>
            </div>
            <p className="text-[10px] text-gray-800 font-mono">
                v1.0.4 • STABLE BUILD
            </p>
        </div>

      </div>
    </div>
  );
};

export default About;