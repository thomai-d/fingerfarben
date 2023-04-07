import './App.css'
import { ColorSelection } from './components/ColorSelection'
import { FullScreenButton } from './components/FullScreenButton'
import { ResizableCanvas } from './components/ResizableCanvas'
import { newPage } from './domain/commands'
import { publishMessage } from './domain/messageBus'

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
