'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - 68px)',
        background: 'var(--black)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '0 64px',
      }}>
        {/* Background glow effects */}
        <div style={{
          position: 'absolute',
          top: '20%', left: '60%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(123,47,190,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%', left: '10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(224,24,90,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Grid pattern */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(var(--black-border) 1px, transparent 1px), linear-gradient(90deg, var(--black-border) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.3,
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px' }}>
          {/* Tag */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid rgba(245,166,35,0.4)',
            padding: '6px 14px', marginBottom: '40px',
          }}>
            <div style={{ width: '6px', height: '6px', background: 'var(--marigold)', borderRadius: '50%' }} />
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '11px', fontWeight: 600,
              color: 'var(--marigold)', letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Authentic Mexican Recipes
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(64px, 9vw, 110px)',
            fontWeight: 300,
            color: 'var(--white)',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '8px',
          }}>
            Cook Like
          </h1>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(64px, 9vw, 110px)',
            fontWeight: 700,
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, var(--magenta), var(--purple-bright))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: '40px',
          }}>
            Abuela Did.
          </h1>

          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '16px', fontWeight: 300,
            color: 'var(--white-dim)',
            lineHeight: 1.8,
            maxWidth: '460px',
            marginBottom: '48px',
          }}>
            Hand-written recipes from Mexican grandmothers. 
            Buy once, download forever, cook for life.
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Link href="/listings" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
              color: 'white',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px', fontWeight: 700,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              padding: '14px 36px',
              textDecoration: 'none',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
            >
              Browse Recipes
            </Link>
            <span style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}>
              12 recipes available
            </span>
          </div>
        </div>

        {/* Right side decorative stats */}
        <div style={{
          position: 'absolute', right: '64px', top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }}>
          {[
            { num: '12', label: 'Recipes' },
            { num: '3', label: 'Categories' },
            { num: '$4.99', label: 'Starting at' },
          ].map(stat => (
            <div key={stat.label} style={{
              textAlign: 'right',
              padding: '20px 24px',
              border: '1px solid var(--black-border)',
              background: 'var(--black-card)',
              minWidth: '130px',
            }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '36px', fontWeight: 700,
                color: 'var(--marigold)',
                lineHeight: 1,
              }}>
                {stat.num}
              </div>
              <div style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '11px', fontWeight: 500,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                marginTop: '4px',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee strip */}
      <div style={{
        background: 'linear-gradient(135deg, var(--magenta), var(--purple))',
        padding: '14px 0',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '0' }}>
          {['Tacos al Pastor', 'Mole Negro', 'Agua de Jamaica', 'Salsa Macha', 'Tepache', 'Tlayudas', 'Champurrado', 'Horchata'].map((item, i) => (
            <span key={i} style={{
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px', fontWeight: 700,
              color: 'rgba(255,255,255,0.85)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              padding: '0 24px',
              whiteSpace: 'nowrap',
            }}>
              {item} {i < 7 ? '·' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* How it works */}
      <section style={{
        padding: '100px 64px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ marginBottom: '64px' }}>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px', fontWeight: 700,
            color: 'var(--magenta)', letterSpacing: '0.3em',
            textTransform: 'uppercase', marginBottom: '16px',
          }}>
            How It Works
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '52px', fontWeight: 600,
            color: 'var(--white)', lineHeight: 1.1,
          }}>
            Three steps to your kitchen.
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--black-border)' }}>
          {[
            { step: '01', title: 'Browse', desc: 'Explore 12 authentic recipes across tacos, moles, and aguas frescas. Each one tested and documented.' },
            { step: '02', title: 'Purchase', desc: 'Add to cart, enter your email, and checkout securely via Stripe. Your recipes are attached instantly.' },
            { step: '03', title: 'Cook', desc: 'Open your email, download the HTML recipe file, and start cooking. No subscriptions, own it forever.' },
          ].map(item => (
            <div key={item.step} style={{
              padding: '48px 40px',
              background: 'var(--black-card)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--black-soft)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--black-card)'}
            >
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '64px', fontWeight: 700,
                color: 'var(--black-border)',
                lineHeight: 1, marginBottom: '24px',
              }}>
                {item.step}
              </div>
              <h3 style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '16px', fontWeight: 700,
                color: 'var(--white)',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                marginBottom: '12px',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '14px', fontWeight: 300,
                color: 'var(--white-dim)', lineHeight: 1.7,
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        margin: '0 64px 100px',
        background: 'var(--black-card)',
        border: '1px solid var(--black-border)',
        padding: '80px 64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '40%',
          background: 'linear-gradient(90deg, transparent, rgba(123,47,190,0.08))',
          pointerEvents: 'none',
        }} />
        <div>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '48px', fontWeight: 600,
            color: 'var(--white)', lineHeight: 1.1,
            marginBottom: '12px',
          }}>
            Ready to cook?
          </h2>
          <p style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '15px', fontWeight: 300,
            color: 'var(--white-dim)',
          }}>
            Recipes starting at $4.99. No subscription required.
          </p>
        </div>
        <Link href="/listings" style={{
          display: 'inline-block',
          background: 'transparent',
          color: 'var(--marigold)',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '13px', fontWeight: 700,
          letterSpacing: '0.12em', textTransform: 'uppercase',
          padding: '14px 40px',
          textDecoration: 'none',
          border: '1px solid var(--marigold)',
          flexShrink: 0,
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'var(--marigold)';
          e.currentTarget.style.color = 'var(--black)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = 'var(--marigold)';
        }}
        >
          Shop All Recipes
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--black-border)',
        padding: '32px 64px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 800, fontSize: '14px',
          color: 'var(--white)', letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Renta<span style={{ color: 'var(--magenta)' }}>Recipe</span>
        </span>
        <span style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '12px', color: 'var(--text-muted)',
        }}>
          © 2024 RentaRecipe. All rights reserved.
        </span>
      </footer>
    </div>
  );
}
