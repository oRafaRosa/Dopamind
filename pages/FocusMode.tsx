import React, { useState, useEffect } from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Play, Pause, RefreshCw, Zap } from 'lucide-react';

const FocusMode = () => {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 mins
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState<'focus' | 'break'>('focus');

    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(interval);
            setIsActive(false);
            // In real app: Trigger sound & XP gain
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);
    
    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden animate-fade-in">
            {/* Background Tech UI */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-1 bg-neon-purple/20"></div>
                <div className="absolute bottom-10 right-10 w-32 h-1 bg-neon-purple/20"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple/10 to-transparent"></div>
            </div>

            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-6 left-6 text-gray-500 hover:text-white z-20"
            >
                <ArrowLeft size={24} />
            </button>

            <div className="relative z-10 text-center">
                <div className="mb-2">
                    <span className={`text-xs font-mono uppercase tracking-[0.3em] ${isActive ? 'text-neon-green animate-pulse' : 'text-gray-600'}`}>
                        {isActive ? 'SYSTEM ACTIVE' : 'SYSTEM IDLE'}
                    </span>
                </div>

                <div className="relative mb-12">
                     {/* Glitchy Timer Effect */}
                    <h1 className="text-8xl md:text-9xl font-display font-black tracking-tighter tabular-nums text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        {formatTime(timeLeft)}
                    </h1>
                </div>

                <div className="flex items-center justify-center space-x-6">
                    <button 
                        onClick={toggleTimer}
                        className={`w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                            isActive 
                            ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
                            : 'border-neon-green text-neon-green hover:bg-neon-green/10'
                        }`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    </button>

                    <button 
                        onClick={resetTimer}
                        className="w-14 h-14 rounded-full flex items-center justify-center border border-gray-700 text-gray-500 hover:text-white hover:border-white transition-all"
                    >
                        <RefreshCw size={20} />
                    </button>
                </div>

                <div className="mt-12 space-y-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Protocolo Atual</p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => { setMode('focus'); setTimeLeft(25 * 60); setIsActive(false); }}
                            className={`px-4 py-1 rounded text-xs font-bold uppercase border ${mode === 'focus' ? 'bg-neon-purple/10 border-neon-purple text-neon-purple' : 'border-gray-800 text-gray-600'}`}
                        >
                            Deep Work
                        </button>
                        <button 
                            onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
                            className={`px-4 py-1 rounded text-xs font-bold uppercase border ${mode === 'break' ? 'bg-blue-500/10 border-blue-500 text-blue-500' : 'border-gray-800 text-gray-600'}`}
                        >
                            Recharge
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-center text-gray-600 text-xs font-mono">
                    <Zap size={12} className="mr-1" />
                    <span>Reward: +50 XP per session</span>
                </div>
            </div>
        </div>
    );
};

export default FocusMode;