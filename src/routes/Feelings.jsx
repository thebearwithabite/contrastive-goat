import React from 'react'
import items from '../../data/feelings_items.json'
import { track } from '../lib/analytics'
import { playEffect, playClick } from '../lib/audio'
import { ripple, scaleIn } from '../lib/animations'

export default function Feelings() {
  const [clusters, setClusters] = React.useState({ left: [], right: [] });
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [playingAudio, setPlayingAudio] = React.useState(null);
  const containerRef = React.useRef(null);
  const itemRefs = React.useRef({});

  function drop(where, item) {
    setClusters(c => ({ ...c, [where]: [...c[where], item] }));
    track('feelings_drop', { to: where, id: item.id });
    setSelectedItem(null);
    playClick();
  }

  function selectItem(item) {
    setSelectedItem(item);
    playClick();
    
    // Play the audio file
    if (item.modality === 'audio' && item.src) {
      playEffect(item.src, { volume: 0.6 });
      setPlayingAudio(item.id);
      
      // Visual ripple effect using ref
      const buttonEl = itemRefs.current[item.id];
      if (buttonEl && containerRef.current) {
        const rect = buttonEl.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - containerRect.left;
        const y = rect.top + rect.height / 2 - containerRect.top;
        ripple(containerRef.current, x, y, { color: 'rgba(199, 155, 255, 0.6)', size: 150 });
      }
      
      // Clear playing state after 2 seconds
      setTimeout(() => setPlayingAudio(null), 2000);
    }
  }

  const usedItems = new Set([...clusters.left, ...clusters.right].map(i => i.id));
  const availableItems = items.filter(i => !usedItems.has(i.id));

  return (
    <div ref={containerRef} className='grid' style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
      <div className='card'>
        <h2 style={{
          marginTop: 0,
          background: 'linear-gradient(90deg, var(--color-dream), var(--color-accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Label the Feeling (without labels)
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
          Click items to hear them, then sort into two piles by <em>vibe</em>. 
          There is no right answer — only structure emerging from contrast.
        </p>
        
        <div className='grid' style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
          {/* Available Items */}
          <div>
            <h4 style={{ marginTop: 0, opacity: 0.8, fontSize: '0.95rem' }}>Available Sounds</h4>
            <div className='grid' style={{ gap: '0.5rem' }}>
              {availableItems.map(i => (
                <button 
                  key={i.id}
                  ref={el => itemRefs.current[i.id] = el}
                  className={`btn${selectedItem?.id === i.id ? ' active' : ''}`}
                  onClick={() => selectItem(i)} 
                  aria-label={i.alt}
                  style={{
                    padding: '0.75rem',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                    borderColor: playingAudio === i.id ? 'var(--color-dream)' : undefined,
                    boxShadow: playingAudio === i.id ? '0 0 15px var(--color-dream)' : undefined
                  }}
                >
                  {playingAudio === i.id && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(199, 155, 255, 0.2)',
                      animation: 'pulse 0.5s ease-in-out infinite',
                      pointerEvents: 'none'
                    }} />
                  )}
                  <span style={{ position: 'relative', zIndex: 1 }}>
                    🔊 {i.alt}
                  </span>
                </button>
              ))}
            </div>
            {selectedItem && (
              <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(24, 48, 61, 0.5)', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.9rem', opacity: 0.8, margin: '0 0 0.5rem 0' }}>
                  Selected: <strong>{selectedItem.alt}</strong>
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className='btn' onClick={() => drop('left', selectedItem)} style={{ flex: 1 }}>
                    → Cluster A
                  </button>
                  <button className='btn' onClick={() => drop('right', selectedItem)} style={{ flex: 1 }}>
                    → Cluster B
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cluster A */}
          <div>
            <h4 style={{ marginTop: 0, opacity: 0.8, fontSize: '0.95rem' }}>Cluster A</h4>
            <div className='card' style={{ 
              minHeight: '200px',
              background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(15, 26, 33, 0.8))',
              borderColor: 'var(--color-future)'
            }}>
              <div className='grid' style={{ gap: '0.5rem' }}>
                {clusters.left.map(i => (
                  <div 
                    key={i.id} 
                    aria-label={i.alt}
                    style={{
                      padding: '0.5rem',
                      background: 'rgba(0, 255, 255, 0.1)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      animation: 'fadeIn 0.5s ease-out'
                    }}
                  >
                    {i.alt}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Cluster B */}
          <div>
            <h4 style={{ marginTop: 0, opacity: 0.8, fontSize: '0.95rem' }}>Cluster B</h4>
            <div className='card' style={{ 
              minHeight: '200px',
              background: 'linear-gradient(135deg, rgba(199, 155, 255, 0.05), rgba(15, 26, 33, 0.8))',
              borderColor: 'var(--color-dream)'
            }}>
              <div className='grid' style={{ gap: '0.5rem' }}>
                {clusters.right.map(i => (
                  <div 
                    key={i.id} 
                    aria-label={i.alt}
                    style={{
                      padding: '0.5rem',
                      background: 'rgba(199, 155, 255, 0.1)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      animation: 'fadeIn 0.5s ease-out'
                    }}
                  >
                    {i.alt}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <p style={{ 
          opacity: 0.7, 
          marginTop: '1.5rem', 
          fontStyle: 'italic',
          textAlign: 'center',
          fontSize: '0.95rem'
        }}>
          Later, we reveal the latent structure you taught yourself.
        </p>
      </div>
    </div>
  )
}
