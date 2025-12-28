/**
 * Animation utilities for beautiful, surreal effects
 */

/**
 * Fade in element
 */
export function fadeIn(element, duration = 1000, onComplete = null) {
  if (!element) return;
  
  element.style.opacity = '0';
  element.style.transition = `opacity ${duration}ms ease-out`;
  
  requestAnimationFrame(() => {
    element.style.opacity = '1';
  });
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * Fade out element
 */
export function fadeOut(element, duration = 1000, onComplete = null) {
  if (!element) return;
  
  element.style.transition = `opacity ${duration}ms ease-in`;
  element.style.opacity = '0';
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * Glitch effect - random pixel displacement
 */
export function glitch(element, duration = 300) {
  if (!element) return;
  
  const originalTransform = element.style.transform;
  const originalFilter = element.style.filter;
  
  const glitchFrames = [0, 50, 100, 150, 200, 250];
  let frameIndex = 0;
  
  const interval = setInterval(() => {
    if (frameIndex >= glitchFrames.length) {
      clearInterval(interval);
      element.style.transform = originalTransform;
      element.style.filter = originalFilter;
      return;
    }
    
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    const hue = Math.random() * 360;
    
    element.style.transform = `translate(${offsetX}px, ${offsetY}px) ${originalTransform}`;
    element.style.filter = `hue-rotate(${hue}deg) ${originalFilter}`;
    
    frameIndex++;
  }, duration / glitchFrames.length);
}

/**
 * Pulse effect - breathing animation
 */
export function pulse(element, options = {}) {
  if (!element) return null;
  
  const {
    scale = 1.05,
    duration = 2000,
    iterations = Infinity
  } = options;
  
  element.style.animation = `pulse ${duration}ms ease-in-out ${iterations === Infinity ? 'infinite' : iterations}`;
  
  // Inject keyframes if not already present
  if (!document.getElementById('pulse-keyframes')) {
    const style = document.createElement('style');
    style.id = 'pulse-keyframes';
    style.textContent = `
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(${scale}); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return () => {
    element.style.animation = '';
  };
}

/**
 * Ripple effect - water-like spreading circles
 */
export function ripple(element, x, y, options = {}) {
  if (!element) return;
  
  const {
    color = 'rgba(156, 211, 255, 0.5)',
    size = 100,
    duration = 1000
  } = options;
  
  const rippleEl = document.createElement('div');
  rippleEl.style.position = 'absolute';
  rippleEl.style.left = `${x}px`;
  rippleEl.style.top = `${y}px`;
  rippleEl.style.width = '0';
  rippleEl.style.height = '0';
  rippleEl.style.borderRadius = '50%';
  rippleEl.style.border = `2px solid ${color}`;
  rippleEl.style.transform = 'translate(-50%, -50%)';
  rippleEl.style.pointerEvents = 'none';
  rippleEl.style.transition = `all ${duration}ms ease-out`;
  
  element.appendChild(rippleEl);
  
  requestAnimationFrame(() => {
    rippleEl.style.width = `${size}px`;
    rippleEl.style.height = `${size}px`;
    rippleEl.style.opacity = '0';
  });
  
  setTimeout(() => {
    rippleEl.remove();
  }, duration);
}

/**
 * Float animation - slow vertical drift
 */
export function float(element, options = {}) {
  if (!element) return null;
  
  const {
    distance = 20,
    duration = 3000,
    delay = 0
  } = options;
  
  element.style.animation = `float ${duration}ms ease-in-out infinite`;
  element.style.animationDelay = `${delay}ms`;
  
  // Inject keyframes if not already present
  if (!document.getElementById('float-keyframes')) {
    const style = document.createElement('style');
    style.id = 'float-keyframes';
    style.textContent = `
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-${distance}px); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return () => {
    element.style.animation = '';
  };
}

/**
 * Glow effect - pulsing light
 */
export function glow(element, options = {}) {
  if (!element) return null;
  
  const {
    color = '#9cd3ff',
    intensity = 20,
    duration = 2000
  } = options;
  
  element.style.animation = `glow ${duration}ms ease-in-out infinite`;
  
  // Inject keyframes if not already present
  const keyframeId = 'glow-keyframes';
  if (!document.getElementById(keyframeId)) {
    const style = document.createElement('style');
    style.id = keyframeId;
    style.textContent = `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 ${intensity / 2}px ${color}; }
        50% { box-shadow: 0 0 ${intensity}px ${color}; }
      }
    `;
    document.head.appendChild(style);
  }
  
  return () => {
    element.style.animation = '';
  };
}

/**
 * Shimmer effect - light sweep
 */
export function shimmer(element, duration = 2000) {
  if (!element) return;
  
  const originalBackground = element.style.background;
  
  element.style.background = `
    linear-gradient(90deg, 
      transparent 0%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 100%
    )
  `;
  element.style.backgroundSize = '200% 100%';
  element.style.animation = `shimmer ${duration}ms ease-in-out`;
  
  // Inject keyframes if not already present
  if (!document.getElementById('shimmer-keyframes')) {
    const style = document.createElement('style');
    style.id = 'shimmer-keyframes';
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  setTimeout(() => {
    element.style.background = originalBackground;
    element.style.animation = '';
  }, duration);
}

/**
 * Scale in animation
 */
export function scaleIn(element, duration = 500, onComplete = null) {
  if (!element) return;
  
  element.style.transform = 'scale(0)';
  element.style.transition = `transform ${duration}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
  
  requestAnimationFrame(() => {
    element.style.transform = 'scale(1)';
  });
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * Slide in from direction
 */
export function slideIn(element, direction = 'bottom', duration = 500, onComplete = null) {
  if (!element) return;
  
  const translations = {
    top: 'translateY(-100%)',
    bottom: 'translateY(100%)',
    left: 'translateX(-100%)',
    right: 'translateX(100%)'
  };
  
  element.style.transform = translations[direction] || translations.bottom;
  element.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
  
  requestAnimationFrame(() => {
    element.style.transform = 'translate(0, 0)';
  });
  
  if (onComplete) {
    setTimeout(onComplete, duration);
  }
}

/**
 * Color wash effect - transition background color
 */
export function colorWash(element, color, duration = 1000) {
  if (!element) return;
  
  const originalBg = element.style.backgroundColor;
  
  element.style.transition = `background-color ${duration}ms ease-in-out`;
  element.style.backgroundColor = color;
  
  setTimeout(() => {
    element.style.backgroundColor = originalBg;
  }, duration);
}

/**
 * Particle burst effect
 */
export function particleBurst(element, x, y, options = {}) {
  if (!element) return;
  
  const {
    count = 10,
    color = '#9cd3ff',
    size = 4,
    speed = 100
  } = options;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    const angle = (Math.PI * 2 * i) / count;
    const distance = Math.random() * speed + 50;
    
    particle.style.position = 'absolute';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.transform = 'translate(-50%, -50%)';
    particle.style.transition = 'all 1s ease-out';
    
    element.appendChild(particle);
    
    requestAnimationFrame(() => {
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      particle.style.transform = `translate(${dx}px, ${dy}px)`;
      particle.style.opacity = '0';
    });
    
    setTimeout(() => particle.remove(), 1000);
  }
}
