'use client';

import { useState } from 'react';
import { recipes, categories } from '@/lib/recipes';
import { useCart } from '@/lib/cart';
import { Recipe } from '@/lib/cart';

export default function ListingsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const { addItem } = useCart();

  const filtered = activeCategory === 'All'
    ? recipes
    : recipes.filter(r => r.category === activeCategory);

  function handleAdd(recipe: Recipe) {
    addItem(recipe);
    setAddedIds(prev => new Set(prev).add(recipe.id));
    setTimeout(() => {
      setAddedIds(prev => {
        const next = new Set(prev);
        next.delete(recipe.id);
        return next;
      });
    }, 1500);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>

      {/* Page header */}
      <div style={{
        background: 'var(--charcoal)',
        padding: '64px 80px 48px',
        borderBottom: '4px solid var(--gold)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          right: '60px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '140px',
          opacity: 0.06,
          userSelect: 'none',
        }}>🌶️</div>

        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: '13px',
          color: 'var(--gold)',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '12px',
          opacity: 0.8,
        }}>
          Nuestra Colección
        </p>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: '72px',
          color: 'var(--cream)',
          letterSpacing: '0.05em',
          lineHeight: 1,
          marginBottom: '16px',
        }}>
          Recetas Auténticas
        </h1>
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: '19px',
          color: 'rgba(245,237,214,0.65)',
          maxWidth: '500px',
        }}>
          Cada receta llega a tu email como archivo HTML — lista para imprimir y cocinar.
        </p>
      </div>

      {/* Category filter */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid var(--cream-dark)',
        padding: '0 80px',
        display: 'flex',
        gap: '0',
        overflowX: 'auto',
      }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '18px 28px',
              background: 'none',
              border: 'none',
              borderBottom: activeCategory === cat ? '3px solid var(--terracotta)' : '3px solid transparent',
              fontFamily: "'Crimson Pro', serif",
              fontSize: '16px',
              fontWeight: activeCategory === cat ? 600 : 400,
              color: activeCategory === cat ? 'var(--terracotta)' : 'var(--charcoal-mid)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              letterSpacing: '0.02em',
            }}
          >
            {cat === 'All' ? '🌮 Todas' : cat}
          </button>
        ))}
      </div>

      {/* Recipe grid */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '48px 80px',
      }}>
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontSize: '15px',
          color: 'var(--charcoal-mid)',
          marginBottom: '32px',
          opacity: 0.7,
        }}>
          {filtered.length} receta{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '28px',
        }}>
          {filtered.map((recipe, i) => (
            <div
              key={recipe.id}
              style={{
                background: 'white',
                border: '1px solid var(--cream-dark)',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                animation: `fadeInUp 0.5s ease ${i * 0.05}s both`,
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 16px 48px rgba(44,36,22,0.12)';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Card header */}
              <div style={{
                background: 'var(--charcoal)',
                padding: '32px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '3px solid var(--terracotta)',
              }}>
                <span style={{ fontSize: '52px' }}>{recipe.emoji}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '32px',
                    color: 'var(--gold)',
                    letterSpacing: '0.05em',
                  }}>
                    ${recipe.price.toFixed(2)}
                  </div>
                  <div style={{
                    fontFamily: "'Crimson Pro', serif",
                    fontSize: '12px',
                    color: 'rgba(245,237,214,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    USD
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: '24px' }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  marginBottom: '12px',
                  flexWrap: 'wrap',
                }}>
                  <span style={tagStyle('var(--terracotta)', 'rgba(192,73,44,0.1)')}>
                    {recipe.category}
                  </span>
                  <span style={tagStyle('var(--olive)', 'rgba(74,92,47,0.1)')}>
                    {recipe.difficulty}
                  </span>
                  <span style={tagStyle('var(--charcoal-mid)', 'rgba(74,63,47,0.1)')}>
                    ⏱ {recipe.time}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--charcoal)',
                  marginBottom: '10px',
                  lineHeight: 1.3,
                }}>
                  {recipe.name}
                </h3>

                <p style={{
                  fontFamily: "'Crimson Pro', serif",
                  fontSize: '15px',
                  color: 'var(--charcoal-mid)',
                  lineHeight: 1.65,
                  marginBottom: '20px',
                }}>
                  {recipe.description}
                </p>

                <button
                  onClick={() => handleAdd(recipe)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: addedIds.has(recipe.id) ? 'var(--olive)' : 'var(--terracotta)',
                    color: 'var(--cream)',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '18px',
                    letterSpacing: '0.1em',
                    transition: 'background 0.2s',
                  }}
                >
                  {addedIds.has(recipe.id) ? '✓ Agregado' : '+ Agregar al Carrito'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function tagStyle(color: string, bg: string): React.CSSProperties {
  return {
    fontFamily: "'Crimson Pro', serif",
    fontSize: '11px',
    fontWeight: 600,
    color,
    background: bg,
    padding: '3px 8px',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };
}
