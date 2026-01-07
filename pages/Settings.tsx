import React, { useState } from 'react';
import { ArrowLeft, Bell, Moon, Volume2, Shield, LogOut, Trash2, Info, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);

  return (
    <div className="animate-slide-up pb-10">
      <div className="flex items-center mb-6">
        <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-gray-400 hover:text-white"
        >
            <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-display font-bold text-white ml-2">CONFIGURAR MATRIX</h1>
      </div>

      <div className="space-y-6">
        
        {/* Section: General */}
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Geral</h3>
            <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg text-white">
                            <Bell size={18} />
                        </div>
                        <span className="font-medium text-white text-sm">Notificações Push</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-purple"></div>
                    </label>
                </div>
                <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg text-white">
                            <Volume2 size={18} />
                        </div>
                        <span className="font-medium text-white text-sm">Efeitos Sonoros</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={sound} onChange={() => setSound(!sound)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-purple"></div>
                    </label>
                </div>
            </div>
        </div>

        {/* Section: Info */}
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Sistema</h3>
            <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
                <div 
                    onClick={() => navigate('/app/about')}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/30 transition-colors group"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg text-neon-blue group-hover:text-white transition-colors">
                            <Info size={18} />
                        </div>
                        <span className="font-medium text-white text-sm">Sobre o App</span>
                    </div>
                    <ChevronRight size={18} className="text-gray-600" />
                </div>
            </div>
        </div>

        {/* Section: Account */}
        <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">Conta</h3>
            <div className="bg-card border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-gray-800 flex items-center justify-between cursor-pointer hover:bg-gray-800/30">
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg text-white">
                            <Shield size={18} />
                        </div>
                        <span className="font-medium text-white text-sm">Privacidade e Segurança</span>
                    </div>
                </div>
                <div 
                    onClick={() => navigate('/login')}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-800/30"
                >
                    <div className="flex items-center space-x-3">
                        <div className="bg-gray-800 p-2 rounded-lg text-red-400">
                            <LogOut size={18} />
                        </div>
                        <span className="font-medium text-red-400 text-sm">Sair da Conta</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Danger Zone */}
        <div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl overflow-hidden mt-8">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-red-500/10">
                    <div className="flex items-center space-x-3">
                        <Trash2 size={18} className="text-red-500" />
                        <span className="font-medium text-red-500 text-sm">Deletar Personagem</span>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-gray-600 mt-2 px-2">
                Aviso: Deletar seu personagem apaga toda sua Aura, Badges e XP permanentemente. Não há respawn.
            </p>
        </div>
        
      </div>
    </div>
  );
};

export default Settings;