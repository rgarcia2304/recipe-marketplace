'use client';

import { useCart } from '@/lib/cart';
import { useState } from 'react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  async function handleCheckout() {
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }
    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: `guest_${Date.now()}`,
          email,
          items: items.map(i => ({
            listing_id: i.recipe.id,
            quantity: i.quantity,
            price: i.recipe.price,
          })),
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      const data = await response.json();
      clearCart();
      closeCart();
      window.location.href = data.payment_link;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(44, 36, 22, 0.6)',
          zIndex: 200,
          animation: 'fadeIn 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '420px',
        background: 'var(--cream)',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '3px solid var(--terracotta)',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '-8px 0 40px rgba(44, 36, 22, 0.3)',
      }}>
        {/* Header */}
        <div style={{
          background: 'var(--charcoal)',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '3px solid var(--gold)',
        }}>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px',
              color: 'var(--gold)',
              letterSpacing: '0.1em',
            }}>
              Tu Carrito 🛒
            </div>
            <div style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: '13px',
              color: 'rgba(212, 160, 23, 0.6)',
            }}>
              {items.length === 0 ? 'Vacío' : `${items.length} receta${items.length > 1 ? 's' : ''}`}
            </div>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: '1px solid rgba(212, 160, 23, 0.3)',
              color: 'var(--cream)',
              cursor: 'pointer',
              fontSize: '20px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              gap: '12px',
              opacity: 0.5,
            }}>
              <span style={{ fontSize: '48px' }}>🌮</span>
              <p style={{ fontFamily: "'Crimson Pro', serif", fontSize: '16px', color: 'var(--charcoal-mid)' }}>
                Tu carrito está vacío
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {items.map(item => (
                <div key={item.recipe.id} style={{
                  background: 'white',
                  border: '1px solid var(--cream-dark)',
                  borderLeft: '4px solid var(--terracotta)',
                  padding: '14px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}>
                  <span style={{ fontSize: '32px', flexShrink: 0 }}>{item.recipe.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--charcoal)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {item.recipe.name}
                    </div>
                    <div style={{
                      fontFamily: "'Crimson Pro', serif",
                      fontSize: '13px',
                      color: 'var(--terracotta)',
                      fontWeight: 600,
                    }}>
                      ${item.recipe.price.toFixed(2)}
                    </div>
                  </div>
                  {/* Qty controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button
                      onClick={() => updateQuantity(item.recipe.id, item.quantity - 1)}
                      style={qtyBtnStyle}
                    >−</button>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '18px',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.recipe.id, item.quantity + 1)}
                      style={qtyBtnStyle}
                    >+</button>
                    <button
                      onClick={() => removeItem(item.recipe.id)}
                      style={{ ...qtyBtnStyle, background: 'var(--terracotta)', color: 'white', marginLeft: '4px' }}
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '2px solid var(--cream-dark)',
            background: 'white',
          }}>
            {/* Email input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Crimson Pro', serif",
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--charcoal-mid)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                Email para recibir tus recetas
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `2px solid ${emailError ? 'var(--terracotta)' : 'var(--cream-dark)'}`,
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: '15px',
                  color: 'var(--charcoal)',
                  background: 'var(--cream)',
                  outline: 'none',
                }}
              />
              {emailError && (
                <p style={{ color: 'var(--terracotta)', fontSize: '13px', marginTop: '4px' }}>{emailError}</p>
              )}
            </div>

            {/* Total */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingTop: '12px',
              borderTop: '1px solid var(--cream-dark)',
            }}>
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '18px',
                letterSpacing: '0.1em',
                color: 'var(--charcoal)',
              }}>
                Total
              </span>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '24px',
                fontWeight: 700,
                color: 'var(--terracotta)',
              }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? 'var(--charcoal-mid)' : 'var(--terracotta)',
                color: 'var(--cream)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '20px',
                letterSpacing: '0.15em',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.background = 'var(--terracotta-dark)')}
              onMouseLeave={e => !loading && (e.currentTarget.style.background = 'var(--terracotta)')}
            >
              {loading ? 'Procesando...' : '🌶️ Pagar con Stripe'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: '28px',
  height: '28px',
  background: 'var(--cream-dark)',
  border: '1px solid var(--cream-dark)',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--charcoal)',
  transition: 'background 0.15s',
};
