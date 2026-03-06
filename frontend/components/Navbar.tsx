'use client';
import Link from 'next/link';
import { useCart } from '@/lib/cart';
import { useState } from 'react';

export default function Navbar() {
  const { itemCount, openCart } = useCart();
  const [hoverRecipes, setHoverRecipes] = useState(false);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(8, 8, 16, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--black-border)',
      padding: '0 64px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '68px',
    }}>
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: '10px', height: '10px', background: 'var(--marigold)', borderRadius: '50%' }} />
        </div>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800,
          fontSize: '18px',
          color: 'var(--white)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Renta<span style={{ color: 'var(--magenta)' }}>Recipe</span>
        </span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
        <Link href="/" style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px', fontWeight: 500,
          color: 'var(--white-dim)', textDecoration: 'none',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}>
          Home
        </Link>
        <Link
          href="/listings"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px', fontWeight: 500,
            color: hoverRecipes ? 'var(--white)' : 'var(--white-dim)',
            textDecoration: 'none',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'color 0.2s',
          }}
          onMouseEnter={() => setHoverRecipes(true)}
          onMouseLeave={() => setHoverRecipes(false)}
        >
          Recipes
        </Link>

        <button
          onClick={openCart}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'transparent',
            border: '1px solid var(--black-border)',
            padding: '8px 18px',
            cursor: 'pointer',
            color: 'var(--white)',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '13px', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            transition: 'all 0.2s',
            position: 'relative',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--magenta)';
            e.currentTarget.style.color = 'var(--magenta)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--black-border)';
            e.currentTarget.style.color = 'var(--white)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Cart
          {itemCount > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              background: 'var(--magenta)',
              color: 'white', borderRadius: '50%',
              width: '20px', height: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700,
            }}>
              {itemCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
