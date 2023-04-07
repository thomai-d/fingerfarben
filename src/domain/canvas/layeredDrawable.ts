import { Drawable } from './drawable';

export interface LayeredDrawable {
  getLayer(name: string): Drawable;
}
