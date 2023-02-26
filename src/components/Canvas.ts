import { TouchEvent, MouseEvent } from 'react';
import { Subscription } from 'rxjs';
import { Command, commands$ } from '../domain/commands';
import { say } from '../services/speech';

type Point = {
  x: number,
  y: number
}

type PointWithId = Point & {
  id: number
}

export class Canvas {
  private context: CanvasRenderingContext2D;

  private lastMouseEvent: MouseEvent | null = null;

  private touches: Map<number, PointWithId> = new Map();

  private subs: Subscription[] = [];

  private color: string = 'red';

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

  setColor(color: string) {
    this.color = color;
  }

  resize(width: number, height: number) {
    console.debug(`Resizing canvas to ${width}x${height}`);

    let temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.width = width;
    this.canvas.height = height;
    this.context.putImageData(temp, 0, 0);

    this.context.fillStyle = 'white';
  }

  onMouseDown = (event: MouseEvent) => {
    this.lastMouseEvent = event;

    const point = this.mouseToXy(event);
    this.drawPoint(point.x, point.y);
  };

  onMouseMove = (event: MouseEvent) => {
    if (!this.lastMouseEvent) return;

    this.drawLine(this.mouseToXy(this.lastMouseEvent), this.mouseToXy(event));
    this.lastMouseEvent = event;
  };

  onMouseUp = () => {
    this.lastMouseEvent = null;
  };

  onTouchStart = (event: TouchEvent) => {
    const newTouches = Array.from(event.changedTouches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    newTouches.forEach((touch) => {
      this.touches.set(touch.id, touch);

      const point = this.touchToXy(touch);
      this.drawPoint(point.x, point.y);
    });
  };

  onTouchMove = (event: TouchEvent) => {
    const updatedTouches = Array.from(event.changedTouches).map((touch) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    updatedTouches.forEach((updatedTouch) => {
      const previousTouch = this.touches.get(updatedTouch.id);
      if (previousTouch) {
        this.drawLine(this.touchToXy(previousTouch), this.touchToXy(updatedTouch));
      }
      this.touches.set(updatedTouch.id, updatedTouch);
    });
  };

  onTouchEnd = (event: TouchEvent) => {
    const endedTouches = Array.from(event.changedTouches).map((touch) => touch.identifier);
    endedTouches.forEach((id) => {
      this.touches.delete(id);
    });
  };

  private drawLine = (start: Point, end: Point) => {
    this.context.lineWidth = 8;
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.strokeStyle = this.color;
    this.context.stroke();

    this.drawPoint(end.x, end.y);
  };

  private drawPoint(x: number, y: number) {
    this.context.fillStyle = this.color;
    this.context.beginPath();
    this.context.ellipse(x, y, this.drawRadius, this.drawRadius, 0, 0, 2 * Math.PI);
    this.context.fill();
  }

  private mouseToXy(e: MouseEvent) {
    return {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop,
    };
  }

  private touchToXy(e: { x: number; y: number }) {
    return {
      x: e.x - this.canvas.offsetLeft,
      y: e.y - this.canvas.offsetTop,
    };
  }

  private handleCommand(cmd: Command) {
    if (cmd.type === 'new') {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      say('Neues Blatt');
    }
  }
}
