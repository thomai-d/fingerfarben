import React, { useRef, useEffect, useState } from 'react';

type Touch = {
  id: number;
  x: number;
  y: number;
};

type ColorButtonProps = {
  color: string;
  onClick: () => void;
};

const ColorButton: React.FC<ColorButtonProps> = ({ color, onClick }) => (
  <button
    style={{ backgroundColor: color, width: '70px', height: '70px', borderRadius: '50%', margin: '5px' }}
    onClick={onClick}
  />
);

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const touchesRef = useRef<Map<number, Touch>>(new Map());
  const [color, setColor] = useState('#000000');

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');

    if (canvas && context) {
      const resizeCanvas = () => {
        let temp = context.getImageData(0,0,canvas.width, canvas.height)
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        context.putImageData(temp,0,0)
      };

      const drawLine = (start: Touch, end: Touch) => {
        context.lineWidth = 8
        context.beginPath();
        context.moveTo(start.x, start.y);
        context.lineTo(end.x, end.y);
        context.strokeStyle = color;
        context.stroke();
      };

      const handleTouchStart = (event: TouchEvent) => {
        event.preventDefault();
        const newTouches = Array.from(event.changedTouches).map(touch => ({
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
        }));
        newTouches.forEach(touch => {
          touchesRef.current.set(touch.id, touch);
        });
      };

      const handleTouchMove = (event: TouchEvent) => {
        event.preventDefault();
        const updatedTouches = Array.from(event.changedTouches).map(touch => ({
          id: touch.identifier,
          x: touch.clientX,
          y: touch.clientY,
        }));
        updatedTouches.forEach(updatedTouch => {
          const previousTouch = touchesRef.current.get(updatedTouch.id);
          if (previousTouch) {
            drawLine(previousTouch, updatedTouch);
          }
          touchesRef.current.set(updatedTouch.id, updatedTouch);
        });
      };

      const handleTouchEnd = (event: TouchEvent) => {
        event.preventDefault();
        const endedTouches = Array.from(event.changedTouches).map(touch => touch.identifier);
        endedTouches.forEach(id => {
          touchesRef.current.delete(id);
        });
      };

      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleTouchEnd);
      canvas.addEventListener('touchcancel', handleTouchEnd);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
        canvas.removeEventListener('touchcancel', handleTouchEnd);
      };
    }
  }, [color]);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#C0C0C0', '#808080', '#FFFFFF'];

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />

      <div style={{position: 'absolute', top: 0, left: 0, zIndex: 1}}>
      {colors.map((color, index) => (
        <ColorButton key={index} color={color} onClick={() => handleColorChange(color)} />
      ))}
      </div>
    </>
  )
}
