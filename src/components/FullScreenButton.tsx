import { useEffect, useState } from "react";

export const FullScreenButton = () => {

  const [isFullscreen, setIsFullscreen] = useState(false);
  useEffect(() => {

    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])


  if (!document.fullscreenEnabled || isFullscreen)
    return null

  const onRequestFullScreen = () => {
    document.body.requestFullscreen({ navigationUI: 'hide' })
  }

  return (
    <button style={{ width: '80px', height: '80px', margin: '3px', border: '1px solid white' }} onClick={() => onRequestFullScreen()}>Groß</button>
  )
}