import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from '../components/Layout';
import { LedgerEntry } from '../types';
import { supabase } from '../services/supabaseClient';
import { getXpHistory } from '../services/database';

const XPHistory = () => {
  const navigate = useNavigate();
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        const history = await getXpHistory(user.id);
        setLedger(history);
      }
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const history = await getXpHistory(session.user.id);
        setLedger(history);
      } else {
        setLedger([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Carregando histórico...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white">Por favor, faça login para ver seu histórico.</div>
      </div>
    );
  }

  return (
    <div className="animate-slide-up pb-10">
      <div className="flex items-center mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-400 hover:text-white"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display font-bold text-white ml-2">SEU LEGADO</h1>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Histórico Recente</span>
            <TrendingUp size={16} className="text-gray-500" />
        </div>
        
        <div className="divide-y divide-gray-800">
            {ledger.map((entry) => {
                const formatDate = (dateStr: string) => {
                    const date = new Date(dateStr);
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (date.toDateString() === today.toDateString()) {
                        return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
                    } else if (date.toDateString() === yesterday.toDateString()) {
                        return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
                    } else {
                        return date.toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                };

                return (
                <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                    <div>
                        <div className="font-bold text-white text-sm">{entry.source}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar size={10} className="mr-1" />
                            {formatDate(entry.date)}
                        </div>
                    </div>
                    <div className={`font-display font-bold text-lg ${entry.type === 'gain' ? 'text-neon-green' : 'text-red-500'}`}>
                        {entry.type === 'gain' ? '+' : ''}{entry.amount} XP
                    </div>
                </div>
            );
            })}
        </div>
        
        <div className="p-4 text-center border-t border-gray-800">
            <button className="text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest">
                Carregar Mais
            </button>
        </div>
      </div>
    </div>
  );
};

export default XPHistory;