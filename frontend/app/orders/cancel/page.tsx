'use client';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      background: 'var(--black)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '80px 64px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(224,24,90,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '72px', height: '72px', margin: '0 auto 32px',
          background: 'var(--black-card)',
          border: '1px solid var(--black-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </div>

        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px', fontWeight: 700,
          color: 'var(--text-muted)', letterSpacing: '0.3em',
          textTransform: 'uppercase', marginBottom: '16px',
        }}>
          Payment Cancelled
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '52px', fontWeight: 600,
          color: 'var(--white)', lineHeight: 1.1, marginBottom: '24px',
        }}>
          No charge was made.
        </h1>

        <div style={{
          background: 'var(--black-card)',
          border: '1px solid var(--black-border)',
          borderLeft: '3px solid var(--black-border)',
          padding: '20px 24px',
          textAlign: 'left', marginBottom: '40px',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px', fontWeight: 300,
            color: 'var(--white-dim)', lineHeight: 1.7,
          }}>
            Your cart is still saved. Come back when you're ready — 
            your recipes will be waiting.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/listings" style={{
            display: 'inline-block',
            background: 'transparent',
            color: 'var(--marigold)',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '12px 28px', textDecoration: 'none',
            border: '1px solid var(--marigold)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--marigold)'; e.currentTarget.style.color = 'var(--black)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--marigold)'; }}
          >
            Back to Recipes
          </Link>
          <Link href="/" style={{
            display: 'inline-block',
            background: 'transparent',
            color: 'var(--white-dim)',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '12px 28px', textDecoration: 'none',
            border: '1px solid var(--black-border)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--white-dim)'; e.currentTarget.style.color = 'var(--white)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--black-border)'; e.currentTarget.style.color = 'var(--white-dim)'; }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
