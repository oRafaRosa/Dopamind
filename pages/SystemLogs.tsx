import React, { useState } from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Save, Sparkles, Book } from 'lucide-react';

const SystemLogs = () => {
    const navigate = useNavigate();
    const [entry, setEntry] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleSave = () => {
        if (!entry.trim()) return;
        setAnalyzing(true);
        
        // Simulating AI Analysis
        setTimeout(() => {
            setAnalyzing(false);
            setFeedback("A dor é inevitável, o sofrimento é opcional. Você identificou sua falha hoje, isso é o primeiro passo para a soberania mental. Amanhã, foque na dicotomia do controle.");
        }, 2000);
    };

    return (
        <div className="animate-slide-up pb-20">
            <div className="flex items-center mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 -ml-2 text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-display font-bold text-white ml-2">SYSTEM LOGS</h1>
            </div>

            <div className="bg-card border border-gray-800 rounded-2xl p-6 min-h-[60vh] flex flex-col">
                <div className="flex items-center space-x-2 mb-4 text-neon-green text-xs font-mono uppercase">
                    <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                    <span>Recording...</span>
                </div>

                <textarea
                    className="flex-1 bg-transparent text-gray-300 placeholder-gray-700 resize-none focus:outline-none text-base leading-relaxed font-sans"
                    placeholder="O que você aprendeu hoje? Onde você falhou? Seja brutalmente honesto."
                    value={entry}
                    onChange={(e) => setEntry(e.target.value)}
                    disabled={!!feedback}
                ></textarea>

                {feedback && (
                    <div className="mt-6 p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-xl animate-fade-in">
                        <div className="flex items-center space-x-2 mb-2 text-neon-purple font-bold text-xs uppercase tracking-wider">
                            <Sparkles size={14} />
                            <span>System Feedback</span>
                        </div>
                        <p className="text-sm text-gray-300 italic">"{feedback}"</p>
                    </div>
                )}

                {!feedback && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={analyzing || !entry.trim()}
                            className="bg-white text-black font-bold py-2 px-6 rounded-lg flex items-center space-x-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                            {analyzing ? (
                                <span>Processando...</span>
                            ) : (
                                <>
                                    <Save size={18} />
                                    <span>SALVAR LOG</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="mt-6">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Entradas Anteriores</h3>
                 <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Book size={18} className="text-gray-500" />
                        <div>
                            <div className="text-sm font-bold text-gray-300">Reflexão Noturna</div>
                            <div className="text-[10px] text-gray-600">Ontem • 22:30</div>
                        </div>
                    </div>
                    <span className="text-xs text-neon-purple font-bold">+20 XP</span>
                 </div>
            </div>
        </div>
    );
};

export default SystemLogs;