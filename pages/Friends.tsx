import React, { useState } from 'react';
import { Users, UserPlus, Circle, MessageSquare, Search } from 'lucide-react';
import { Friend } from '../types';

const MOCK_FRIENDS: Friend[] = [
  { id: '1', username: 'cyber_monk', display_name: 'Paulo Monk', status: 'online', aura_level: 42, avatar_url: 'https://picsum.photos/101/101' },
  { id: '2', username: 'ana_beast', display_name: 'Ana B.', status: 'busy', aura_level: 35, avatar_url: 'https://picsum.photos/103/103' },
  { id: '3', username: 'dopa_king', display_name: 'King', status: 'offline', aura_level: 38, avatar_url: 'https://picsum.photos/102/102' },
];

const Friends = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  
  return (
    <div className="animate-slide-up pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-display font-bold text-white">SQUAD</h1>
           <p className="text-gray-500 text-xs uppercase tracking-widest">Seus aliados de guerra</p>
        </div>
        <div className="bg-gray-800 p-1 rounded-lg flex text-xs font-bold">
            <button 
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded shadow-sm transition-colors ${activeTab === 'list' ? 'bg-card text-white' : 'text-gray-500 hover:text-white'}`}
            >
                Meus Amigos
            </button>
            <button 
                onClick={() => setActiveTab('add')}
                className={`px-3 py-1 rounded shadow-sm transition-colors ${activeTab === 'add' ? 'bg-card text-white' : 'text-gray-500 hover:text-white'}`}
            >
                Adicionar
            </button>
        </div>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-3">
          {MOCK_FRIENDS.map((friend) => (
            <div key={friend.id} className="bg-card border border-gray-800 p-4 rounded-xl flex items-center justify-between">
               <div className="flex items-center space-x-3">
                 <div className="relative">
                    <img src={friend.avatar_url} alt={friend.username} className="w-12 h-12 rounded-full border border-gray-700" />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                        friend.status === 'online' ? 'bg-neon-green' : friend.status === 'busy' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></div>
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-sm">{friend.display_name}</h3>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>@{friend.username}</span>
                        <span className="text-neon-purple">• Aura {friend.aura_level}</span>
                    </div>
                 </div>
               </div>
               
               <button className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                  <MessageSquare size={18} />
               </button>
            </div>
          ))}
          
          <div className="mt-8 text-center bg-gray-900/50 p-6 rounded-xl border border-dashed border-gray-800">
             <h3 className="text-gray-400 font-bold mb-2">Convide amigos para o Front</h3>
             <p className="text-xs text-gray-600 mb-4">Ganhe +100 XP para cada amigo que completar o primeiro desafio.</p>
             <button className="text-neon-purple text-xs font-bold uppercase tracking-widest border border-neon-purple px-4 py-2 rounded hover:bg-neon-purple hover:text-white transition-colors">
                Copiar Link de Convite
             </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-4 top-4 text-gray-500" size={20} />
                <input 
                    type="text" 
                    placeholder="Buscar por @username..." 
                    className="w-full bg-card border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-neon-purple transition-colors"
                />
            </div>
            
            <div className="text-center py-10">
                <Users size={48} className="mx-auto text-gray-700 mb-4" />
                <p className="text-gray-500 text-sm">Digite o username exato do seu amigo.</p>
            </div>
        </div>
      )}

    </div>
  );
};

export default Friends;