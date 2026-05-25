import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type Props = {
  titulo: string
  cor: string
  onPress: () => void
}

export default function BotaoQuest({ titulo, cor, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[estilos.botao, { backgroundColor: cor }]}
      onPress={onPress}
    >
      <Text style={estilos.texto}>{titulo}</Text>
    </TouchableOpacity>
  )
}

const estilos = StyleSheet.create({
  botao: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  texto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
})
