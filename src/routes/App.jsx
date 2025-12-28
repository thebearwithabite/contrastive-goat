import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import AudioPlayer from '../components/AudioPlayer'
import ParticleField from '../components/ParticleField'
import { isEmbedded, getEmbedMode, sendNavigation } from '../lib/embedAPI'
import { playClick } from '../lib/audio'

export default function App() {
  const { pathname } = useLocation();
  const embedMode = getEmbedMode();
  const showMinimal = isEmbedded() && embedMode.minimal;

  React.useEffect(() => {
    if (isEmbedded()) {
      sendNavigation(pathname);
    }
  }, [pathname]);

  function exportEvents() {
    const key = 'autogoat_events';
    const blob = new Blob([localStorage.getItem(key) || '[]'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'events.jsonl';
    a.click();
  }

  const handleNavClick = () => {
    playClick();
  };

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }} className={showMinimal ? 'embed-mode' : ''}>
      <ParticleField />
      {!showMinimal && (
        <header style={{ 
          padding: '1rem', 
          display: 'flex', 
          gap: '.75rem', 
          alignItems: 'center', 
          borderBottom: '1px solid #18303d',
          background: 'rgba(11, 18, 21, 0.8)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            fontWeight: 700, 
            letterSpacing: .4, 
            opacity: .9,
            textShadow: '0 0 10px rgba(156, 211, 255, 0.5)'
          }}>
            I ONLY KNOW WHAT HAPPENS NEXT
          </div>
          <nav style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem' }}>
            <Link className='btn' to='/' onClick={handleNavClick}>Home</Link>
            <Link className='btn' to='/predict' onClick={handleNavClick}>Predict</Link>
            <Link className='btn' to='/feelings' onClick={handleNavClick}>Feelings</Link>
            <Link className='btn' to='/goat' onClick={handleNavClick}>Goat</Link>
          </nav>
        </header>
      )}
      <main style={{ padding: '1.25rem', flex: 1, position: 'relative', zIndex: 1 }}>
        <Outlet />
      </main>
      {!showMinimal && (
        <footer style={{ 
          padding: '1rem', 
          borderTop: '1px solid #18303d', 
          opacity: .7, 
          fontSize: '.9rem',
          background: 'rgba(11, 18, 21, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
            {pathname === '/' ? 'You are not allowed to remember. Only to predict.' : 'Return to the shore when you are ready.'}
          </div>
          <button onClick={exportEvents} className='btn' style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}>
            Export Events
          </button>
        </footer>
      )}
      {!embedMode.noAudio && <AudioPlayer />}
    </div>
  )
}
