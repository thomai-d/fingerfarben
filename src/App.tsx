import { useState } from 'react'
import './App.css'
import { ColorSelection } from './components/ColorSelection'
import { ResizableCanvas } from './components/ResizableCanvas'

export default () => {
  const [color, setColor] = useState('white')
  return (
    <>
      <ColorSelection onSelectColor={setColor} />
      <ResizableCanvas color={color} />
    </>
  )
}
