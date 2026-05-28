import { TouchableOpacity, View, Text, StyleSheet } from 'react-native'
import { C, F } from '@/constants/theme'

type Props = {
  icon: string
  name: string
  desc?: string
  badge?: string
  badgeColor?: string
  selected?: boolean
  onPress: () => void
}

export function MenuItem({ icon, name, desc, badge, badgeColor = C.teal2, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[s.row, selected && s.sel]}
      activeOpacity={0.8}
    >
      <Text style={s.cursor}>{selected ? '▶' : ' '}</Text>
      <Text style={s.icon}>{icon}</Text>
      <View style={s.body}>
        <Text style={s.name}>{name}</Text>
        {desc && <Text style={s.desc}>{desc}</Text>}
      </View>
      {badge && (
        <Text style={[s.badge, { color: badgeColor, borderColor: badgeColor }]}>
          {badge}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.panel,
    borderWidth: 1,
    borderColor: C.border2,
    padding: 10,
    marginBottom: 4,
  },
  sel: {
    backgroundColor: C.sel,
    borderColor: C.border,
  },
  cursor: {
    fontFamily: F,
    fontSize: 8,
    color: C.gold2,
    width: 10,
  },
  icon: {
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  body: { flex: 1 },
  name: {
    fontFamily: F,
    fontSize: 7,
    color: C.text,
    marginBottom: 2,
  },
  desc: {
    fontFamily: F,
    fontSize: 5,
    color: C.text3,
  },
  badge: {
    fontFamily: F,
    fontSize: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
  },
})