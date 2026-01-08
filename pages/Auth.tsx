import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating Auth for Demo
    setTimeout(() => {
      setLoading(false);
      navigate('/app/home');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-neon-green/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-neon-purple/10 rounded-2xl mb-4 border border-neon-purple/20">
            <Zap className="w-10 h-10 text-neon-purple" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">
            DOPAMIND
          </h1>
          <p className="text-gray-400">Hackeie sua dopamina. Farme Aura.</p>
        </div>

        <div className="bg-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Email</label>
              <input 
                type="email" 
                placeholder="player@dopamind.app"
                className="w-full bg-background border border-gray-800 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                required 
              />
            </div>
            
            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-gray-500 mb-2">Senha</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-background border border-gray-800 rounded-lg p-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                required 
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-neon-purple hover:bg-purple-600 text-white font-bold py-4 rounded-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 mt-4"
            >
              {loading ? (
                <span>Carregando...</span>
              ) : (
                <>
                    <span>{isLogin ? 'ENTRAR NO GAME' : 'CRIAR PERSONAGEM'}</span>
                    <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {isLogin ? 'Ainda não tem conta? Criar agora.' : 'Já tem conta? Fazer login.'}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest">Aura System v1.0</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;