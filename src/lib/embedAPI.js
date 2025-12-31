/**
 * Embed API for iframe integration with papersthatdream.com
 * Handles postMessage communication with parent window
 */

class EmbedAPI {
  constructor() {
    this.isEmbedded = this.detectEmbed();
    this.parentOrigin = '*'; // Set to specific origin for production
    this.messageHandlers = new Map();
    
    if (this.isEmbedded) {
      this.init();
    }
  }

  /**
   * Detect if running in iframe
   */
  detectEmbed() {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }

  /**
   * Initialize embed API
   */
  init() {
    window.addEventListener('message', this.handleMessage.bind(this));
    this.sendReady();
  }

  /**
   * Handle incoming messages from parent
   */
  handleMessage(event) {
    // Validate origin in production - for development we accept all
    // TODO: Set specific allowed origins in production
    const allowedOrigins = [
      'https://papersthatdream.com',
      'https://thebearwithabite.github.io',
      'http://localhost:5173',
      'http://localhost:4173'
    ];
    
    // In production, uncomment this validation:
    // if (!allowedOrigins.includes(event.origin)) {
    //   console.warn('Rejected message from unauthorized origin:', event.origin);
    //   return;
    // }

    const { type, data } = event.data;

    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type)(data);
    }
  }

  /**
   * Register a message handler
   */
  on(type, handler) {
    this.messageHandlers.set(type, handler);
  }

  /**
   * Send message to parent window
   */
  sendToParent(type, data = {}) {
    if (!this.isEmbedded) return;

    window.parent.postMessage(
      {
        source: 'contrastive-goat',
        type,
        data
      },
      this.parentOrigin
    );
  }

  /**
   * Notify parent that embed is ready
   */
  sendReady() {
    this.sendToParent('ready', {
      timestamp: Date.now(),
      url: window.location.href
    });
  }

  /**
   * Send interaction event to parent
   */
  sendInteraction(action, metadata = {}) {
    this.sendToParent('interaction', {
      action,
      metadata,
      timestamp: Date.now()
    });
  }

  /**
   * Send navigation event to parent
   */
  sendNavigation(route) {
    this.sendToParent('navigation', {
      route,
      timestamp: Date.now()
    });
  }

  /**
   * Send state update to parent
   */
  sendState(state) {
    this.sendToParent('state', {
      ...state,
      timestamp: Date.now()
    });
  }

  /**
   * Request fullscreen
   */
  requestFullscreen() {
    this.sendToParent('fullscreen', { requested: true });
  }

  /**
   * Get embed mode preference from URL params
   */
  getEmbedMode() {
    const params = new URLSearchParams(window.location.search);
    return {
      minimal: params.get('minimal') === 'true',
      noAudio: params.get('noAudio') === 'true',
      autoStart: params.get('autoStart') === 'true'
    };
  }
}

// Singleton instance
export const embedAPI = new EmbedAPI();

// Convenience functions
export const isEmbedded = () => embedAPI.isEmbedded;
export const sendInteraction = (action, metadata) => embedAPI.sendInteraction(action, metadata);
export const sendNavigation = (route) => embedAPI.sendNavigation(route);
export const sendState = (state) => embedAPI.sendState(state);
export const onMessage = (type, handler) => embedAPI.on(type, handler);
export const getEmbedMode = () => embedAPI.getEmbedMode();
