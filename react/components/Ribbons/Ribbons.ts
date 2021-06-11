/* eslint-disable max-classes-per-file */

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

class Ribbon {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  public img: HTMLImageElement;
  public size!: number; // size
  public minSize: number = 30;
  public maxSize: number = 30;
  public x!: number;
  public y!: number;
  public alpha!: number;
  public xSpeed!: number; // 移動 x
  public ySpeed!: number; // 移動 y
  public gravity!: number;
  public angle!: number;
  public rad!: number;
  // 自转方向
  public rotateDirection!: 0 | 1; // ratate 正負
  // 方向 左右
  public moveDirection!: 0 | 1;

  constructor(options: { canvas: HTMLCanvasElement; url: string }) {
    const { canvas, url } = options;
    this.img = new Image();
    this.img.src = url;
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d')!;
    this.init();
  }
  public init() {
    this.size = Math.round(random(this.minSize, this.maxSize)); // size
    this.x = Math.round(random(-this.maxSize * 2, this.canvas.width + this.maxSize));
    this.y = Math.round(random(-this.maxSize, -this.canvas.height));
    this.alpha = random(0.6, 1);
    this.xSpeed = random(0.2, 0.6); // 移動 x
    this.ySpeed = random(1, 1.5); // 移動 y
    this.gravity = random(0, 0.005);
    this.angle = 0;
    this.rad = 0;
    // 自转方向
    this.rotateDirection = Math.round(random(0, 1)) as 0 | 1;
    // 方向 左右
    this.moveDirection = Math.round(random(0, 1)) as 0 | 1;
  }
  public update() {
    // 垂直降落
    this.ySpeed += this.gravity;
    this.y += this.ySpeed;
    // 左右摇摆
    if (this.moveDirection === 0) {
      this.x += this.xSpeed;
      if (this.x > this.canvas.width + 100) {
        this.moveDirection = 1;
      }
    } else {
      this.x -= this.xSpeed;
      if (this.x < -50) {
        this.moveDirection = 0;
      }
    }

    if (this.y > this.canvas.height) {
      // 落地之后重新初始化
      this.init();
    }
    this.rad = (this.angle * Math.PI) / 180;
    this.context.save();
    const cx = this.x + this.size / 2;
    const cy = this.y + this.size / 2;
    this.context.globalAlpha = this.alpha;
    // a  水平缩放
    // b  垂直倾斜
    // c  水平倾斜
    // d  垂直缩放
    // e  水平移动
    // f  垂直移动
    this.context.setTransform(
      Math.cos(this.rad),
      Math.sin(this.rad),
      -Math.sin(this.rad),
      Math.cos(this.rad),
      cx - cx * Math.cos(this.rad) + cy * Math.sin(this.rad),
      cy - cx * Math.sin(this.rad) - cy * Math.cos(this.rad),
    );
    this.context.drawImage(this.img, this.x, this.y, this.size, this.size);
    this.context.restore();
    // // 自转，需要可以开启，如树叶就需要自转效果
    // var _angle = random(0.5, 1.5);
    // // this.angle += _angle;
    // if (this.rotateDirection == 0) {
    // 	this.angle += _angle;
    // 	if (this.angle > 130) {
    // 		this.rotateDirection = 1;
    // 	}
    // } else {
    // 	this.angle -= _angle;
    // 	if (this.angle < -130) {
    // 		this.rotateDirection = 0;
    // 	}
    // }
  }
}

/**
 * @describtion 彩带下落
 * @example
 * const ribbons = new Ribbons({ id: 'ribbons' });
 * ribbons.run();
 * ribbons.cancel();
 */
export default class Ribbons {
  public canvas!: HTMLCanvasElement;
  public context!: CanvasRenderingContext2D;
  public ribbons: Ribbon[] = [];
  public count: number = 20;
  public timer: any = undefined;
  public state: 'initial' | 'running' | 'canceled' = 'initial';
  public images: string[] = [
    // "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTDt7oOJ-EjmLx7rdlC0uMmVK8_7_8os6w8_Q&usqp=CAU";
    'https://pic.stackoverflow.wiki/uploadImages/183/236/81/89/2021/05/28/19/29/054bbac7-e9f0-4280-b80f-27c29471ba57.svg',
    'https://pic.stackoverflow.wiki/uploadImages/183/236/81/89/2021/05/28/19/29/b420e71b-39af-4270-88be-b879b08dc270.svg',
    'https://pic.stackoverflow.wiki/uploadImages/183/236/81/89/2021/05/28/19/29/a80fffec-85ce-4e67-8cea-cf6657c70c94.svg',
  ];
  constructor(options: { id: string }) {
    const { id } = options;
    if (document.getElementById(id)) {
      this.canvas = document.getElementById(id) as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d')!;
      this.createRibbons();
    }
  }

  public createRibbons() {
    Array.from({ length: this.count }).forEach(() => {
      const url = this.images[Math.floor(random(0, this.images.length - 0.1))];
      this.ribbons.push(new Ribbon({ canvas: this.canvas, url }));
    });
  }

  public updateRibbons() {
    for (let i = 0; i < this.ribbons.length; i += 1) {
      this.ribbons[i].update();
    }
  }

  public cleanCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public run = () => {
    if (!this.canvas) {
      this.state = 'canceled';
      return;
    }
    this.state = 'running';
    this.cleanCanvas();
    this.updateRibbons();
    this.timer = RAF(this.run);
  };

  public cancel() {
    if (this.timer) {
      cancelRAF(this.timer);
      this.timer = undefined;
      this.state = 'canceled';
    }
  }
}
