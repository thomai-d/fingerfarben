type Props = {
  onSelectColor: (color: string) => void
}

type Color = { text: string, value: string }

export const ColorSelection = ({ onSelectColor }: Props) => {

  const colors = [
    { text: 'Rot', value: 'red' },
    { text: 'Grün', value: 'green' },
    { text: 'Blau', value: 'blue' },
    { text: 'Lila', value: '#6C3483' },
    { text: 'Oransch', value: '#FF6400' },
    { text: 'Weiß', value: 'white' },
    { text: 'Braun', value: '#6E2C00' },
    { text: 'Schwarz', value: 'black' },
  ]

  const onSelect = (color: Color) => {
    onSelectColor(color.value)

    const u = new SpeechSynthesisUtterance()
    u.text = color.text
    u.lang = 'de'
    window.speechSynthesis.speak(u)
  }

  return (
    <div>
      {colors.map(color => (
        <button key={color.value} style={{ backgroundColor: color.value, width: '80px', height: '80px', margin: '3px', border: '1px solid white' }} onClick={() => onSelect(color)}></button>
      ))}
    </div>
  )

}