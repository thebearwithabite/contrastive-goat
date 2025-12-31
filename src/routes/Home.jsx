import React from 'react'
import { Link } from 'react-router-dom'
import { track } from '../lib/analytics'
import { initAudio, startAmbient, playClick } from '../lib/audio'
import { fadeIn, float } from '../lib/animations'

export default function Home() {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const cardRefs = React.useRef([]);

  React.useEffect(() => {
    track('view_home');
    
    // Initialize audio on first visit
    initAudio();
    
    // Start ambient drone
    setTimeout(() => {
      startAmbient('/audio/ambient_drone.m4a');
    }, 1000);
    
    // Cinematic intro animation
    setTimeout(() => setIsLoaded(true), 100);
    
    // Apply float animation to cards
    setTimeout(() => {
      cardRefs.current.forEach((card, index) => {
        if (card) {
          float(card, { distance: 15, duration: 3000 + index * 500, delay: index * 200 });
        }
      });
    }, 500);
  }, []);

  const handleNavClick = (route) => {
    playClick();
    track('nav_' + route);
  };

  return (
    <div 
      className='grid' 
      style={{
        maxWidth: 840, 
        margin: '0 auto',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1.5s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <div className='card animate-glow' ref={el => cardRefs.current[0] = el}>
        <h1 style={{
          marginTop: 0,
          background: 'linear-gradient(90deg, var(--color-accent), var(--color-dream))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Welcome to the Island
        </h1>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Three experiments in contrastive learning — <em>felt, not explained</em>.
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong style={{ color: 'var(--color-accent)' }}>Predict the Future Frame</strong> — choose what comes five steps later.
          </li>
          <li>
            <strong style={{ color: 'var(--color-dream)' }}>Label the Feeling</strong> — cluster by vibe without labels.
          </li>
          <li>
            <strong style={{ color: 'var(--color-future)' }}>Contrastive Goat</strong> — pick the next goat in the sequence.
          </li>
        </ul>
        <div style={{display:'flex', gap:'.5rem', marginTop:'1.5rem', flexWrap: 'wrap'}}>
          <Link 
            className='btn animate-pulse' 
            to='/predict' 
            onClick={() => handleNavClick('predict')}
            style={{ flex: '1 1 auto' }}
          >
            Begin: Predict
          </Link>
          <Link 
            className='btn animate-pulse' 
            to='/feelings' 
            onClick={() => handleNavClick('feelings')}
            style={{ flex: '1 1 auto', animationDelay: '0.5s' }}
          >
            Begin: Feelings
          </Link>
          <Link 
            className='btn animate-pulse' 
            to='/goat' 
            onClick={() => handleNavClick('goat')}
            style={{ flex: '1 1 auto', animationDelay: '1s' }}
          >
            Begin: Goat
          </Link>
        </div>
      </div>
      <div className='card' ref={el => cardRefs.current[1] = el} style={{
        background: 'linear-gradient(135deg, rgba(15, 26, 33, 0.9), rgba(24, 48, 61, 0.5))',
        borderColor: 'var(--color-dream)'
      }}>
        <p style={{ 
          opacity: 0.9, 
          fontSize: '1.05rem',
          fontStyle: 'italic',
          textAlign: 'center',
          margin: 0
        }}>
          <em>"You learned to predict — not because you remembered, but because you contrasted."</em>
        </p>
      </div>
      <div className='card' ref={el => cardRefs.current[2] = el} style={{
        background: 'linear-gradient(135deg, rgba(15, 26, 33, 0.8), rgba(18, 32, 41, 0.6))',
        fontSize: '0.95rem',
        opacity: 0.8
      }}>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          The future is a shape you cannot see, only feel.<br/>
          What comes next has already happened.<br/>
          Learn the pattern. Forget the past.
        </p>
      </div>
    </div>
  )
}
