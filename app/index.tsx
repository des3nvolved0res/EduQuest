import { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useRouter, Redirect } from 'expo-router'
import { C, F } from '@/constants/theme'

export default function Index() {
  const opacidade = useRef(new Animated.Value(0)).current
  const router = useRouter()

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacidade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(opacidade, { toValue: 0.2, duration: 400, useNativeDriver: true }),
      ])
    ).start()

    const timer = setTimeout(() => {
      router.replace('/(auth)/login')
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={s.root}>
      <Animated.Text style={[s.logo, { opacity: opacidade }]}>
        EDUQUEST
      </Animated.Text>
      <Text style={s.sub}>RPG DO CONHECIMENTO</Text>
    </View>
  )
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontFamily: F,
    fontSize: 20,
    color: C.blue2,
    letterSpacing: 3,
  },
  sub: {
    fontFamily: F,
    fontSize: 7,
    color: C.text3,
    letterSpacing: 2,
  },
})