'use client';

import Link from 'next/link';
import { useCart } from '@/lib/cart';

export default function Navbar() {
  const { itemCount, openCart } = useCart();

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--charcoal)',
      borderBottom: '3px solid var(--gold)',
      padding: '0 48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '72px',
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>🌮</span>
        <div>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '26px',
            color: 'var(--gold)',
            letterSpacing: '0.1em',
            lineHeight: 1,
          }}>
            Renta-Recipe
          </div>
          <div style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: '11px',
            color: 'rgba(212, 160, 23, 0.6)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Recetas Auténticas
          </div>
        </div>
      </Link>

      {/* Nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link href="/" style={navLinkStyle}>Inicio</Link>
        <Link href="/listings" style={navLinkStyle}>Recetas</Link>

        {/* Cart button */}
        <button
          onClick={openCart}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--terracotta)',
            border: 'none',
            borderRadius: '0',
            padding: '10px 20px',
            cursor: 'pointer',
            color: 'var(--cream)',
            fontFamily: "'Crimson Pro', serif",
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            transition: 'background 0.2s',
            position: 'relative',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--terracotta-dark)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--terracotta)')}
        >
          <span style={{ fontSize: '18px' }}>🛒</span>
          <span>Carrito</span>
          {itemCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--gold)',
              color: 'var(--charcoal)',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
            }}>
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}

const navLinkStyle: React.CSSProperties = {
  fontFamily: "'Crimson Pro', serif",
  fontSize: '17px',
  fontWeight: 400,
  color: 'var(--cream)',
  textDecoration: 'none',
  letterSpacing: '0.05em',
  transition: 'color 0.2s',
  opacity: 0.85,
};
