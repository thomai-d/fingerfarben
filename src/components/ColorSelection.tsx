import { ColorButton } from './ColorButton'

type Props = {
  onSelectColor: (color: string) => void
}

type Color = { text: string, value: string }

export const ColorSelection = ({ onSelectColor }: Props) => {

  const colors = [
    { text: 'Rot', value: 'red' },
    { text: 'Gelb', value: 'yellow' },
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
        <ColorButton key={color.value} fillColor={color.value} radius={50} strokeWidth={2} strokeColor={color.value}
          onSelect={() => onSelect(color)} />
      ))}
    </div>
  )

}