import { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'

export default function Index() {
  const router = useRouter()
  const [opacity] = useState(new Animated.Value(0))

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()

    const unsub = onAuthStateChanged(auth, (usuario) => {
      setTimeout(() => {
        if (usuario) {
          router.replace('/(aluno)')
        } else {
          router.replace('/(auth)/login')
        }
      }, 1500)
    })

    return () => unsub()
  }, [])

  return (
    <View style={s.container}>
      <Animated.View style={{ opacity }}>
        <Text style={s.logo}>EduQuest</Text>
        <Text style={s.sub}>Inicie sua jornada</Text>
        <View style={s.dotsRow}>
          <View style={s.dot} />
          <View style={[s.dot, s.dotMedio]} />
          <View style={s.dot} />
        </View>
      </Animated.View>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
  },
  sub: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 48,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
  },
  dotMedio: {
    backgroundColor: '#4A90E2',
    width: 24,
  },
})