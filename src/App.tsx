import { useState } from 'react'
import './App.css'
import { ResizableCanvas } from './components/ResizableCanvas'

export default () => {
  const [x, setx] = useState(0)
  return (
    <>
      <button onClick={() => setx(x => x + 1)}>{x}</button>
      <ResizableCanvas />
    </>
  )
}
