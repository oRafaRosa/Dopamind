import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, X, Zap, Flame, Trophy, Target } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getProfile, updateProfile } from '../services/database';
import { Profile } from '../types';

const PowerHour = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<any>(null);

    const [duration, setDuration] = useState(25); // 25 or 50 minutes
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
    const [multiplier, setMultiplier] = useState(1.0);
    const [sessionXP, setSessionXP] = useState(0);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Load user
    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                const profileData = await getProfile(user.id);
                setProfile(profileData);
            }
        };
        getUser();
    }, []);

    // Timer logic
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleSessionComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);

    // Calculate multiplier based on progress
    useEffect(() => {
        const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

        if (progress < 33) setMultiplier(1.5);
        else if (progress < 66) setMultiplier(2.0);
        else setMultiplier(3.0);
    }, [timeLeft, duration]);

    const handleStart = () => {
        setIsActive(true);
        setTimeLeft(duration * 60);
    };

    const handlePause = () => {
        setIsActive(false);
    };

    const handleStop = () => {
        setIsActive(false);
        setTimeLeft(duration * 60);
        setMultiplier(1.0);
    };

    const handleSessionComplete = async () => {
        setIsActive(false);

        if (!user || !profile) return;

        // Calculate XP reward
        const baseXP = duration === 25 ? 150 : 300;
        const finalXP = Math.floor(baseXP * multiplier);
        setSessionXP(finalXP);

        // Update combo
        const newCombo = (profile.power_hour_combo || 0) + 1;
        const comboBonus = Math.min(newCombo * 10, 100); // Max 100 XP bonus

        const totalXP = finalXP + comboBonus;

        // Save session to database
        await supabase.from('power_sessions').insert({
            user_id: user.id,
            duration_minutes: duration,
            multiplier: multiplier,
            xp_earned: totalXP,
            completed: true
        });

        // Update profile
        const newTotalXP = profile.total_xp + totalXP;
        const newLevel = Math.floor(Math.sqrt(newTotalXP / 120)) + 1;

        await updateProfile(user.id, {
            total_xp: newTotalXP,
            aura_level: newLevel,
            power_hour_combo: newCombo
        });

        setProfile(prev => prev ? {
            ...prev,
            total_xp: newTotalXP,
            aura_level: newLevel,
            power_hour_combo: newCombo
        } : null);

        // Show completion modal (simplified - just alert for now)
        alert(`🔥 Power Hour Completo!\\n\\nXP Base: ${finalXP}\\nCombo Bonus: +${comboBonus} XP\\nTotal: ${totalXP} XP\\n\\nCombo Atual: ${newCombo}x`);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

    const getMultiplierColor = () => {
        if (multiplier >= 3.0) return 'text-purple-500';
        if (multiplier >= 2.0) return 'text-blue-500';
        return 'text-green-500';
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col overflow-hidden relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black pointer-events-none" />

            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 z-10">
                <button
                    onClick={() => navigate('/app/nexus')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                    Power Hour
                </h1>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-full border border-gray-700">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-orange-500">{profile?.power_hour_combo || 0}x</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 max-w-md mx-auto w-full">

                {!isActive && timeLeft === duration * 60 && (
                    <>
                        <h2 className="text-2xl font-bold mb-8 text-center">Escolha a Duração</h2>
                        <div className="flex gap-4 mb-12">
                            <button
                                onClick={() => { setDuration(25); setTimeLeft(25 * 60); }}
                                className={`px-8 py-4 rounded-xl font-bold transition-all ${duration === 25
                                        ? 'bg-blue-600 text-white scale-105'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                25 min
                            </button>
                            <button
                                onClick={() => { setDuration(50); setTimeLeft(50 * 60); }}
                                className={`px-8 py-4 rounded-xl font-bold transition-all ${duration === 50
                                        ? 'bg-purple-600 text-white scale-105'
                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                50 min
                            </button>
                        </div>
                    </>
                )}

                {/* Timer Circle */}
                <div className="relative w-80 h-80 mb-8">
                    {/* Progress Ring */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="160"
                            cy="160"
                            r="140"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 140}`}
                            strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                            className="transition-all duration-1000"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Timer Display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold font-mono mb-4">
                            {formatTime(timeLeft)}
                        </div>
                        <div className={`flex items-center gap-2 text-2xl font-bold ${getMultiplierColor()}`}>
                            <Zap className="w-6 h-6" fill="currentColor" />
                            <span>{multiplier.toFixed(1)}x</span>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-4">
                    {!isActive ? (
                        <button
                            onClick={handleStart}
                            className="px-12 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl hover:scale-105 transition-transform flex items-center gap-2"
                        >
                            <Play className="w-6 h-6" fill="currentColor" />
                            INICIAR
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handlePause}
                                className="px-8 py-4 bg-yellow-600 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <Pause className="w-5 h-5" fill="currentColor" />
                                PAUSAR
                            </button>
                            <button
                                onClick={handleStop}
                                className="px-8 py-4 bg-red-600 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2"
                            >
                                <X className="w-5 h-5" />
                                PARAR
                            </button>
                        </>
                    )}
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-2 gap-4 mt-12 w-full">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                        <Target className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-500 mb-1">XP Base</div>
                        <div className="text-lg font-bold">{duration === 25 ? 150 : 300} XP</div>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 text-center">
                        <Trophy className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <div className="text-xs text-gray-500 mb-1">Com Multiplicador</div>
                        <div className="text-lg font-bold text-purple-400">
                            {Math.floor((duration === 25 ? 150 : 300) * multiplier)} XP
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-black/30 p-4 rounded-lg border border-gray-800 w-full">
                    <h3 className="text-sm font-bold text-gray-300 mb-2">Como funciona:</h3>
                    <ul className="text-xs text-gray-500 space-y-1">
                        <li>• 0-33%: 1.5x multiplicador</li>
                        <li>• 33-66%: 2.0x multiplicador</li>
                        <li>• 66-100%: 3.0x multiplicador</li>
                        <li>• Combo: +10 XP por sessão consecutiva</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PowerHour;
