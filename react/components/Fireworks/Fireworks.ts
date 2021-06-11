/* eslint-disable no-plusplus */
/* eslint-disable max-classes-per-file */

// === CONFIGURATION ===

// Minimum particle brightness.
const PARTICLE_BRIGHTNESS_MIN = 50;
// Maximum particle brightness.
const PARTICLE_BRIGHTNESS_MAX = 80;
// Base particle count per firework. 质点总数
const PARTICLE_COUNT = 230;
// Minimum particle decay rate.
const PARTICLE_DECAY_MIN = 0.015;
// Maximum particle decay rate.
const PARTICLE_DECAY_MAX = 0.03;
// Base particle friction.
// Slows the speed of particles over time.
const PARTICLE_FRICTION = 0.95;
// Base particle gravity.
// How quickly particles move toward a downward trajectory.
const PARTICLE_GRAVITY = 0.7;
// Base particle transparency.
const PARTICLE_TRANSPARENCY = 1;
// Minimum particle speed.
const PARTICLE_SPEED_MIN = 1;
// Maximum particle speed.
const PARTICLE_SPEED_MAX = 10;
// Base length of explosion particle trails.
const PARTICLE_TRAIL_LENGTH = 5;

// Alpha level that canvas cleanup iteration removes existing trails.
// Lower value increases trail duration.
// 越小，烟花散开的轨迹停留时间越长，看起来烟花越长
const CANVAS_CLEANUP_ALPHA = 0.15;
// Minimum number of hue
const HUE_MIN = -60;
// Maximum number of hue
const HUE_MAX = 120;
// Minimum number of ticks between each automatic firework launch.
const TICKS_PER_FIREWORK_AUTOMATED_MIN = 15;
// Maximum number of ticks between each automatic firework launch.
const TICKS_PER_FIREWORK_AUTOMATED_MAX = 20;

// === END CONFIGURATION ===

// === HELPERS ===

// Use requestAnimationFrame to maintain smooth animation loops.
// Fall back on setTimeout() if browser support isn't available.
const RAF =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame;

const cancelRAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

// Get a random number within the specified range.
function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// === END HELPERS ===

/**
 * @description 烟花爆炸的质点
 */
class Particle {
  public x: number;
  public y: number;
  public angle: number;
  public friction: number;
  public gravity: number;
  public hue: number;
  public brightness: number;
  public decay: number;
  public speed: number;
  public trail: [number, number][];
  public trailLength: number;
  public transparency: number;
  public context: CanvasRenderingContext2D;
  // Creates a new particle at provided 'x' and 'y' coordinates.
  constructor(x: number, y: number, options: { hue: number; context: CanvasRenderingContext2D }) {
    this.context = options.context;
    this.hue = options.hue;
    // Set current position.
    this.x = x;
    this.y = y;
    // To better simulate a firework, set the angle of travel to random value in any direction.
    this.angle = random(0, Math.PI * 2);
    // Set friction.
    this.friction = PARTICLE_FRICTION;
    // Set gravity.
    this.gravity = PARTICLE_GRAVITY;
    // Set brightness.
    this.brightness = random(PARTICLE_BRIGHTNESS_MIN, PARTICLE_BRIGHTNESS_MAX);
    // Set decay.
    this.decay = random(PARTICLE_DECAY_MIN, PARTICLE_DECAY_MAX);
    // Set speed.
    this.speed = random(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX);
    // Create an array to track current trail particles.
    this.trail = [];
    // Trail length determines how many trailing particles are active at once.
    this.trailLength = PARTICLE_TRAIL_LENGTH;
    // While the trail length remains, add current point to trail list.
    // eslint-disable-next-line no-plusplus
    while (this.trailLength--) {
      this.trail.push([this.x, this.y]);
    }
    // Set transparency.
    this.transparency = PARTICLE_TRANSPARENCY;
  }
  // Update a particle prototype.
  public update = (onDestroyed: () => void) => {
    // Remove the oldest trail particle.
    this.trail.pop();
    // Add the current position to the start of trail.
    this.trail.unshift([this.x, this.y]);

    // Decrease speed based on friction rate.
    this.speed *= this.friction;
    // Calculate current position based on angle, speed, and gravity (for y-axis only).
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed + this.gravity;

    // Apply transparency based on decay.
    this.transparency -= this.decay;
    // Use decay rate to determine if particle should be destroyed.
    if (this.transparency <= this.decay) {
      // Destroy particle once transparency level is below decay.
      onDestroyed?.();
    }
  };
  // Draw a particle.
  // Use CanvasRenderingContext2D methods to create strokes as particle paths.
  public draw = () => {
    // Begin a new path for particle trail.
    this.context.beginPath();
    // Get the coordinates for the oldest trail position.
    const trailEndX = this.trail[this.trail.length - 1][0];
    const trailEndY = this.trail[this.trail.length - 1][1];
    // Create a trail stroke from trail end position to current particle position.
    this.context.moveTo(trailEndX, trailEndY);
    this.context.lineTo(this.x, this.y);
    // Set stroke coloration and style.
    // Use hue, brightness, and transparency instead of RGBA.
    this.context.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.transparency})`;
    this.context.stroke();
  };
}

/**
 * @describtion 一个烟花对象
 */
class Firework {
  public hue: number = 120;
  public context!: CanvasRenderingContext2D;
  // Firework and particles collections.
  public particles: Particle[] = [];
  public count: number = 20;
  public x: number = 0;
  public y: number = 0;
  constructor(options: { context: CanvasRenderingContext2D; x: number; y: number }) {
    const { context, x, y } = options;
    this.hue = random(HUE_MIN, HUE_MAX);
    this.context = context;
    this.x = x;
    this.y = y;
    this.createParticles();
  }

  // Update all active particles.
  public update(onDestroyed: () => void) {
    // Loop backwards through all particles, drawing and updating each.
    if (this.particles.length === 0) {
      // destroy the firework when all the particles is over
      onDestroyed?.();
      return;
    }
    for (let i = this.particles.length - 1; i >= 0; --i) {
      this.particles[i].draw();
      this.particles[i].update(() => {
        this.particles.splice(i, 1);
      });
    }
  }

  // create particles
  public createParticles() {
    // Set particle count.
    // Higher numbers may reduce performance.
    let particleCount = PARTICLE_COUNT;
    while (particleCount--) {
      // Create a new particle and add it to particles collection.
      this.particles.push(new Particle(this.x, this.y, { hue: this.hue, context: this.context }));
    }
  }
}

/**
 * @description 此代码由这里 https://codepen.io/GabeStah/pen/BZxJmy 改造而成
 * @description 效果类似于流星，逻辑不算复杂，也有对应注释
 * @example
 *  const firework = new Fireworks({ id: 'fireworks' });
 *  firework.run();
 *  firework.cancel();
 * */
export default class Fireworks {
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  // Firework and particles collections.
  public fireworks: Firework[] = [];
  // Track number of ticks since automated firework.
  public ticksSinceFireworkAutomated: number = 0;
  // Track number of ticks since manual firework.
  public ticksSinceFirework: number = 0;
  // firework state
  public state: 'initial' | 'running' | 'canceled' = 'initial';
  // raf timer
  public timer: any = undefined;
  public count: number = 20;

  constructor(options: { id: string; count?: number }) {
    this.init(options);
  }

  init(options: { id: string; count?: number }) {
    const { id, count = 20 } = options;
    if (document.getElementById(id)) {
      this.canvas = document.getElementById(id) as HTMLCanvasElement;
      // Set the context, 2d in this case.
      this.context = this.canvas.getContext('2d')!;
      // Track when mouse is pressed.
      this.count = count;
      this.canvas.addEventListener('click', (e) => {
        e.preventDefault();
        // const endX = e.pageX - this.canvas.offsetLeft;
        // const endY = e.pageY - this.canvas.offsetTop;
        const endX = e.clientX - this.canvas.offsetLeft;
        const endY = e.clientY - this.canvas.offsetTop;
        this.createFirework({ x: endX, y: endY });
      });
    }
  }

  public createFirework(coordinate?: { x: number; y: number }) {
    // create one firework
    let endX = random(0, this.canvas.width);
    let endY = random(0, this.canvas.height / 2);
    if (coordinate) {
      const { x, y } = coordinate || {};
      endX = x;
      endY = y;
    }
    const firework = new Firework({ context: this.context, x: endX, y: endY });
    this.fireworks.push(firework);
  }

  public updateFireworks() {
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      this.fireworks[i].update(() => {
        this.fireworks.splice(i, 1);
      });
    }
  }

  public run = () => {
    if (!this.canvas) {
      this.state = 'canceled';
      return;
    }
    this.state = 'running';
    this.cleanCanvas();
    this.updateFireworks();
    this.launchAutomatedFirework();
    // Smoothly request animation frame for each loop iteration.
    this.timer = RAF(this.run);
  };

  // Cleans up the canvas by removing older trails.
  // In order to smoothly transition trails off the canvas, and to make them
  // appear more realistic, we're using a composite fill.
  // Set the initial composite mode to 'destination-out' to keep content that
  // overlap with the fill we're adding.
  // see: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  public cleanCanvas() {
    // Set 'destination-out' composite mode, so additional fill doesn't remove non-overlapping content.
    this.context.globalCompositeOperation = 'destination-out';
    // Set alpha level of content to remove.
    // Lower value means trails remain on screen longer.
    this.context.fillStyle = `rgba(0, 0, 0, ${CANVAS_CLEANUP_ALPHA})`;
    // Fill entire canvas.
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // Reset composite mode to 'lighter', so overlapping particles brighten each other.
    this.context.globalCompositeOperation = 'lighter';
  }

  // Launch fireworks automatically.
  public launchAutomatedFirework() {
    // Determine if ticks since last automated launch is greater than random min/max values.
    // 过几个事件循环再随机生成烟花，这样更符合放烟花的行为
    if (
      this.ticksSinceFireworkAutomated >=
      random(TICKS_PER_FIREWORK_AUTOMATED_MIN, TICKS_PER_FIREWORK_AUTOMATED_MAX)
    ) {
      // this.createFirework();
      this.createFirework();
      // Reset tick counter.
      this.ticksSinceFireworkAutomated = 0;
    } else {
      // Increment counter.
      this.ticksSinceFireworkAutomated += 1;
    }
  }

  public cancel() {
    if (this.timer) {
      cancelRAF(this.timer);
      this.timer = undefined;
      this.state = 'canceled';
    }
  }
}
