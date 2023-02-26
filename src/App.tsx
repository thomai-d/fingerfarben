import { useState } from 'react'
import './App.css'
import { ColorSelection } from './components/ColorSelection'
import { FullScreenButton } from './components/FullScreenButton'
import { ResizableCanvas } from './components/ResizableCanvas'
import { newPage } from './domain/commands'

export default () => {
  const [color, setColor] = useState('white')
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <ColorSelection onSelectColor={setColor} />

        <FullScreenButton />
        <button style={{ width: '80px', height: '80px', margin: '3px', border: '1px solid white' }} onClick={() => newPage()}>NEU</button>
      </div>

      <ResizableCanvas color={color} />
    </>
  )
}
