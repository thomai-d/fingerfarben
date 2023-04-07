import { Subject } from 'rxjs';

export type CanvasResized = {
  type: 'canvas-resized';
  width: number;
  height: number;
};

export type ColorChanged = {
  type: 'color-changed';
  color: string;
};

export type Message = CanvasResized | ColorChanged;

const messageSubject = new Subject<Message>();

export const publishMessage = (msg: Message) => messageSubject.next(msg);

export const whenMessageReceived = messageSubject.asObservable();
