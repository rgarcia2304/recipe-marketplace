'use client';
import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  difficulty: string;
  time: string;
  serves: string;
  tag?: string;
}

export interface CartItem {
  recipe: Recipe;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (recipe: Recipe) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((recipe: Recipe) => {
    setItems(prev => {
      const existing = prev.find(i => i.recipe.id === recipe.id);
      if (existing) return prev.map(i => i.recipe.id === recipe.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { recipe, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: string) => setItems(prev => prev.filter(i => i.recipe.id !== id)), []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) setItems(prev => prev.filter(i => i.recipe.id !== id));
    else setItems(prev => prev.map(i => i.recipe.id === id ? { ...i, quantity: qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const total = items.reduce((s, i) => s + i.recipe.price * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, isOpen, openCart, closeCart, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
