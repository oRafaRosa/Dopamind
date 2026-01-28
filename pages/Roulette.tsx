import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trophy, Sparkles, Zap, Flame, Brain, Heart, Ticket, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { getProfile, consumeRouletteTicket, addRouletteTickets, saveRouletteHistory } from '../services/database';
import { Profile } from '../types';

interface Challenge {
    id: string;
    text: string;
    type: 'physical' | 'mental' | 'social';
    xp: number;
    icon: any;
    color: string;
    rarity: 'common' | 'rare' | 'epic';
}

const QUICK_CHALLENGES: Challenge[] = [
    // Common (70%) - 50 XP
    { id: '1', text: 'Beba um copo de água', type: 'physical', xp: 50, icon: Zap, color: 'text-blue-400', rarity: 'common' },
    { id: '2', text: 'Arrume sua postura', type: 'physical', xp: 50, icon: Zap, color: 'text-yellow-400', rarity: 'common' },
    { id: '3', text: 'Respire fundo por 1 min', type: 'mental', xp: 50, icon: Brain, color: 'text-purple-400', rarity: 'common' },
    { id: '4', text: 'Alongue-se por 2 minutos', type: 'physical', xp: 50, icon: Flame, color: 'text-orange-400', rarity: 'common' },
    { id: '5', text: 'Organize sua mesa', type: 'mental', xp: 50, icon: Sparkles, color: 'text-emerald-400', rarity: 'common' },

    // Rare (20%) - 100 XP
    { id: '6', text: 'Faça 10 polichinelos', type: 'physical', xp: 100, icon: Flame, color: 'text-orange-500', rarity: 'rare' },
    { id: '7', text: 'Leia 5 páginas de um livro', type: 'mental', xp: 100, icon: Brain, color: 'text-blue-500', rarity: 'rare' },
    { id: '8', text: 'Elogie alguém agora', type: 'social', xp: 100, icon: Heart, color: 'text-pink-500', rarity: 'rare' },

    // Epic (10%) - 200 XP + 1 ticket garantido
    { id: '9', text: 'Medite por 5 minutos', type: 'mental', xp: 200, icon: Brain, color: 'text-purple-600', rarity: 'epic' },
    { id: '10', text: 'Faça 20 flexões', type: 'physical', xp: 200, icon: Flame, color: 'text-red-600', rarity: 'epic' },
];

const Roulette = () => {
    const navigate = useNavigate();
    const [isSpinning, setIsSpinning] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [rotation, setRotation] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showInsufficientTickets, setShowInsufficientTickets] = useState(false);
    const [ticketsWon, setTicketsWon] = useState(0);

    const [profile, setProfile] = useState<Profile | null>(null);
    const [user, setUser] = useState<any>(null);

    // Load user and profile
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

    // Weighted random selection based on rarity
    const selectChallenge = (): Challenge => {
        const rand = Math.random() * 100;
        let rarityFilter: 'common' | 'rare' | 'epic';

        if (rand < 70) rarityFilter = 'common';
        else if (rand < 90) rarityFilter = 'rare';
        else rarityFilter = 'epic';

        const filtered = QUICK_CHALLENGES.filter(c => c.rarity === rarityFilter);
        return filtered[Math.floor(Math.random() * filtered.length)];
    };

    // Calculate ticket reward (weighted)
    const calculateTicketReward = (rarity: string): number => {
        if (rarity === 'epic') return 1; // Epic always gives 1 ticket

        const rand = Math.random() * 100;
        if (rand < 60) return 0; // 60% chance of no tickets
        if (rand < 85) return 1; // 25% chance of 1 ticket
        if (rand < 95) return 2; // 10% chance of 2 tickets
        return 3; // 5% chance of 3 tickets
    };

    const handleSpin = async () => {
        if (isSpinning || !user || !profile) return;

        // Check if user has tickets
        if (profile.roulette_tickets <= 0) {
            setShowInsufficientTickets(true);
            return;
        }

        // Consume ticket
        const consumed = await consumeRouletteTicket(user.id);
        if (!consumed) {
            alert('Erro ao consumir ticket. Tente novamente.');
            return;
        }

        // Update local profile
        setProfile({ ...profile, roulette_tickets: profile.roulette_tickets - 1 });

        setIsSpinning(true);
        setShowResult(false);
        setSelectedChallenge(null);

        // Select challenge
        const challenge = selectChallenge();
        const ticketReward = calculateTicketReward(challenge.rarity);
        setTicketsWon(ticketReward);

        // Random rotations
        const spins = 5;
        const segments = QUICK_CHALLENGES.length;
        const randomSegment = QUICK_CHALLENGES.indexOf(challenge);
        const segmentAngle = 360 / segments;
        const extraDegrees = (360 - (randomSegment * segmentAngle)) + (Math.random() * (segmentAngle * 0.8) - (segmentAngle * 0.4));
        const totalRotation = rotation + (spins * 360) + extraDegrees;

        setRotation(totalRotation);

        setTimeout(async () => {
            setIsSpinning(false);
            setSelectedChallenge(challenge);
            setShowResult(true);

            // Award tickets if any
            if (ticketReward > 0 && user) {
                await addRouletteTickets(user.id, ticketReward);
                setProfile(prev => prev ? { ...prev, roulette_tickets: prev.roulette_tickets + ticketReward } : null);
            }

            // Save to history
            await saveRouletteHistory({
                user_id: user.id,
                challenge_text: challenge.text,
                challenge_type: challenge.type,
                xp_reward: challenge.xp,
                tickets_won: ticketReward
            });
        }, 4000);
    };

    const getRarityBadge = (rarity: string) => {
        if (rarity === 'common') return <span className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded">Comum</span>;
        if (rarity === 'rare') return <span className="text-xs px-2 py-0.5 bg-blue-700 text-blue-300 rounded">Raro</span>;
        return <span className="text-xs px-2 py-0.5 bg-purple-700 text-purple-300 rounded">Épico</span>;
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center overflow-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />

            {/* Header */}
            <div className="w-full flex items-center justify-between mb-8 z-10">
                <button
                    onClick={() => navigate('/app/nexus')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    Dopamine Roulette
                </h1>
                <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-full border border-gray-700">
                    <Ticket className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-yellow-500">{profile?.roulette_tickets || 0}</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md relative z-10">

                {/* Pointer */}
                <div className="absolute top-[15%] z-20 transform translate-y-2">
                    <div className="w-0 h-0 border-l-[15px] border-l-transparent border-t-[30px] border-t-yellow-500 border-r-[15px] border-r-transparent drop-shadow-[0_0_10px_rgba(234,179,8,0.8)] filter" />
                </div>

                {/* Wheel Container */}
                <div
                    className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-white/10 shadow-[0_0_50px_rgba(168,85,247,0.4)] transition-transform"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transitionDuration: '4000ms',
                        transitionTimingFunction: 'cubic-bezier(0.15, 0, 0.15, 1)',
                    }}
                >
                    {/* Wheel Segments */}
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        {QUICK_CHALLENGES.map((challenge, index) => {
                            const angle = 360 / QUICK_CHALLENGES.length;
                            const rotation = index * angle;

                            return (
                                <div
                                    key={challenge.id}
                                    className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left flex items-center justify-end px-4"
                                    style={{
                                        transform: `rotate(${rotation}deg) skewY(-${90 - angle}deg)`,
                                        background: index % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)',
                                    }}
                                >
                                    <div
                                        className="absolute right-8 top-12"
                                        style={{ transform: `skewY(${90 - angle}deg) rotate(15deg)` }}
                                    >
                                        <challenge.icon className={`w-6 h-6 ${challenge.color}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Center Hub */}
                    <div className="absolute inset-0 m-auto w-16 h-16 bg-gradient-to-br from-gray-800 to-black rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-yellow-500" />
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-12 w-full text-center">
                    <button
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className={`
              relative group px-12 py-4 rounded-full font-bold text-xl tracking-wider uppercase
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${isSpinning
                                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:shadow-[0_0_50px_rgba(236,72,153,0.8)]'
                            }
            `}
                    >
                        {isSpinning ? 'Sorteando...' : 'GIRAR'}
                    </button>
                    <p className="text-xs text-gray-500 mt-2">Custo: 1 ticket</p>
                </div>

            </div>

            {/* Result Modal */}
            {showResult && selectedChallenge && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-gray-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center transform scale-100 animate-in zoom-in-50 duration-300 shadow-2xl relative overflow-hidden">

                        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent pointer-events-none" />

                        <div className="relative z-10">
                            {getRarityBadge(selectedChallenge.rarity)}

                            <div className="w-20 h-20 mx-auto bg-gray-800 rounded-full flex items-center justify-center my-6 border-2 border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                <selectedChallenge.icon className={`w-10 h-10 ${selectedChallenge.color}`} />
                            </div>

                            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                                Desafio Aceito?
                            </h2>

                            <p className="text-gray-300 text-lg mb-6 leading-relaxed">
                                "{selectedChallenge.text}"
                            </p>

                            <div className="flex items-center justify-center gap-4 mb-6">
                                <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-lg border border-white/5">
                                    <Trophy className="w-4 h-4 text-yellow-500" />
                                    <span className="text-yellow-500 font-bold">+{selectedChallenge.xp} XP</span>
                                </div>

                                {ticketsWon > 0 && (
                                    <div className="flex items-center gap-2 bg-black/30 py-2 px-4 rounded-lg border border-white/5 animate-pulse">
                                        <Ticket className="w-4 h-4 text-green-500" />
                                        <span className="text-green-500 font-bold">+{ticketsWon} Ticket{ticketsWon > 1 ? 's' : ''}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {
                                    setShowResult(false);
                                    navigate('/app/nexus');
                                }}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Completar Desafio
                            </button>

                            <button
                                onClick={() => setShowResult(false)}
                                className="mt-4 text-sm text-gray-500 hover:text-white transition-colors"
                            >
                                Girar de novo
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Insufficient Tickets Modal */}
            {showInsufficientTickets && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 max-w-sm w-full text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Tickets Insuficientes</h2>
                        <p className="text-gray-400 mb-6">Você precisa de pelo menos 1 ticket para girar a roleta.</p>

                        <div className="bg-black/30 p-4 rounded-lg mb-6 text-left">
                            <h3 className="text-sm font-bold text-gray-300 mb-2">Como ganhar tickets:</h3>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li>• Faça login diariamente (+1 ticket)</li>
                                <li>• Complete desafios especiais</li>
                                <li>• Ganhe na própria roleta</li>
                                <li>• Mantenha streak de 7 dias (+1 ticket)</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => {
                                setShowInsufficientTickets(false);
                                navigate('/app/home');
                            }}
                            className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            Ir para Desafios
                        </button>

                        <button
                            onClick={() => setShowInsufficientTickets(false)}
                            className="mt-3 text-sm text-gray-500 hover:text-white transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Roulette;
