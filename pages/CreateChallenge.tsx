import React, { useState } from 'react';
import { useNavigate } from '../components/Layout';
import { ArrowLeft, Swords, Info } from 'lucide-react';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        navigate('/app/challenges');
    }, 1500);
  };

  return (
    <div className="animate-slide-up pb-10">
      <div className="flex items-center mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-400 hover:text-white"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display font-bold text-white ml-2">CRIAR CHALLENGE</h1>
      </div>

      <div className="bg-card border border-gray-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Nome do Desafio</label>
                <input 
                    type="text" 
                    placeholder="Ex: Protocolo Espartano"
                    className="w-full bg-background border border-gray-800 rounded-lg p-4 text-white placeholder-gray-700 focus:outline-none focus:border-neon-purple transition-colors"
                    required
                />
            </div>

            <div>
                <label className="block text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Descrição / Objetivo</label>
                <textarea 
                    rows={3}
                    placeholder="O que deve ser feito? Seja direto."
                    className="w-full bg-background border border-gray-800 rounded-lg p-4 text-white placeholder-gray-700 focus:outline-none focus:border-neon-purple transition-colors resize-none"
                    required
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Duração</label>
                    <select className="w-full bg-background border border-gray-800 rounded-lg p-4 text-white focus:outline-none focus:border-neon-purple appearance-none">
                        <option value="7">7 Dias</option>
                        <option value="14">14 Dias</option>
                        <option value="30">30 Dias</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Dificuldade</label>
                    <select className="w-full bg-background border border-gray-800 rounded-lg p-4 text-white focus:outline-none focus:border-neon-purple appearance-none">
                        <option value="casual">Casual</option>
                        <option value="hard">Hard Mode</option>
                    </select>
                </div>
            </div>

            <div className="bg-background border border-gray-800 rounded-lg p-4 flex items-start space-x-3">
                <Info size={20} className="text-neon-purple flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 leading-relaxed">
                    Em <strong>Hard Mode</strong>, se um participante falhar 1 dia, ele é automaticamente eliminado do desafio.
                </p>
            </div>

            <div className="pt-4">
                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <span>Criando Sistema...</span>
                    ) : (
                        <>
                            <Swords size={20} />
                            <span>LANÇAR DESAFIO</span>
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChallenge;