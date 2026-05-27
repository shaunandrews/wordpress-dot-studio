// <dot-grid [opacity] [repulsion] [ripple-strength] [spacing] [cross-size] [cross-thickness]>
// Animated grid of crosses connected by dashed lines, drawn on a canvas that
// fills the host. Drop it into any position:relative section as a background.
// Color is read from the canvas's computed `color`, so it follows the theme
// (e.g. inherits --color-chrome-fg). Honors prefers-reduced-motion.

const SPRING_K = 0.07;
const DAMPING = 0.8;
const SLEEP_EPS = 0.08;

const RADIUS_BASE = 150;
const RADIUS_EXPANDED = 30;
const RADIUS_EXPAND_SPEED = 0.28;
const RADIUS_CONTRACT_SPEED = 0.1;

const RIPPLE_SPEED = 9;
const RIPPLE_HALF_WIDTH = 32;

const INTRO_SPEED = 18;
const INTRO_FADE_WIDTH = 80;

const TARGET_MS = 1000 / 60;

class DotGrid extends HTMLElement {
  connectedCallback() {
    const num = (attr, fallback) => {
      const v = parseFloat(this.getAttribute(attr));
      return Number.isFinite(v) ? v : fallback;
    };

    this.opacity = num('opacity', 0.25);
    this.repulsion = num('repulsion', 0.25);
    this.rippleStrength = num('ripple-strength', 1);
    this.spacing = num('spacing', 24);
    this.crossSize = num('cross-size', 4);
    this.crossThickness = num('cross-thickness', 0.75);

    const canvas = document.createElement('canvas');
    canvas.style.opacity = String(this.opacity);
    this.appendChild(canvas);
    this.canvas = canvas;

    this.ctx = null;
    this.color = '';
    this.mouseX = -9999;
    this.mouseY = -9999;
    this.rafId = null;
    this.lastTimestamp = 0;

    this.currentRadius = RADIUS_BASE;
    this.targetRadius = RADIUS_BASE;
    this.ripples = [];

    this.introRadius = 0;
    this.introComplete = false;

    this.cols = 0;
    this.rows = 0;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.readColor = this.readColor.bind(this);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    if (prefersReducedMotion) {
      this.resizeStatic();
      this.resizeObserver = new ResizeObserver(() => this.resizeStatic());
      this.resizeObserver.observe(canvas);
      this.onColorChange = () => {
        this.readColor();
        this.drawStatic();
      };
      this.mediaQuery.addEventListener('change', this.onColorChange);
      this.reducedMotion = true;
      return;
    }

    this.resize();

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mousedown', this.onMouseDown);
    document.addEventListener('mouseup', this.onMouseUp);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);

    this.themeObserver = new MutationObserver(this.readColor);
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    this.mediaQuery.addEventListener('change', this.readColor);
  }

  disconnectedCallback() {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mousedown', this.onMouseDown);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.resizeObserver?.disconnect();
    this.themeObserver?.disconnect();
    if (this.reducedMotion) {
      this.mediaQuery?.removeEventListener('change', this.onColorChange);
    } else {
      this.mediaQuery?.removeEventListener('change', this.readColor);
    }
  }

  readColor() {
    this.color = getComputedStyle(this.canvas).color;
  }

  initDots() {
    this.cols = Math.ceil(this.canvas.offsetWidth / this.spacing) + 1;
    this.rows = Math.ceil(this.canvas.offsetHeight / this.spacing) + 1;
    const n = this.cols * this.rows;
    this.ox = new Float32Array(n);
    this.oy = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(this.canvas.offsetWidth * dpr);
    this.canvas.height = Math.round(this.canvas.offsetHeight * dpr);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
    this.readColor();
    this.initDots();
  }

  resize() {
    this.setupCanvas();
    this.ensureLoop();
  }

  resizeStatic() {
    this.setupCanvas();
    this.drawStatic();
  }

  tick(timestamp) {
    if (!this.ctx) return false;
    const { ctx, canvas, spacing, crossSize, crossThickness } = this;
    const rawDt = this.lastTimestamp === 0 ? TARGET_MS : timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;
    const dt = Math.min(rawDt / TARGET_MS, 3);

    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.fillStyle = this.color;

    const expandFactor = 1 - Math.pow(1 - RADIUS_EXPAND_SPEED, dt);
    const contractFactor = 1 - Math.pow(1 - RADIUS_CONTRACT_SPEED, dt);
    const lerpFactor = this.currentRadius < this.targetRadius ? expandFactor : contractFactor;
    this.currentRadius += (this.targetRadius - this.currentRadius) * lerpFactor;
    const radiusAnimating = Math.abs(this.currentRadius - this.targetRadius) > 0.3;

    if (!this.introComplete) {
      this.introRadius += INTRO_SPEED * dt;
      const diag = Math.sqrt(cssW * cssW + cssH * cssH);
      if (this.introRadius > diag + INTRO_FADE_WIDTH) {
        this.introComplete = true;
        ctx.globalAlpha = 1;
      }
    }

    const dampFactor = Math.pow(DAMPING, dt);
    const cursorActive = this.mouseX > -9998;
    let anyActive = false;

    const { ox, oy, vx, vy, cols, rows, ripples } = this;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const rx = c * spacing;
        const ry = r * spacing;

        let dvx = vx[i];
        let dvy = vy[i];
        let dox = ox[i];
        let doy = oy[i];

        if (cursorActive) {
          const cx = rx + dox;
          const cy = ry + doy;
          const ddx = cx - this.mouseX;
          const ddy = cy - this.mouseY;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist < this.currentRadius && dist > 0.5) {
            const force = (this.repulsion * (1 - dist / this.currentRadius)) / dist;
            dvx += force * ddx * dt;
            dvy += force * ddy * dt;
          }
        }

        for (const ripple of ripples) {
          const cx = rx + dox;
          const cy = ry + doy;
          const ddx = cx - ripple.x;
          const ddy = cy - ripple.y;
          const dist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (dist > 0.5) {
            const delta = dist - ripple.radius;
            const falloff = Math.exp(-0.5 * (delta / RIPPLE_HALF_WIDTH) ** 2);
            const force = (this.rippleStrength * falloff) / dist;
            dvx += force * ddx * dt;
            dvy += force * ddy * dt;
          }
        }

        dvx += SPRING_K * -dox * dt;
        dvy += SPRING_K * -doy * dt;

        dvx *= dampFactor;
        dvy *= dampFactor;

        dox += dvx * dt;
        doy += dvy * dt;

        ox[i] = dox;
        oy[i] = doy;
        vx[i] = dvx;
        vy[i] = dvy;

        if (
          Math.abs(dvx) > SLEEP_EPS ||
          Math.abs(dvy) > SLEEP_EPS ||
          Math.abs(dox) > SLEEP_EPS ||
          Math.abs(doy) > SLEEP_EPS
        ) {
          anyActive = true;
        }
      }
    }

    ctx.strokeStyle = this.color;
    ctx.lineWidth = crossThickness;
    ctx.setLineDash([1, 4]);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = c * spacing + ox[i];
        const y = r * spacing + oy[i];

        if (!this.introComplete) {
          const distFromCorner = Math.sqrt((c * spacing) ** 2 + (r * spacing) ** 2);
          ctx.globalAlpha = Math.max(0, Math.min(1, (this.introRadius - distFromCorner) / INTRO_FADE_WIDTH));
        }

        if (c < cols - 1) {
          const ni = r * cols + (c + 1);
          const nx = (c + 1) * spacing + ox[ni];
          const ny = r * spacing + oy[ni];
          ctx.beginPath();
          ctx.moveTo(x + crossSize, y);
          ctx.lineTo(nx - crossSize, ny);
          ctx.stroke();
        }
        if (r < rows - 1) {
          const ni = (r + 1) * cols + c;
          const nx = c * spacing + ox[ni];
          const ny = (r + 1) * spacing + oy[ni];
          ctx.beginPath();
          ctx.moveTo(x, y + crossSize);
          ctx.lineTo(nx, ny - crossSize);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);

    ctx.fillStyle = this.color;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        const x = c * spacing + ox[i];
        const y = r * spacing + oy[i];

        if (!this.introComplete) {
          const distFromCorner = Math.sqrt((c * spacing) ** 2 + (r * spacing) ** 2);
          ctx.globalAlpha = Math.max(0, Math.min(1, (this.introRadius - distFromCorner) / INTRO_FADE_WIDTH));
        }

        ctx.fillRect(x - crossSize, y - crossThickness / 2, crossSize * 2, crossThickness);
        ctx.fillRect(x - crossThickness / 2, y - crossSize, crossThickness, crossSize * 2);
      }
    }

    if (!this.introComplete) ctx.globalAlpha = 1;

    for (const ripple of ripples) ripple.radius += RIPPLE_SPEED * dt;
    this.ripples = ripples.filter((rip) => rip.radius < rip.maxRadius);

    return anyActive || cursorActive || radiusAnimating || this.ripples.length > 0 || !this.introComplete;
  }

  loop(timestamp) {
    if (this.tick(timestamp)) {
      this.rafId = requestAnimationFrame((t) => this.loop(t));
    } else {
      this.rafId = null;
      this.lastTimestamp = 0;
    }
  }

  ensureLoop() {
    if (this.rafId === null) {
      this.lastTimestamp = 0;
      this.rafId = requestAnimationFrame((t) => this.loop(t));
    }
  }

  drawStatic() {
    if (!this.ctx) return;
    const { ctx, canvas, spacing, crossSize, crossThickness, cols, rows } = this;
    const cssW = canvas.offsetWidth;
    const cssH = canvas.offsetHeight;
    ctx.clearRect(0, 0, cssW, cssH);

    ctx.strokeStyle = this.color;
    ctx.lineWidth = crossThickness;
    ctx.setLineDash([1, 4]);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing;
        const y = r * spacing;
        if (c < cols - 1) {
          ctx.beginPath();
          ctx.moveTo(x + crossSize, y);
          ctx.lineTo((c + 1) * spacing - crossSize, y);
          ctx.stroke();
        }
        if (r < rows - 1) {
          ctx.beginPath();
          ctx.moveTo(x, y + crossSize);
          ctx.lineTo(x, (r + 1) * spacing - crossSize);
          ctx.stroke();
        }
      }
    }
    ctx.setLineDash([]);

    ctx.fillStyle = this.color;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * spacing;
        const y = r * spacing;
        ctx.fillRect(x - crossSize, y - crossThickness / 2, crossSize * 2, crossThickness);
        ctx.fillRect(x - crossThickness / 2, y - crossSize, crossThickness, crossSize * 2);
      }
    }
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;
    this.mouseX = inside ? x : -9999;
    this.mouseY = inside ? y : -9999;
    this.ensureLoop();
  }

  onMouseDown(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      this.targetRadius = RADIUS_EXPANDED;
      this.ensureLoop();
    }
  }

  onMouseUp(e) {
    this.targetRadius = RADIUS_BASE;
    if (this.mouseX > -9998) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const diag = Math.sqrt(rect.width ** 2 + rect.height ** 2);
      this.ripples.push({
        x,
        y,
        radius: this.currentRadius * 0.85,
        maxRadius: diag + RIPPLE_HALF_WIDTH * 4,
      });
    }
    this.ensureLoop();
  }
}

customElements.define('dot-grid', DotGrid);
