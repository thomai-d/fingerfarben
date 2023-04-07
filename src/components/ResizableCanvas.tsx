import { memo, useEffect, useRef } from "react"
import { useResizeObserver } from "../hooks/useResizeObserver"
import { Canvas } from './Canvas'
import { LineFactory } from "./utilities/LineFactory"

type Props = {
  color: string
}

export const ResizableCanvas = memo(({ color }: Props) => {

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasElementCommitedRef = useRef<HTMLCanvasElement>(null)
  const canvasElementStagingRef = useRef<HTMLCanvasElement>(null)

  const lineFactory = useRef(new LineFactory())

  const commitedCanvasRef = useRef<Canvas | null>(null)
  const stagingCanvasRef = useRef<Canvas | null>(null)

  useEffect(() => {
    if (!containerRef.current || !canvasElementCommitedRef.current || !canvasElementStagingRef.current) {
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

  }, [containerRef])

  useEffect(() => {
    if (!commitedCanvasRef.current) {
      console.warn("Can't set color :(")
      return;
    }

    // todo: make this a domain event

    commitedCanvasRef.current?.setColor(color)
    stagingCanvasRef.current?.setColor(color)
  }, [color])

  useResizeObserver(containerRef, (w, h) => {
    if (!commitedCanvasRef.current || !stagingCanvasRef.current) {
      console.warn("Can't resize canvas. It's not there...?!?!")
      return;
    }

    commitedCanvasRef.current.resize(w, h)
    stagingCanvasRef.current.resize(w, h)
  })

  return (
    <div ref={containerRef} style={{ flex: 1, overflow: 'hidden', position: 'relative' }}
      onPointerDown={e => {
        if (e.pointerType !== 'mouse') return
        containerRef.current!.setPointerCapture(e.pointerId)
        lineFactory.current.onMouseDown(e)
      }}
      onPointerMove={e => {
        lineFactory.current.onMouseMove(e)
      }}
      onPointerUp={e => {
        containerRef.current!.releasePointerCapture(e.pointerId)
        lineFactory.current.onMouseUp()
      }}

      onTouchStart={e => lineFactory.current.onTouchStart(e)}
      onTouchMove={e => lineFactory.current.onTouchMove(e)}
      onTouchEnd={e => lineFactory.current.onTouchEnd(e)}
    >
      <canvas
        style={{ position: 'absolute' }}
        ref={canvasElementCommitedRef}
      />

      <canvas
        style={{ position: 'absolute' }}
        ref={canvasElementStagingRef}
      />

    </div>
  )
})