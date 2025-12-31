import React from 'react'
import data from '../../data/predict_sets.json'
import { track } from '../lib/analytics'
import { playSuccess, playFailure, playClick } from '../lib/audio'
import { colorWash, scaleIn } from '../lib/animations'

const POETIC_FEEDBACK = {
  correct: [
    'You saw what was coming...',
    'The future recognized you.',
    'Time bent in your favor.',
    'The pattern revealed itself.',
    'You predicted correctly.'
  ],
  incorrect: [
    'Time slipped through your fingers...',
    'The future looked away.',
    'A different path was taken.',
    'The pattern remained hidden.',
    'You misread the signs.'
  ]
};

export default function Predict() {
  const [i, setI] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const containerRef = React.useRef(null);
  
  const s = data[i];

  function choose(idx) {
    track('predict_choice', { idx, answer: s.answer_index });
    
    const isCorrect = idx === s.answer_index;
    setIsTransitioning(true);
    
    // Audio feedback
    if (isCorrect) {
      playSuccess();
      setScore(v => v + 1);
    } else {
      playFailure();
      setScore(v => v - 1);
    }
    
    // Visual feedback
    if (containerRef.current) {
      const color = isCorrect ? 'rgba(0, 255, 255, 0.2)' : 'rgba(255, 100, 100, 0.2)';
      colorWash(containerRef.current, color, 800);
    }
    
    // Poetic feedback
    const messages = isCorrect ? POETIC_FEEDBACK.correct : POETIC_FEEDBACK.incorrect;
    const message = messages[Math.floor(Math.random() * messages.length)];
    setFeedback(message);
    
    // Transition to next question
    setTimeout(() => {
      setFeedback('');
      setI(v => (v + 1) % data.length);
      setIsTransitioning(false);
    }, 1500);
  }

  const handleClick = (idx) => {
    if (!isTransitioning) {
      playClick();
      choose(idx);
    }
  };

  return (
    <div 
      ref={containerRef}
      className='card' 
      style={{
        maxWidth: 700, 
        margin: '0 auto',
        transition: 'all 0.5s ease',
        opacity: isTransitioning ? 0.7 : 1
      }}
    >
      <h2 style={{
        marginTop: 0,
        background: 'linear-gradient(90deg, var(--color-accent), var(--color-future))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Predict the Future Frame
      </h2>
      <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
        <strong>Prompt:</strong> {s.prompt}
      </p>
      <p style={{ fontStyle: 'italic', opacity: 0.8 }}>
        Which event is most likely <em>5 steps later</em>?
      </p>
      <div className='grid' style={{ gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: '0.75rem', marginTop: '1rem' }}>
        {s.choices.map((c, idx) => (
          <button 
            className='btn' 
            key={idx} 
            onClick={() => handleClick(idx)}
            disabled={isTransitioning}
            style={{
              padding: '1rem',
              opacity: isTransitioning ? 0.5 : 1,
              cursor: isTransitioning ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {c}
          </button>
        ))}
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
          Pattern Recognition Score
        </div>
        <div style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold',
          background: score >= 0 ? 'linear-gradient(90deg, var(--color-future), var(--color-dream))' : 'linear-gradient(90deg, #ff6b6b, #ff8e8e)',
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
