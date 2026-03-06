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
      setEmailError('Enter a valid email to receive your recipes');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/orders`, {
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
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      clearCart();
      closeCart();
      window.location.href = data.payment_link;
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      <div onClick={closeCart} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 200, animation: 'fadeIn 0.25s ease',
      }} />

      <div style={{
        position: 'fixed', top: 0, right: 0,
        height: '100vh', width: '400px',
        background: 'var(--black-soft)',
        zIndex: 201,
        display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid var(--black-border)',
        animation: 'slideInRight 0.3s ease',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--black-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700, fontSize: '16px',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--white)',
            }}>Your Cart</h2>
            <p style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px', color: 'var(--text-muted)',
              marginTop: '2px',
            }}>
              {items.length === 0 ? 'Empty' : `${items.length} recipe${items.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button onClick={closeCart} style={{
            background: 'none', border: '1px solid var(--black-border)',
            color: 'var(--text-muted)', cursor: 'pointer',
            width: '32px', height: '32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--magenta)'; e.currentTarget.style.color = 'var(--magenta)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--black-border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {items.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              height: '200px', gap: '12px',
            }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--black-border)" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: '13px', color: 'var(--text-muted)' }}>
                Your cart is empty
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map(item => (
                <div key={item.recipe.id} style={{
                  background: 'var(--black-card)',
                  border: '1px solid var(--black-border)',
                  padding: '14px',
                  display: 'flex', gap: '12px', alignItems: 'center',
                }}>
                  <div style={{
                    width: '44px', height: '44px', flexShrink: 0,
                    background: 'var(--magenta-dim)',
                    border: '1px solid rgba(224,24,90,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 800, fontSize: '14px',
                      color: 'var(--magenta)',
                    }}>
                      {item.recipe.name.charAt(0)}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600, fontSize: '13px',
                      color: 'var(--white)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                      {item.recipe.name}
                    </p>
                    <p style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '12px', color: 'var(--marigold)',
                      fontWeight: 600, marginTop: '2px',
                    }}>
                      ${item.recipe.price.toFixed(2)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    <button onClick={() => updateQuantity(item.recipe.id, item.quantity - 1)} style={qtyBtn}>−</button>
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 700, fontSize: '14px',
                      minWidth: '18px', textAlign: 'center', color: 'var(--white)',
                    }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.recipe.id, item.quantity + 1)} style={qtyBtn}>+</button>
                    <button onClick={() => removeItem(item.recipe.id)} style={{ ...qtyBtn, borderColor: 'rgba(224,24,90,0.3)', color: 'var(--magenta)', marginLeft: '4px' }}>✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Checkout footer */}
        {items.length > 0 && (
          <div style={{
            padding: '20px',
            borderTop: '1px solid var(--black-border)',
            background: 'var(--black-card)',
          }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', fontWeight: 600,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                Email — recipes delivered here
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'var(--black-soft)',
                  border: `1px solid ${emailError ? 'var(--magenta)' : 'var(--black-border)'}`,
                  color: 'var(--white)',
                  fontFamily: "'Montserrat', sans-serif", fontSize: '14px',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'var(--purple)'}
                onBlur={e => e.currentTarget.style.borderColor = emailError ? 'var(--magenta)' : 'var(--black-border)'}
              />
              {emailError && <p style={{ color: 'var(--magenta)', fontSize: '12px', marginTop: '6px' }}>{emailError}</p>}
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '16px', paddingTop: '14px',
              borderTop: '1px solid var(--black-border)',
            }}>
              <span style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '12px', fontWeight: 600,
                color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>Total</span>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '28px', fontWeight: 700,
                color: 'var(--marigold)',
              }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%', padding: '14px',
                background: loading ? 'var(--black-border)' : 'linear-gradient(135deg, var(--magenta), var(--purple))',
                color: 'white', border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => !loading && (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {loading ? 'Processing...' : 'Checkout with Stripe'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

const qtyBtn: React.CSSProperties = {
  width: '26px', height: '26px',
  background: 'var(--black-soft)',
  border: '1px solid var(--black-border)',
  cursor: 'pointer', fontSize: '14px', fontWeight: 700,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--white-dim)', transition: 'all 0.15s',
};
