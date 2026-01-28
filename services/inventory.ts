import { ActiveItem, ShopItemEffect } from '../types';

const STORAGE_KEY_INVENTORY = (userId: string) => `dopamind_inventory_${userId}`;
const STORAGE_KEY_ACTIVE_ITEMS = (userId: string) => `dopamind_active_items_${userId}`;

// Inventory Management
export const getUserInventory = (userId: string): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(STORAGE_KEY_INVENTORY(userId));
  return stored ? JSON.parse(stored) : [];
};

export const addToInventory = (userId: string, itemId: string) => {
  if (typeof window === 'undefined') return;
  const inventory = getUserInventory(userId);
  if (!inventory.includes(itemId)) {
    inventory.push(itemId);
    window.localStorage.setItem(STORAGE_KEY_INVENTORY(userId), JSON.stringify(inventory));
  }
};

export const removeFromInventory = (userId: string, itemId: string) => {
  if (typeof window === 'undefined') return;
  const inventory = getUserInventory(userId);
  const updated = inventory.filter(id => id !== itemId);
  window.localStorage.setItem(STORAGE_KEY_INVENTORY(userId), JSON.stringify(updated));
};

// Active Items Management
export const getActiveItems = (userId: string): ActiveItem[] => {
  if (typeof window === 'undefined') return [];
  const stored = window.localStorage.getItem(STORAGE_KEY_ACTIVE_ITEMS(userId));
  if (!stored) return [];
  
  const items: ActiveItem[] = JSON.parse(stored);
  const now = new Date().toISOString();
  
  // Filter out expired items
  const active = items.filter(item => item.expiresAt > now);
  
  // Update storage if any expired
  if (active.length !== items.length) {
    window.localStorage.setItem(STORAGE_KEY_ACTIVE_ITEMS(userId), JSON.stringify(active));
  }
  
  return active;
};

export const activateItem = (
  userId: string,
  itemId: string,
  itemName: string,
  effect: ShopItemEffect
): boolean => {
  if (typeof window === 'undefined') return false;
  
  const activeItems = getActiveItems(userId);
  
  // Check if same effect type is already active
  if (effect.type !== 'cosmetic') {
    const existing = activeItems.find(item => item.effect.type === effect.type);
    if (existing) {
      return false; // Already active
    }
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + (effect.duration || 24) * 60 * 60 * 1000);
  
  const newActiveItem: ActiveItem = {
    itemId,
    itemName,
    effect,
    activatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  };
  
  activeItems.push(newActiveItem);
  window.localStorage.setItem(STORAGE_KEY_ACTIVE_ITEMS(userId), JSON.stringify(activeItems));
  
  return true;
};

export const hasActiveEffect = (userId: string, effectType: ShopItemEffect['type']): boolean => {
  const activeItems = getActiveItems(userId);
  return activeItems.some(item => item.effect.type === effectType);
};

export const getActiveXpMultiplier = (userId: string): number => {
  const activeItems = getActiveItems(userId);
  const boostItem = activeItems.find(item => item.effect.type === 'xp_boost');
  return boostItem?.effect.multiplier || 1;
};

export const consumeStreakFreeze = (userId: string): boolean => {
  const activeItems = getActiveItems(userId);
  const freezeIndex = activeItems.findIndex(item => item.effect.type === 'streak_freeze');
  
  if (freezeIndex === -1) return false;
  
  // Remove the freeze
  activeItems.splice(freezeIndex, 1);
  window.localStorage.setItem(STORAGE_KEY_ACTIVE_ITEMS(userId), JSON.stringify(activeItems));
  
  return true;
};
