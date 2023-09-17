import { Subject } from 'rxjs';

export type NewCommand = {
  type: 'new';
};

export type Command = NewCommand;

const commandSubject = new Subject<Command>();

export const commands$ = commandSubject.asObservable();

export const newPage = () => commandSubject.next({ type: 'new' });
