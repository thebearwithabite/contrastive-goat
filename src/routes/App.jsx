import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'

export default function App() {
  const { pathname } = useLocation();

  function exportEvents() {
    const key = 'autogoat_events';
    const blob = new Blob([localStorage.getItem(key) || '[]'], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'events.jsonl';
    a.click();
  }

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', display: 'flex', gap: '.75rem', alignItems: 'center', borderBottom: '1px solid #18303d' }}>
        <div style={{ fontWeight: 700, letterSpacing: .4, opacity: .9 }}>I ONLY KNOW WHAT HAPPENS NEXT</div>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: '.5rem' }}>
          <Link className='btn' to='/'>Home</Link>
          <Link className='btn' to='/predict'>Predict</Link>
          <Link className='btn' to='/feelings'>Feelings</Link>
          <Link className='btn' to='/goat'>Goat</Link>
        </nav>
      </header>
      <main style={{ padding: '1.25rem', flex: 1 }}>
        <Outlet />
      </main>
      <footer style={{ padding: '1rem', borderTop: '1px solid #18303d', opacity: .7, fontSize: '.9rem' }}>
        {pathname === '/' ? 'You are not allowed to remember. Only to predict.' : 'Return to the shore when you’re ready.'}
        <button onClick={exportEvents} style={{ marginLeft: '1rem' }}>Export Events</button>
      </footer>
    </div>
  )
}