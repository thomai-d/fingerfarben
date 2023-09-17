import { Subscription } from 'rxjs';
import { Message, whenMessageReceived } from '../domain/message-bus';
import { Canvas } from './canvas';
import { LayeredDrawable } from '../domain/canvas/layered-drawable';

export class MultiLayerCanvas implements LayeredDrawable {
  private layers: Record<string, Canvas> = {};
  private subs: Subscription[] = [];

  constructor(private container: HTMLDivElement) {
    this.addLayer('layer1');
    this.addLayer('layer2');

    this.subs.push(whenMessageReceived.subscribe((msg) => this.onMessage(msg)));
  }

  getLayer(name: string) {
    const layer = this.layers[name];
    return layer;
  }

  destroy() {
    for (const [name, layer] of Object.entries(this.layers)) {
      layer.destroy();
      this.container.removeChild(layer.getCanvasRef());
    }
  }

  private addLayer(name: string) {
    const canvas = document.createElement('canvas');
    canvas.id = `layer-${name}`;
    canvas.width = 0;
    canvas.height = 0;
    canvas.style.position = 'absolute';
    this.container.appendChild(canvas);

    const layer = new Canvas(canvas);
    this.layers[name] = layer;
  }

  private onMessage(msg: Message): void {
    switch (msg.type) {
      case 'canvas-resized':
        for (const [name, layer] of Object.entries(this.layers)) {
          layer.resize(msg.width, msg.height);
        }
    }
  }
}
