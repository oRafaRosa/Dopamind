import React from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Swords, Coins, AlertTriangle } from 'lucide-react';

const PvpDuel = () => {
    const navigate = useNavigate();

    return (
        <div className="animate-slide-up pb-20">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-display font-bold text-white ml-2">PROTOCOL DUELO</h1>
            </div>

            <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-500/30 rounded-2xl p-6 text-center mb-8">
                <Swords size={48} className="mx-auto text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Skin in the Game</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Aposte seus créditos contra um amigo. Defina um desafio. Quem falhar paga.
                </p>
                <button className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-red-700 transition-colors w-full">
                    CRIAR NOVO DUELO
                </button>
            </div>

            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 ml-1">Duelos Ativos</h3>
            
            <div className="space-y-4">
                {/* Mock Duel Card */}
                <div className="bg-card border border-gray-800 rounded-xl p-4 flex items-center justify-between opacity-60">
                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-2">
                             <img src="https://picsum.photos/100/100" className="w-10 h-10 rounded-full border-2 border-card" alt="You" />
                             <img src="https://picsum.photos/101/101" className="w-10 h-10 rounded-full border-2 border-card grayscale" alt="Opponent" />
                        </div>
                        <div>
                            <div className="text-sm font-bold text-white">vs. cyber_monk</div>
                            <div className="text-xs text-gray-500">Streak de Leitura (7 dias)</div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center text-yellow-500 font-bold text-sm">
                            <Coins size={14} className="mr-1" /> 200
                        </div>
                        <div className="text-[10px] text-gray-600">Aguardando aceite...</div>
                    </div>
                </div>

                <div className="bg-gray-900/30 border border-gray-800 border-dashed rounded-xl p-8 text-center text-gray-500 text-sm">
                    Nenhum duelo ativo. A paz é inimiga do progresso.
                </div>
            </div>

            <div className="mt-8 flex items-start space-x-3 bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/20">
                <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-500/80 leading-relaxed">
                    Atenção: Apostas são finais. O sistema verifica automaticamente a conclusão das tarefas através de evidência e metadados. Trapaças resultam em banimento permanente (Zero Aura).
                </p>
            </div>
        </div>
    );
};

export default PvpDuel;