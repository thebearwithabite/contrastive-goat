import React from 'react'
import pairs from '../../data/goat_pairs.json'
import { track } from '../lib/analytics'
import { playSuccess, playFailure, playClick, fadeAmbient } from '../lib/audio'
import { particleBurst, pulse } from '../lib/animations'

function GoatSVG({ seed = 0, isAnimated = false }) {
  const [breathe, setBreathe] = React.useState(0);
  const [blink, setBlink] = React.useState(false);
  
  React.useEffect(() => {
    if (!isAnimated) return;
    
    // Breathing animation
    const breathInterval = setInterval(() => {
      setBreathe(Math.sin(Date.now() / 1000) * 2);
    }, 50);
    
    // Random blinking
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 3000);
    
    return () => {
      clearInterval(breathInterval);
      clearInterval(blinkInterval);
    };
  }, [isAnimated]);
  
  const ear = 6 + (seed % 4);
  const horn = 10 + ((seed * 3) % 6);
  const baseScale = 1 + breathe / 100;
  
  return (
    <svg viewBox='0 0 100 60' width='100%' height='100%' style={{ 
      transform: `scale(${baseScale})`,
      transition: 'transform 0.3s ease'
    }}>
      <rect x='0' y='0' width='100' height='60' fill='none'/>
      <circle 
        cx='30' 
        cy='30' 
        r='14' 
        stroke='#9cd3ff' 
        fill='none' 
        strokeWidth='2'
        style={{
          filter: 'drop-shadow(0 0 8px rgba(156, 211, 255, 0.5))'
        }}
      />
      <path 
        d={`M38 26 q ${horn} -10 16 0`} 
        stroke='#e6f0f2' 
        fill='none' 
        strokeWidth='2'
        style={{
          filter: 'drop-shadow(0 0 4px rgba(230, 240, 242, 0.6))'
        }}
      />
      <circle 
        cx='26' 
        cy='28' 
        r={blink ? 0.5 : 2} 
        fill='#e6f0f2'
        style={{ transition: 'r 0.1s ease' }}
      />
      <circle 
        cx='34' 
        cy='28' 
        r={blink ? 0.5 : 2} 
        fill='#e6f0f2'
        style={{ transition: 'r 0.1s ease' }}
      />
      <path 
        d={`M20 20 q ${ear} -8 8 0`} 
        stroke='#e6f0f2' 
        fill='none' 
        strokeWidth='2'
      />
      <rect 
        x='50' 
        y='34' 
        width='28' 
        height='10' 
        stroke='#9cd3ff' 
        fill='none' 
        strokeWidth='2'
        style={{
          filter: 'drop-shadow(0 0 8px rgba(156, 211, 255, 0.5))'
        }}
      />
    </svg>
  );
}

export default function Goat() {
  const [idx, setIdx] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const containerRef = React.useRef(null);
  
  const p = pairs[idx];

  function pick(which) {
    track('goat_pick', { which, expected: p.next });
    const isCorrect = which === p.next;
    setIsTransitioning(true);
    
    // Audio feedback and ambient modulation
    if (isCorrect) {
      playSuccess();
      setScore(s => s + 1);
      // Increase ambient volume slightly with each correct answer
      fadeAmbient(0.3 + Math.min(score, 10) * 0.02, 1.0);
      
      // Particle burst effect
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        particleBurst(
          containerRef.current, 
          rect.width / 2, 
          rect.height / 2, 
          { count: 15, color: 'var(--color-future)', speed: 150 }
        );
      }
    } else {
      playFailure();
      setScore(s => s - 1);
      // Decrease ambient volume on wrong answer
      fadeAmbient(Math.max(0.2, 0.3 - Math.abs(score) * 0.02), 1.0);
    }
    
    // Poetic feedback
    const correctMessages = [
      'The goat nods knowingly.',
      'You saw the pattern.',
      'Correct. The sequence continues.',
      'The future goat approves.',
      'You predicted the next form.'
    ];
    const incorrectMessages = [
      'The goat looks away.',
      'A different goat emerged.',
      'The pattern shifted.',
      'You misread the sequence.',
      'The goat remains unknowable.'
    ];
    const messages = isCorrect ? correctMessages : incorrectMessages;
    setFeedback(messages[Math.floor(Math.random() * messages.length)]);
    
    // Transition
    setTimeout(() => {
      setFeedback('');
      setIdx(i => (i + 1) % pairs.length);
      setIsTransitioning(false);
    }, 1500);
  }

  const handlePick = (which) => {
    if (!isTransitioning) {
      playClick();
      pick(which);
    }
  };

  return (
    <div ref={containerRef} className='card' style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
      <h2 style={{
        marginTop: 0,
        background: 'linear-gradient(90deg, var(--color-accent), var(--color-memory))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Contrastive Goat
      </h2>
      <p style={{ fontSize: '1.05rem', fontStyle: 'italic', opacity: 0.9 }}>
        Which goat came <em>next</em> in the sequence?
      </p>
      
      <div className='grid' style={{ 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1rem', 
        marginTop: '1.5rem',
        opacity: isTransitioning ? 0.6 : 1,
        transition: 'opacity 0.5s ease'
      }}>
        <div className='card' style={{ 
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(15, 26, 33, 0.8), rgba(24, 48, 61, 0.4))',
          cursor: isTransitioning ? 'not-allowed' : 'pointer'
        }}>
          <GoatSVG seed={p.a_seed} isAnimated={!isTransitioning} />
        </div>
        <div className='card' style={{ 
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(15, 26, 33, 0.8), rgba(24, 48, 61, 0.4))',
          cursor: isTransitioning ? 'not-allowed' : 'pointer'
        }}>
          <GoatSVG seed={p.b_seed} isAnimated={!isTransitioning} />
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '.75rem', marginTop: '1.5rem' }}>
        <button 
          className='btn' 
          onClick={() => handlePick('a')}
          disabled={isTransitioning}
          style={{ 
            flex: 1,
            padding: '1rem',
            opacity: isTransitioning ? 0.5 : 1,
            cursor: isTransitioning ? 'not-allowed' : 'pointer'
          }}
        >
          ← Left was next
        </button>
        <button 
          className='btn' 
          onClick={() => handlePick('b')}
          disabled={isTransitioning}
          style={{ 
            flex: 1,
            padding: '1rem',
            opacity: isTransitioning ? 0.5 : 1,
            cursor: isTransitioning ? 'not-allowed' : 'pointer'
          }}
        >
          Right was next →
        </button>
      </div>
      
      {feedback && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          background: 'rgba(156, 211, 255, 0.1)',
          borderRadius: '12px',
          textAlign: 'center',
          fontStyle: 'italic',
          fontSize: '1.05rem',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          {feedback}
        </div>
      )}
      
      <div style={{
        marginTop: '1.5rem',
        padding: '0.75rem',
        background: 'rgba(24, 48, 61, 0.5)',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.25rem' }}>
          Goat Wisdom Score
        </div>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          background: score >= 0 ? 'linear-gradient(90deg, var(--color-memory), var(--color-accent))' : 'linear-gradient(90deg, #ff6b6b, #ff8e8e)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          {score}
        </div>
      </div>
    </div>
  )
}
