import { View, Text, StyleSheet } from 'react-native'
import { C, F } from '@/constants/theme'

type Props = {
  title?: string
  children: React.ReactNode
  style?: object
}

export function Window({ title, children, style }: Props) {
  return (
    <View style={[s.outer, style]}>
      <View style={s.inner}>
        {title && (
          <View style={s.titleBar}>
            <Text style={s.titleText}>{title}</Text>
          </View>
        )}
        {children}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  outer: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
    marginBottom: 2,
  },
  inner: {
    borderWidth: 1,
    borderColor: C.border2,
    margin: 2,
  },
  titleBar: {
    backgroundColor: C.panel,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  titleText: {
    fontFamily: F,
    fontSize: 7,
    color: C.blue2,
    letterSpacing: 1,
  },
})