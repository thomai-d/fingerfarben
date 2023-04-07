import { Subscription } from 'rxjs';
import { Point } from '../../components/utilities/shapes';
import { LayeredDrawable } from './layeredDrawable';
import { Message, whenMessageReceived } from '../messageBus';

export class DrawingCanvas {
  private subs: Subscription[] = [];

  private color: string = 'white';

  constructor(private layers: LayeredDrawable) {
    this.subs.push(whenMessageReceived.subscribe((msg) => this.onMessage(msg)));
  }

  destroy() {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  drawLine(start: Point, end: Point): void {
    this.layers.getLayer('layer1').drawLine(this.color, start, end);
  }

  drawPoint(point: Point): void {
    this.layers.getLayer('layer1').drawPoint(this.color, point);
  }

  private onMessage(msg: Message): void {
    switch (msg.type) {
      case 'color-changed':
        this.color = msg.color;
        break;
    }
  }
}
