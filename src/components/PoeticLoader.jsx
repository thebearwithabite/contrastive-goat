import React from 'react';

/**
 * Poetic loading component with rotating cryptic phrases
 */
const LOADING_PHRASES = [
  'Forgetting the past...',
  'Predicting the shape of time...',
  'Learning what comes next...',
  'The future remembers you...',
  'Contrasting the patterns...',
  'Finding the latent space...',
  'Building embeddings of dreams...',
  'Teaching the network to see...',
  'Measuring the distance between moments...',
  'Discovering what you already knew...'
];

export default function PoeticLoader({ message = null }) {
  const [phraseIndex, setPhraseIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % LOADING_PHRASES.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const currentPhrase = message || LOADING_PHRASES[phraseIndex];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        fontSize: '1.1rem',
        opacity: 0.7,
        fontStyle: 'italic',
        animation: 'fade 2s ease-in-out infinite'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div
            style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '3px solid #18303d',
              borderTop: '3px solid #9cd3ff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
        </div>
        <div key={phraseIndex} style={{ animation: 'fadeInOut 2s ease-in-out' }}>
          {currentPhrase}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fade {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
