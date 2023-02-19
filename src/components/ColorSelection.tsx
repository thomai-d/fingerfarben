type Props = {
  onSelectColor: (color: string) => void
}

export const ColorSelection = ({ onSelectColor }: Props) => {

  const colors = ['red', 'green', 'blue', 'violet', 'white', 'brown', 'black']

  return (
    <div>
      {colors.map(color => (
        <button key={color} style={{ backgroundColor: color, width: '80px', height: '80px', margin: '3px' }} onClick={() => onSelectColor(color)}></button>
      ))}
    </div>
  )

}