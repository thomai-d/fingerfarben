import { TouchEvent, useEffect, useRef } from 'react'
import { useResizeObserver } from '../hooks/useResizeObserver'

export const Canvas = () => {

  const canvas = useRef<HTMLCanvasElement>(null)
  const container = useRef<HTMLDivElement>(null)
  const context = useRef<CanvasRenderingContext2D | null>(null)

  const {width, height} = useResizeObserver(container)

  useEffect(() => {
    if (!canvas.current)
      return;

    const ctx = canvas.current.getContext('2d')!
    ctx.fillStyle = 'white'
    context.current = ctx
  })

  const onStart = (e: TouchEvent) => {
    const ctx = context.current!
    for (let i = 0; i < e.targetTouches.length; i++) {
      const touch = e.targetTouches.item(i)
      ctx.fillRect(touch.clientX - 10, touch.clientY - 10, 20, 20)
    }
  }
  const onMove = (e: TouchEvent) => {
    const ctx = context.current!
    for (let i = 0; i < e.targetTouches.length; i++) {
      const touch = e.targetTouches.item(i)
      ctx.fillRect(touch.clientX - 10, touch.clientY - 10, 20, 20)
    }
  }
  const onEnd = () => {
  }
  
  console.log(width, height)

  return (
    <div id="container" ref={container} onTouchStart={onStart} onTouchMove={onMove}>
      <canvas ref={canvas} width={width} height={height} />
    </div>
  )
}