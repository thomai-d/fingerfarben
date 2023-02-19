import { TouchEvent, MouseEvent } from "react"

export class Canvas {

  private context: CanvasRenderingContext2D

  private lastMouseEvent: MouseEvent | null = null

  private touches: Map<number, { id: number, x: number, y: number }> = new Map()
  private color: string = 'red'

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!
    console.debug("Initialized canvas")
  }

  setColor(color: string) {
    this.color = color
  }

  resize(width: number, height: number) {
    console.debug(`Resizing canvas to ${width}x${height}`)

    let temp = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
    this.canvas.width = width
    this.canvas.height = height
    this.context.putImageData(temp, 0, 0)

    this.context.fillStyle = 'white'
  }

  onMouseDown = (event: MouseEvent) => {
    this.lastMouseEvent = event
  }

  onMouseMove = (event: MouseEvent) => {
    if (!this.lastMouseEvent)
      return

    this.drawLine(this.toRelativeXY(this.lastMouseEvent), this.toRelativeXY(event))
    this.lastMouseEvent = event
  }

  onMouseUp = (event: MouseEvent) => {
    this.lastMouseEvent = null
  }

  drawLine = (start: { x: number, y: number }, end: { x: number, y: number }) => {
    this.context.lineWidth = 8
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.strokeStyle = this.color;
    this.context.stroke();

    this.context.beginPath();
    this.context.ellipse(end.x, end.y, 4, 4, 0, 0, 2 * Math.PI)
    this.context.fillStyle = this.color;
    this.context.fill();
  };

  onTouchStart = (event: TouchEvent) => {
    const newTouches = Array.from(event.changedTouches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    newTouches.forEach(touch => {
      this.touches.set(touch.id, touch);
    });
  };

  onTouchMove = (event: TouchEvent) => {
    const updatedTouches = Array.from(event.changedTouches).map(touch => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
    }));
    updatedTouches.forEach(updatedTouch => {
      const previousTouch = this.touches.get(updatedTouch.id);
      if (previousTouch) {
        this.drawLine(this.touchToXy(previousTouch), this.touchToXy(updatedTouch));
      }
      this.touches.set(updatedTouch.id, updatedTouch);
    });
  };

  onTouchEnd = (event: TouchEvent) => {
    const endedTouches = Array.from(event.changedTouches).map(touch => touch.identifier);
    endedTouches.forEach(id => {
      this.touches.delete(id);
    });
  };

  private toRelativeXY(e: { pageX: number, pageY: number }) {
    return {
      x: e.pageX - this.canvas.offsetLeft,
      y: e.pageY - this.canvas.offsetTop
    }
  }

  private touchToXy(e: { x: number, y: number }) {
    return {
      x: e.x - this.canvas.offsetLeft,
      y: e.y - this.canvas.offsetTop
    }
  }
}