import { memo, useEffect, useRef } from "react"
import { useResizeObserver } from "../hooks/useResizeObserver"
import { Canvas } from './Canvas'

type Props = {
  color: string
}

export const ResizableCanvas = memo(({ color }: Props) => {
  const divRef = useRef<HTMLDivElement>(null)
  const canvasElemRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = useRef<Canvas | null>(null)

  useEffect(() => {
    if (!divRef.current || !canvasElemRef.current) {
      return;
    }

    const canvas = new Canvas(canvasElemRef.current)
    canvasRef.current = canvas

    return () => { canvas.destroy() }

  }, [divRef])

  useEffect(() => {
    if (!canvasRef.current) {
      console.warn("Can't set color :(")
      return;
    }

    canvasRef.current?.setColor(color)
  }, [color])

  useResizeObserver(divRef, (w, h) => {
    if (!canvasRef.current) {
      console.warn("Can't resize canvas. It's not there...?!?!")
      return;
    }

    canvasRef.current.resize(w, h)
  })

  return (
    <div ref={divRef} style={{ flex: 1, overflow: 'hidden' }}>
      <canvas
        ref={canvasElemRef}
        onMouseDown={e => canvasRef.current?.onMouseDown(e)}
        onMouseMove={e => canvasRef.current?.onMouseMove(e)}
        onMouseUp={e => canvasRef.current?.onMouseUp(e)}
        onTouchStart={e => canvasRef.current?.onTouchStart(e)}
        onTouchMove={e => canvasRef.current?.onTouchMove(e)}
        onTouchEnd={e => canvasRef.current?.onTouchEnd(e)}
      />
    </div>
  )
})