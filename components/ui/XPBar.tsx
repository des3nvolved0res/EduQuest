import { View, Text, StyleSheet } from 'react-native'
import { C, F } from '@/constants/theme'

type Props = {
  label: string
  value: number
  max: number
  color?: string
}

export function XPBar({ label, value, max, color = C.blue }: Props) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <View style={s.row}>
      <Text style={s.label}>{label}</Text>
      <View style={s.track}>
        <View style={[s.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[s.val, { color }]}>{value}/{max}</Text>
    </View>
  )
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 5,
  },
  label: {
    fontFamily: F,
    fontSize: 6,
    color: C.text2,
    width: 40,
  },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: '#334',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  val: {
    fontFamily: F,
    fontSize: 6,
    minWidth: 52,
    textAlign: 'right',
  },
})