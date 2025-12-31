import React from 'react';
import { createParticleSystem } from '../lib/particles';

/**
 * Particle background field component
 */
export default function ParticleField({ color = '#9cd3ff', count = 30 }) {
  const canvasRef = React.useRef(null);
  const systemRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    // Create particle system
    systemRef.current = createParticleSystem(canvasRef.current, {
      count,
      speed: 0.2,
      minSize: 1,
      maxSize: 2,
      color,
      connectDistance: 80
    });

    systemRef.current.start();

    // Handle resize
    const handleResize = () => {
      if (systemRef.current) {
        systemRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (systemRef.current) {
        systemRef.current.destroy();
      }
    };
  }, [color, count]);

  // Update color when it changes
  React.useEffect(() => {
    if (systemRef.current) {
      systemRef.current.setColor(color);
    }
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.3
      }}
    />
  );
}
