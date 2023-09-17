import css from './paint-app.module.css';

import { ColorSelection } from './components/color-selection';
import { FullScreenButton } from './components/full-screen-button';
import { ResizableCanvas } from './components/resizable-canvas';
import { newPage } from './domain/commands';
import { publishMessage } from './domain/message-bus';

export const PaintApp = () => {
  return (
    <>
      <div className={css.menu}>
        <div className={css.container}>
          <ColorSelection onSelectColor={(color) => publishMessage({ type: 'color-changed', color })} />
        </div>

        <div className={css.container}>
          <FullScreenButton />
          <button
            style={{ width: '80px', height: '80px', margin: '3px', border: '1px solid white' }}
            onClick={() => newPage()}
          >
            NEU
          </button>
        </div>
      </div>

      <ResizableCanvas />
    </>
  );
};
