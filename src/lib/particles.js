/**
 * Particle system for background effects
 */

class Particle {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * (options.speed || 0.5);
    this.vy = (Math.random() - 0.5) * (options.speed || 0.5);
    this.size = Math.random() * (options.maxSize || 3) + (options.minSize || 1);
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = options.color || '#9cd3ff';
    this.life = Math.random() * 100;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life += 0.5;
    
    // Wrap around edges
    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;
    
    // Subtle pulsing
    this.opacity = Math.abs(Math.sin(this.life * 0.02)) * 0.5 + 0.1;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.options = {
      count: 50,
      speed: 0.3,
      minSize: 1,
      maxSize: 3,
      color: '#9cd3ff',
      connectDistance: 100,
      ...options
    };
    this.animationId = null;
    this.isRunning = false;
    
    this.resize();
    this.init();
  }
  
  init() {
    this.particles = [];
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push(new Particle(this.canvas, this.options));
    }
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  
  update() {
    this.particles.forEach(particle => particle.update());
  }
  
  draw() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections between nearby particles
    if (this.options.connectDistance > 0) {
      this.ctx.strokeStyle = this.options.color;
      for (let i = 0; i < this.particles.length; i++) {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p1 = this.particles[i];
          const p2 = this.particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < this.options.connectDistance) {
            const opacity = (1 - distance / this.options.connectDistance) * 0.2;
            this.ctx.save();
            this.ctx.globalAlpha = opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
            this.ctx.restore();
          }
        }
      }
    }
    
    // Draw particles
    this.particles.forEach(particle => particle.draw(this.ctx));
  }
  
  animate() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  }
  
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    this.isRunning = false;
  }
  
  destroy() {
    this.stop();
    this.particles = [];
  }
  
  setColor(color) {
    this.options.color = color;
    this.particles.forEach(particle => {
      particle.color = color;
    });
  }
  
  addParticle(x, y) {
    const particle = new Particle(this.canvas, this.options);
    particle.x = x;
    particle.y = y;
    this.particles.push(particle);
    
    // Keep particle count under control
    if (this.particles.length > this.options.count * 2) {
      this.particles.shift();
    }
  }
}

export function createParticleSystem(canvas, options) {
  return new ParticleSystem(canvas, options);
}
