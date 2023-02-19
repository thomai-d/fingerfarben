import { memo, useEffect, useRef } from "react"
import { useResizeObserver } from "../hooks/useResizeObserver"

class MyCanvas {

  private context: CanvasRenderingContext2D

  constructor(private canvas: HTMLCanvasElement) {
    this.context = canvas.getContext('2d')!
    console.debug("Initialized canvas")
  }

  resize(width: number, height: number) {
    console.debug(`Resizing canvas to ${width}x${height}`)
    this.canvas.width = width
    this.canvas.height = height

    this.context.fillStyle = 'white'
    this.context.fillRect(10, 10, width - 20, height - 20)
  }
}


export const ResizableCanvas = memo(() => {
  const divRef = useRef<HTMLDivElement>(null)
  const canvasElemRef = useRef<HTMLCanvasElement>(null)
  const canvasRef = useRef<MyCanvas | null>(null)

  useEffect(() => {
    if (!divRef.current || !canvasElemRef.current) {
      return;
    }

    canvasRef.current = new MyCanvas(canvasElemRef.current)

  }, [divRef])

  useResizeObserver(divRef, (w, h) => {
    if (!canvasRef.current) {
      console.warn("Can't resize canvas. It's not there...?!?!")
      return;
    }

    canvasRef.current.resize(w, h)
  })

  return (
    <div ref={divRef} style={{ flex: 1, overflow: 'hidden' }}>
      <canvas ref={canvasElemRef} />
    </div>
  )
})