import { TouchEvent, MouseEvent } from 'react';
import { Point, PointWithId } from './shapes';

/**
 * Tracks mouse and touch events and abstracts points & lines.
 */
export class LineFactory {
  private lastMouseEvent: MouseEvent | null = null;

  private touches: Map<number, PointWithId> = new Map();

  onEmitPoint?: (p: Point) => void;
  onEmitLine?: (from: Point, to: Point) => void;

  pointTranslateFn: (p: Point) => Point = (p) => p;
  touchTranslateFn: (p: Point) => Point = (p) => p;

  onMouseDown = (event: MouseEvent) => {
    this.lastMouseEvent = event;

    const point = this.mouseToXy(event);

    if (this.onEmitPoint) this.onEmitPoint(point);
  };

  onMouseMove = (event: MouseEvent) => {
    if (!this.lastMouseEvent) return;

    if (this.onEmitLine) this.onEmitLine(this.mouseToXy(this.lastMouseEvent), this.mouseToXy(event));

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
      if (this.onEmitPoint) this.onEmitPoint(point);
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
        if (this.onEmitLine) this.onEmitLine(this.touchToXy(previousTouch), this.touchToXy(updatedTouch));
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

  private mouseToXy(e: MouseEvent) {
    const point = {
      x: e.pageX,
      y: e.pageY,
    };

    return this.pointTranslateFn(point);
  }

  private touchToXy(e: { x: number; y: number }) {
    const point = {
      x: e.x,
      y: e.y,
    };
    return this.pointTranslateFn(point);
  }
}
