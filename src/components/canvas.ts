import { Subscription } from 'rxjs';
import { Command, commands$ } from '../domain/commands';
import { say } from '../services/speech';
import { Point } from './utilities/shapes';
import { Drawable } from '../domain/canvas/drawable';

export class Canvas implements Drawable {
  private context: CanvasRenderingContext2D;

  private subs: Subscription[] = [];

  private drawRadius = 4;

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!;
    console.debug('Initialized canvas');

    this.subs.push(commands$.subscribe((cmd) => this.handleCommand(cmd)));
  }

  destroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.subs = [];
  }

  resize(width: number, height: number) {
    console.debug(`Resizing canvas to ${width}x${height}`);

    const copyNeeded =
      this.canvas.width && this.canvas.height && (this.canvas.width < width || this.canvas.height < height);

    let imageData: ImageData | null = null;

    if (copyNeeded) {
      imageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }

    this.canvas.width = width;
    this.canvas.height = height;

    if (imageData) {
      this.context.putImageData(imageData, 0, 0);
    }

    this.context.fillStyle = 'white';
  }

  drawLine = (color: string, start: Point, end: Point) => {
    this.context.lineWidth = 8;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.strokeStyle = color;
    this.context.stroke();

    this.drawPoint(color, end);
  };

  drawPoint(color: string, { x, y }: Point) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.ellipse(x, y, this.drawRadius, this.drawRadius, 0, 0, 2 * Math.PI);
    this.context.fill();
  }

  getCanvasRef() {
    return this.canvas;
  }

  private handleCommand(cmd: Command) {
    if (cmd.type === 'new') {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      say('Neues Blatt');
    }
  }
}
