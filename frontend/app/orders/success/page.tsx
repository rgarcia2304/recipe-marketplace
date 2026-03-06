'use client';
import Link from 'next/link';

export default function SuccessPage() {
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
        background: 'radial-gradient(circle, rgba(123,47,190,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '520px', width: '100%', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '72px', height: '72px', margin: '0 auto 32px',
          background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px', fontWeight: 700,
          color: 'var(--magenta)', letterSpacing: '0.3em',
          textTransform: 'uppercase', marginBottom: '16px',
        }}>
          Payment Successful
        </p>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '52px', fontWeight: 600,
          color: 'var(--white)', lineHeight: 1.1, marginBottom: '24px',
        }}>
          Your recipes are on their way.
        </h1>

        <div style={{
          background: 'var(--black-card)',
          border: '1px solid var(--black-border)',
          borderLeft: '3px solid var(--purple)',
          padding: '20px 24px',
          textAlign: 'left', marginBottom: '40px',
        }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '14px', fontWeight: 300,
            color: 'var(--white-dim)', lineHeight: 1.7,
          }}>
            Check your inbox — we've sent your recipe files as email attachments. 
            Download, print, and start cooking. You own these forever.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <Link href="/listings" style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
            color: 'white',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '13px 28px', textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            More Recipes
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
