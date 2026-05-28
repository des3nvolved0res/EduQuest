import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native'
import { C, F } from '@/constants/theme'

type Variant = 'blue' | 'gold' | 'green' | 'ghost'

type Props = {
  label: string
  onPress: () => void
  variant?: Variant
  style?: ViewStyle
}

const variants = {
  blue:  { bg: C.blue,   tl: C.blue2,  br: '#112266', text: '#000' },
  gold:  { bg: C.gold,   tl: C.gold2,  br: '#442200', text: '#000' },
  green: { bg: C.green,  tl: C.green2, br: '#104830', text: '#000' },
  ghost: { bg: '#000',   tl: C.border, br: C.border,  text: C.text3 },
}

export function PixelButton({ label, onPress, variant = 'blue', style }: Props) {
  const v = variants[variant]
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[s.btn, {
        backgroundColor: v.bg,
        borderTopColor: v.tl,
        borderLeftColor: v.tl,
        borderBottomColor: v.br,
        borderRightColor: v.br,
      }, style]}
    >
      <Text style={[s.label, { color: v.text }]}>
        {variant !== 'ghost' ? '▶ ' : ''}{label}
      </Text>
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  btn: {
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontFamily: F,
    fontSize: 7,
    letterSpacing: 1,
  },
})