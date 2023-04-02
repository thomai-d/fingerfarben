import { memo, useEffect, useRef } from "react"
import { useResizeObserver } from "../hooks/useResizeObserver"
import { Canvas } from './Canvas'
import { LineFactory } from "./utilities/LineFactory"

type Props = {
  color: string
}

export const ResizableCanvas = memo(({ color }: Props) => {

  const divRef = useRef<HTMLDivElement>(null)
  const canvasElementCommitedRef = useRef<HTMLCanvasElement>(null)
  const canvasElementStagingRef = useRef<HTMLCanvasElement>(null)

  const lineFactory = useRef(new LineFactory())

  const commitedCanvasRef = useRef<Canvas | null>(null)
  const stagingCanvasRef = useRef<Canvas | null>(null)

  useEffect(() => {
    if (!divRef.current || !canvasElementCommitedRef.current || !canvasElementStagingRef.current) {
      return;
    }

    // Setup drawing canvas abstractions.
    const commitedCanvas = new Canvas(canvasElementCommitedRef.current)
    const stagingCanvas = new Canvas(canvasElementStagingRef.current)
    commitedCanvasRef.current = commitedCanvas
    stagingCanvasRef.current = stagingCanvas

    // Setup line factory
    const canvasCapture = canvasElementCommitedRef.current
    lineFactory.current.pointTranslateFn = p => ({ x: p.x - canvasCapture.offsetLeft, y: p.y - canvasCapture.offsetTop })
    lineFactory.current.onEmitPoint = p => stagingCanvas.drawPoint(p)
    lineFactory.current.onEmitLine = (p, q) => stagingCanvas.drawLine(p, q)

    return () => { commitedCanvas.destroy() }

  }, [divRef])

  useEffect(() => {
    if (!commitedCanvasRef.current) {
      console.warn("Can't set color :(")
      return;
    }

    // todo: make this a domain event

    commitedCanvasRef.current?.setColor(color)
  }, [color])

  useResizeObserver(divRef, (w, h) => {
    if (!commitedCanvasRef.current || !stagingCanvasRef.current) {
      console.warn("Can't resize canvas. It's not there...?!?!")
      return;
    }

    commitedCanvasRef.current.resize(w, h)
    stagingCanvasRef.current.resize(w, h)
  })

  return (
    <div ref={divRef} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
    >
      <canvas
        style={{ position: 'absolute' }}
        ref={canvasElementCommitedRef}
      />

      <canvas
        style={{ position: 'absolute' }}
        ref={canvasElementStagingRef}
        onMouseDown={e => lineFactory.current.onMouseDown(e)}
        onMouseMove={e => lineFactory.current.onMouseMove(e)}
        onMouseUp={e => lineFactory.current.onMouseUp()}
        onTouchStart={e => lineFactory.current.onTouchStart(e)}
        onTouchMove={e => lineFactory.current.onTouchMove(e)}
        onTouchEnd={e => lineFactory.current.onTouchEnd(e)}
      />

    </div>
  )
})