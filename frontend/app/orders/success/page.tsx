`use client`;
import Link from 'next/link';


export default function SuccessPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      background: 'var(--cream)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center',
      }}>
        {/* Decorative tile border box */}
        <div style={{
          background: 'white',
          border: '3px solid var(--olive)',
          outline: '1px solid var(--gold)',
          outlineOffset: '-8px',
          padding: '64px 48px',
          position: 'relative',
        }}>
          {/* Corner decorations */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
            <div key={pos} style={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              background: 'var(--terracotta)',
              ...(pos.includes('top') ? { top: '-3px' } : { bottom: '-3px' }),
              ...(pos.includes('left') ? { left: '-3px' } : { right: '-3px' }),
            }} />
          ))}

          <div style={{ fontSize: '72px', marginBottom: '24px' }}>🎉</div>

          <p style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: '13px',
            color: 'var(--olive)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}>
            ¡Pago Exitoso!
          </p>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '42px',
            fontWeight: 700,
            color: 'var(--charcoal)',
            lineHeight: 1.2,
            marginBottom: '24px',
          }}>
            Tus recetas están en camino
          </h1>

          <div style={{
            background: 'var(--cream)',
            border: '1px solid var(--cream-dark)',
            borderLeft: '4px solid var(--olive)',
            padding: '20px 24px',
            textAlign: 'left',
            marginBottom: '32px',
          }}>
            <p style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: '17px',
              color: 'var(--charcoal-mid)',
              lineHeight: 1.7,
            }}>
              Revisa tu bandeja de entrada — te enviamos un email con tus recetas 
              como archivos adjuntos. ¡Listos para imprimir y cocinar hoy mismo! 🌮
            </p>
          </div>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link href="/listings" style={{
              display: 'inline-block',
              background: 'var(--terracotta)',
              color: 'var(--cream)',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '20px',
              letterSpacing: '0.1em',
              padding: '14px 32px',
              textDecoration: 'none',
              transition: 'background 0.2s',
            }}>
              Más Recetas
            </Link>
            <Link href="/" style={{
              display: 'inline-block',
              background: 'transparent',
              color: 'var(--terracotta)',
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '20px',
              letterSpacing: '0.1em',
              padding: '12px 32px',
              textDecoration: 'none',
              border: '2px solid var(--terracotta)',
              transition: 'all 0.2s',
            }}>
              Inicio
            </Link>
          </div>
        </div>

        {/* Decorative tagline */}
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontStyle: 'italic',
          fontSize: '16px',
          color: 'var(--charcoal-mid)',
          marginTop: '32px',
          opacity: 0.6,
        }}>
          "La cocina es el corazón del hogar." 🌶️
        </p>
      </div>
    </div>
  );
}
