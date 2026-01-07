import React from 'react';
import { ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import { useNavigate } from '../components/Layout';
import { LedgerEntry } from '../types';

const MOCK_LEDGER: LedgerEntry[] = [
  { id: '1', source: 'Treino de Força', amount: 80, date: 'Hoje, 09:30', type: 'gain' },
  { id: '2', source: 'Leitura (20 min)', amount: 40, date: 'Hoje, 08:15', type: 'gain' },
  { id: '3', source: 'Streak Bonus (5 dias)', amount: 50, date: 'Ontem, 23:00', type: 'gain' },
  { id: '4', source: 'Zero Açúcar', amount: 60, date: 'Ontem, 19:00', type: 'gain' },
  { id: '5', source: 'Challenge: Reset Dopamina (Entry)', amount: 100, date: '12 Out, 14:20', type: 'gain' },
  { id: '6', source: 'Dia Perfeito Bonus', amount: 150, date: '11 Out, 22:00', type: 'gain' },
];

const XPHistory = () => {
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
        <h1 className="text-2xl font-display font-bold text-white ml-2">SEU LEGADO</h1>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Histórico Recente</span>
            <TrendingUp size={16} className="text-gray-500" />
        </div>
        
        <div className="divide-y divide-gray-800">
            {MOCK_LEDGER.map((entry) => (
                <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-gray-800/30 transition-colors">
                    <div>
                        <div className="font-bold text-white text-sm">{entry.source}</div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Calendar size={10} className="mr-1" />
                            {entry.date}
                        </div>
                    </div>
                    <div className={`font-display font-bold text-lg ${entry.type === 'gain' ? 'text-neon-green' : 'text-red-500'}`}>
                        {entry.type === 'gain' ? '+' : ''}{entry.amount} XP
                    </div>
                </div>
            ))}
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