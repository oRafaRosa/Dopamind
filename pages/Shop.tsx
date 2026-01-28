import React, { useState, useEffect } from 'react';
import { ShoppingBag, Coins, Lock, Zap, Frame, Snowflake, Crown, CheckCircle, Clock } from 'lucide-react';
import { ShopItem, ShopItemEffect } from '../types';
import { supabase } from '../services/supabaseClient';
import { getProfile, updateProfile } from '../services/database';
import { getUserInventory, addToInventory, activateItem, getActiveItems } from '../services/inventory';

const SHOP_ITEMS: ShopItem[] = [
  { 
    id: '1', 
    name: 'Streak Freeze', 
    description: 'Protege sua sequência por 1 dia se você falhar.', 
    price: 500, 
    type: 'utility', 
    icon_name: 'Snowflake', 
    owned: false,
    effect: { type: 'streak_freeze', duration: 24 }
  },
  { 
    id: '2', 
    name: 'Neon Frame', 
    description: 'Borda neon exclusiva para seu avatar.', 
    price: 1200, 
    type: 'cosmetic', 
    icon_name: 'Frame', 
    owned: false,
    effect: { type: 'cosmetic' }
  },
  { 
    id: '3', 
    name: 'XP Booster 24h', 
    description: 'Ganhe 20% mais XP em todas as tarefas por 24h.', 
    price: 800, 
    type: 'boost', 
    icon_name: 'Zap', 
    owned: false,
    effect: { type: 'xp_boost', duration: 24, multiplier: 1.2 }
  },
  { 
    id: '4', 
    name: 'Dark Soul Theme', 
    description: 'Tema preto absoluto para telas OLED.', 
    price: 2000, 
    type: 'cosmetic', 
    icon_name: 'Crown', 
    owned: false,
    effect: { type: 'cosmetic' }
  },
];

const Shop = () => {
  const [user, setUser] = useState<any>(null);
  const [userCredits, setUserCredits] = useState(0);
  const [items, setItems] = useState(SHOP_ITEMS);
  const [activeItems, setActiveItems] = useState<any[]>([]);

  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const profile = await getProfile(user.id);
        if (profile) {
          setUserCredits(profile.credits);
        }
        
        const inventory = getUserInventory(user.id);
        setItems(SHOP_ITEMS.map(item => ({
          ...item,
          owned: inventory.includes(item.id)
        })));
        
        setActiveItems(getActiveItems(user.id));
      }
    };
    
    loadUserData();
  }, []);

  const handleBuy = async (item: ShopItem) => {
    if (!user) return;
    
    if (userCredits >= item.price && !item.owned) {
      if (confirm(`Comprar ${item.name} por ${item.price} $C?`)) {
        const newCredits = userCredits - item.price;
        setUserCredits(newCredits);
        
        // Update profile
        await updateProfile(user.id, { credits: newCredits });
        
        // Add to inventory
        addToInventory(user.id, item.id);
        
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, owned: true } : i));
        alert('Item adquirido! Verifique seu inventário.');
      }
    } else if (userCredits < item.price) {
      alert('Créditos insuficientes. Vá farmar!');
    }
  };

  const handleActivate = (item: ShopItem) => {
    if (!user || !item.effect) return;
    
    const success = activateItem(user.id, item.id, item.name, item.effect);
    
    if (success) {
      setActiveItems(getActiveItems(user.id));
      alert(`${item.name} ativado! Efeito durará ${item.effect.duration || 24}h.`);
    } else {
      alert('Você já tem um efeito deste tipo ativo.');
    }
  };

  const isActive = (itemId: string) => {
    return activeItems.some(active => active.itemId === itemId);
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'Snowflake': return <Snowflake className="text-cyan-400" size={24} />;
      case 'Frame': return <Frame className="text-neon-purple" size={24} />;
      case 'Zap': return <Zap className="text-yellow-400" size={24} />;
      case 'Crown': return <Crown className="text-gray-400" size={24} />;
      default: return <ShoppingBag className="text-white" size={24} />;
    }
  };

  return (
    <div className="animate-slide-up pb-20">
      <div className="flex items-center justify-between mb-6">
        <div>
           <h1 className="text-2xl font-display font-bold text-white">BLACK MARKET</h1>
           <p className="text-gray-500 text-xs uppercase tracking-widest">Gaste sua Aura com sabedoria</p>
        </div>
        <div className="bg-gray-800 px-4 py-2 rounded-xl flex items-center space-x-2 border border-gray-700">
          <Coins className="text-yellow-400" size={20} />
          <span className="text-white font-bold font-display text-xl">{userCredits}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className={`bg-card border rounded-2xl p-5 relative overflow-hidden transition-all ${item.owned ? 'border-gray-800 opacity-70' : 'border-gray-800 hover:border-neon-purple/50'}`}
          >
            <div className="flex justify-between items-start">
              <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                {getIcon(item.icon_name)}
              </div>
              <div className="text-right">
                {item.owned ? (
                  <span className="text-xs font-bold bg-gray-800 text-gray-500 px-2 py-1 rounded">ADQUIRIDO</span>
                ) : (
                  <div className="flex items-center space-x-1 text-yellow-400 font-bold">
                    <Coins size={14} />
                    <span>{item.price}</span>
                  </div>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-white mt-4">{item.name}</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 min-h-[40px]">{item.description}</p>

            <button
              onClick={() => item.owned ? (item.type !== 'cosmetic' ? handleActivate(item) : null) : handleBuy(item)}
              disabled={(!item.owned && userCredits < item.price) || (item.owned && item.type === 'cosmetic') || isActive(item.id)}
              className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center space-x-2 transition-colors ${
                isActive(item.id)
                  ? 'bg-neon-green/20 text-neon-green cursor-default border border-neon-green/40'
                  : item.owned && item.type === 'cosmetic'
                    ? 'bg-gray-800 text-gray-500 cursor-default'
                    : item.owned
                      ? 'bg-neon-purple text-white hover:bg-purple-600'
                      : userCredits >= item.price
                        ? 'bg-white text-black hover:bg-gray-200'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
               {isActive(item.id) ? (
                 <>
                   <Clock size={14} />
                   <span>ATIVO</span>
                 </>
               ) : item.owned && item.type === 'cosmetic' ? (
                 <>
                   <CheckIcon />
                   <span>NO INVENTÁRIO</span>
                 </>
               ) : item.owned ? (
                 <>
                   <Zap size={14} />
                   <span>ATIVAR</span>
                 </>
               ) : (
                 <>
                   {userCredits < item.price && <Lock size={14} />}
                   <span>{userCredits < item.price ? 'SALDO INSUFICIENTE' : 'COMPRAR'}</span>
                 </>
               )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
);

export default Shop;