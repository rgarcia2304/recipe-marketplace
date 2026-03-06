'use client';
import { useState } from 'react';
import { recipes, categories } from '@/lib/recipes';
import { useCart, Recipe } from '@/lib/cart';

export default function ListingsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const filtered = activeCategory === 'All' ? recipes : recipes.filter(r => r.category === activeCategory);

  function handleAdd(recipe: Recipe) {
    addItem(recipe);
    setAddedIds(prev => new Set(prev).add(recipe.id));
    setTimeout(() => {
      setAddedIds(prev => { const n = new Set(prev); n.delete(recipe.id); return n; });
    }, 1500);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* Header */}
      <div style={{
        padding: '64px 64px 48px',
        borderBottom: '1px solid var(--black-border)',
        background: 'var(--black-soft)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '30%',
          background: 'linear-gradient(90deg, transparent, rgba(224,24,90,0.04))',
          pointerEvents: 'none',
        }} />
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '11px', fontWeight: 700,
          color: 'var(--magenta)', letterSpacing: '0.3em',
          textTransform: 'uppercase', marginBottom: '16px',
        }}>
          Our Collection
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '64px', fontWeight: 600,
          color: 'var(--white)', lineHeight: 1, marginBottom: '16px',
        }}>
          All Recipes
        </h1>
        <p style={{
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '14px', fontWeight: 300,
          color: 'var(--white-dim)', maxWidth: '480px',
        }}>
          Each recipe is delivered as an HTML file to your email — 
          formatted for printing, readable on any device.
        </p>
      </div>

      {/* Category tabs */}
      <div style={{
        padding: '0 64px',
        borderBottom: '1px solid var(--black-border)',
        background: 'var(--black-card)',
        display: 'flex', gap: '0',
        overflowX: 'auto',
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '18px 24px',
              background: 'none', border: 'none',
              borderBottom: activeCategory === cat ? '2px solid var(--magenta)' : '2px solid transparent',
              fontFamily: "'Montserrat', sans-serif",
              fontSize: '12px', fontWeight: activeCategory === cat ? 700 : 400,
              color: activeCategory === cat ? 'var(--white)' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.2s',
              whiteSpace: 'nowrap', letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {cat === 'All' ? 'All Recipes' : cat}
          </button>
        ))}
        <div style={{
          marginLeft: 'auto', display: 'flex', alignItems: 'center',
          paddingRight: '0',
        }}>
          <span style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '12px', color: 'var(--text-muted)',
            paddingLeft: '24px',
          }}>
            {filtered.length} results
          </span>
        </div>
      </div>

      {/* Grid */}
      <div style={{
        maxWidth: '1280px', margin: '0 auto',
        padding: '48px 64px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1px',
        background: 'var(--black-border)',
      }}>
        {filtered.map((recipe, i) => (
          <div
            key={recipe.id}
            style={{
              background: 'var(--black-card)',
              display: 'flex', flexDirection: 'column',
              transition: 'background 0.2s',
              animation: `fadeInUp 0.5s ease ${i * 0.04}s both`,
              cursor: 'default',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--black-soft)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--black-card)'}
          >
            {/* Card top accent */}
            <div style={{
              height: '3px',
              background: recipe.category === 'Tacos & Antojitos'
                ? 'linear-gradient(90deg, var(--magenta), var(--purple))'
                : recipe.category === 'Moles & Salsas'
                ? 'linear-gradient(90deg, var(--marigold), var(--magenta))'
                : 'linear-gradient(90deg, var(--cyan), var(--purple))',
            }} />

            <div style={{ padding: '28px 28px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Top row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={categoryTag(recipe.category)}>
                    {recipe.category.split(' & ')[0]}
                  </span>
                  {recipe.tag && (
                    <span style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '10px', fontWeight: 700,
                      color: 'var(--marigold)',
                      background: 'var(--marigold-dim)',
                      padding: '3px 8px',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      border: '1px solid rgba(245,166,35,0.3)',
                    }}>
                      {recipe.tag}
                    </span>
                  )}
                </div>
                <span style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '28px', fontWeight: 700,
                  color: 'var(--marigold)',
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  ${recipe.price.toFixed(2)}
                </span>
              </div>

              {/* Name */}
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '26px', fontWeight: 600,
                color: 'var(--white)', lineHeight: 1.2,
                marginBottom: '12px',
              }}>
                {recipe.name}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: '13px', fontWeight: 300,
                color: 'var(--white-dim)', lineHeight: 1.7,
                flex: 1, marginBottom: '24px',
              }}>
                {recipe.description}
              </p>

              {/* Meta row */}
              <div style={{
                display: 'flex', gap: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--black-border)',
                marginBottom: '20px',
              }}>
                {[
                  { label: 'Time', val: recipe.time },
                  { label: 'Serves', val: recipe.serves },
                  { label: 'Level', val: recipe.difficulty },
                ].map(m => (
                  <div key={m.label}>
                    <div style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '10px', fontWeight: 700,
                      color: 'var(--text-muted)',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                    }}>
                      {m.label}
                    </div>
                    <div style={{
                      fontFamily: "'Montserrat', sans-serif",
                      fontSize: '13px', fontWeight: 600,
                      color: 'var(--white)',
                      marginTop: '2px',
                    }}>
                      {m.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add button */}
              <button
                onClick={() => handleAdd(recipe)}
                style={{
                  width: '100%', padding: '13px',
                  background: addedIds.has(recipe.id)
                    ? 'rgba(0,212,255,0.1)'
                    : 'transparent',
                  color: addedIds.has(recipe.id) ? 'var(--cyan)' : 'var(--white)',
                  border: `1px solid ${addedIds.has(recipe.id) ? 'var(--cyan)' : 'var(--black-border)'}`,
                  cursor: 'pointer',
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: '12px', fontWeight: 700,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  if (!addedIds.has(recipe.id)) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, var(--magenta), var(--purple))';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = 'white';
                  }
                }}
                onMouseLeave={e => {
                  if (!addedIds.has(recipe.id)) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'var(--black-border)';
                    e.currentTarget.style.color = 'var(--white)';
                  }
                }}
              >
                {addedIds.has(recipe.id) ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function categoryTag(category: string): React.CSSProperties {
  const colors: Record<string, { color: string; bg: string; border: string }> = {
    'Tacos & Antojitos': { color: 'var(--magenta)', bg: 'var(--magenta-dim)', border: 'rgba(224,24,90,0.3)' },
    'Moles & Salsas': { color: 'var(--marigold)', bg: 'var(--marigold-dim)', border: 'rgba(245,166,35,0.3)' },
    'Aguas & Drinks': { color: 'var(--cyan)', bg: 'var(--cyan-dim)', border: 'rgba(0,212,255,0.3)' },
  };
  const c = colors[category] || { color: 'var(--white-dim)', bg: 'var(--black-border)', border: 'var(--black-border)' };
  return {
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '10px', fontWeight: 700,
    color: c.color, background: c.bg,
    padding: '3px 8px',
    letterSpacing: '0.08em', textTransform: 'uppercase',
    border: `1px solid ${c.border}`,
  };
}
