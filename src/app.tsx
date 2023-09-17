import './app.css'
import { ColorSelection } from './apps/paint/components/color-selection'
import { FullScreenButton } from './apps/paint/components/full-screen-button'
import { ResizableCanvas } from './apps/paint/components/resizable-canvas'
import { newPage } from './apps/paint/domain/commands'
import { publishMessage } from './apps/paint/domain/message-bus'

export default () => {
  return (
    <>
      <div className="menu">


        <div className="container">
          <ColorSelection onSelectColor={color => publishMessage({ type: 'color-changed', color })} />
        </div>

        <div className="container">
          <FullScreenButton />
          <button style={{ width: '80px', height: '80px', margin: '3px', border: '1px solid white' }} onClick={() => newPage()}>NEU</button>
        </div>
      </div>

      <ResizableCanvas />
    </>
  )
}
