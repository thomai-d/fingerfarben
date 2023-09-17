import { memo, useEffect, useRef } from "react"
import { useResizeObserver } from "../hooks/use-resize-observer"
import { LineFactory } from "./utilities/line-factory"
import { publishMessage } from '../domain/message-bus'
import { MultiLayerCanvas } from './multi-layer-canvas'
import { DrawingCanvas } from '../domain/canvas/drawing-canvas'

type Props = {
}

export const ResizableCanvas = memo(({ }: Props) => {

  const containerRef = useRef<HTMLDivElement>(null)

  const lineFactory = useRef(new LineFactory())

  useEffect(() => {
    if (!containerRef.current)
      return;

    // Setup multi-layer-canvas
    const container = containerRef.current!
    const canvas = new MultiLayerCanvas(container)
    const drawing = new DrawingCanvas(canvas)
    
    // Setup line factory
    lineFactory.current.pointTranslateFn = p => ({ x: p.x - container.offsetLeft, y: p.y - container.offsetTop })
    lineFactory.current.onEmitPoint = p => drawing.drawPoint(p)
    lineFactory.current.onEmitLine = (p, q) => drawing.drawLine(p, q)

    return () => {
      canvas.destroy()
      drawing.destroy()
    }

  }, [containerRef])

  useResizeObserver(containerRef, (width, height) => {
    publishMessage({ type: 'canvas-resized', width, height})
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

    </div>
  )
})