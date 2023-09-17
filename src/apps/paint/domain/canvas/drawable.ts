import { Point } from '../../components/utilities/shapes';

export interface Drawable {
  drawLine(color: string, start: Point, end: Point): void;

  drawPoint(color: string, { x, y }: Point): void;
}
