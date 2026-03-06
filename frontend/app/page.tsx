'use client'
import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: 'calc(100vh - 72px)',
        background: 'var(--charcoal)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
        {/* Decorative tile pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(212,160,23,0.06) 59px, rgba(212,160,23,0.06) 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(212,160,23,0.06) 59px, rgba(212,160,23,0.06) 60px)
          `,
        }} />

        {/* Large decorative emoji cluster */}
        <div style={{
          position: 'absolute',
          right: '8%',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '180px',
          opacity: 0.08,
          userSelect: 'none',
          lineHeight: 1,
        }}>
          🌮
        </div>

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '800px',
          padding: '80px 80px',
        }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(212, 160, 23, 0.15)',
            border: '1px solid rgba(212, 160, 23, 0.3)',
            padding: '6px 16px',
            marginBottom: '32px',
          }}>
            <span style={{ fontSize: '14px' }}>🌶️</span>
            <span style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: '14px',
              color: 'var(--gold)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>
              Recetas Auténticas · Since 2024
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(72px, 10vw, 120px)',
            color: 'var(--cream)',
            lineHeight: 0.9,
            letterSpacing: '0.02em',
            marginBottom: '8px',
          }}>
            Renta
          </h1>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(72px, 10vw, 120px)',
            color: 'var(--gold)',
            lineHeight: 0.9,
            letterSpacing: '0.02em',
            marginBottom: '32px',
          }}>
            Recipe
          </h1>

          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: '22px',
            color: 'rgba(245, 237, 214, 0.8)',
            lineHeight: 1.7,
            maxWidth: '520px',
            marginBottom: '48px',
          }}>
            Recetas auténticas de la cocina mexicana — preparadas por abuelas, 
            guardadas por generaciones, y ahora disponibles para tu cocina.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/listings" style={{
              display: 'inline-block',
              background: 'var(--terracotta)',
              color: 'var(--cream)',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '22px',
              letterSpacing: '0.15em',
              padding: '16px 40px',
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: '2px solid var(--terracotta)',
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = 'var(--terracotta-dark)';
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.currentTarget.style.background = 'var(--terracotta)';
            }}
            >
              Ver Recetas →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section style={{
        background: 'var(--terracotta)',
        padding: '20px 0',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          gap: '60px',
          animation: 'none',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {['🌮 Tacos & Antojitos', '🫕 Moles & Salsas', '🌺 Aguas & Drinks', '🌶️ Recetas Auténticas', '🌮 Tacos & Antojitos', '🫕 Moles & Salsas'].map((item, i) => (
            <span key={i} style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '18px',
              color: 'rgba(245, 237, 214, 0.9)',
              letterSpacing: '0.1em',
              whiteSpace: 'nowrap',
            }}>
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Why us section */}
      <section style={{
        padding: '100px 80px',
        background: 'var(--cream)',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: '14px',
            color: 'var(--terracotta)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}>
            ¿Por qué Renta-Recipe?
          </p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '48px',
            color: 'var(--charcoal)',
            fontWeight: 700,
          }}>
            La cocina que no se olvida
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '40px',
        }}>
          {[
            { emoji: '👵🏽', title: 'Recetas de Abuela', desc: 'Cada receta fue documentada directamente de cocineras tradicionales. Sin atajos, sin substituciones.' },
            { emoji: '📧', title: 'Entrega Inmediata', desc: 'Compra una receta y recíbela en tu email en segundos. Lista para imprimir o guardar.' },
            { emoji: '🌶️', title: 'Auténtico Sabor', desc: 'Ingredientes reales, técnicas probadas. Si tu mole no sabe a Oaxaca, te devolvemos tu dinero.' },
          ].map((card, i) => (
            <div key={i} style={{
              padding: '40px 32px',
              border: '1px solid var(--cream-dark)',
              borderTop: '4px solid var(--terracotta)',
              background: 'white',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(-4px)';
              el.style.boxShadow = '0 12px 40px rgba(44,36,22,0.1)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'translateY(0)';
              el.style.boxShadow = 'none';
            }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>{card.emoji}</div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '22px',
                fontWeight: 700,
                color: 'var(--charcoal)',
                marginBottom: '12px',
              }}>
                {card.title}
              </h3>
              <p style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: '17px',
                color: 'var(--charcoal-mid)',
                lineHeight: 1.7,
              }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'var(--olive)',
        padding: '80px',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '56px',
          color: 'var(--cream)',
          letterSpacing: '0.05em',
          marginBottom: '16px',
        }}>
          ¿Listo para cocinar?
        </h2>
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: '20px',
          color: 'rgba(245,237,214,0.8)',
          marginBottom: '40px',
        }}>
          Más de 12 recetas auténticas esperándote.
        </p>
        <Link href="/listings" style={{
          display: 'inline-block',
          background: 'var(--gold)',
          color: 'var(--charcoal)',
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '22px',
          letterSpacing: '0.15em',
          padding: '16px 48px',
          textDecoration: 'none',
          transition: 'background 0.2s',
        }}>
          Explorar Recetas
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        background: 'var(--charcoal)',
        padding: '40px 80px',
        borderTop: '3px solid var(--gold)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '20px',
          color: 'var(--gold)',
          letterSpacing: '0.1em',
        }}>
          🌮 Renta-Recipe
        </div>
        <div style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: '14px',
          color: 'rgba(245,237,214,0.4)',
        }}>
          © 2024 Renta-Recipe. Hecho con 🌶️ y amor.
        </div>
      </footer>
    </div>
  );
}
