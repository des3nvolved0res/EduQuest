import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { View, ActivityIndicator } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'

export default function RootLayout() {
  const [verificando, setVerificando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        router.replace('/aluno')
      } else {
        router.replace('/(auth)/login')
      }
      setVerificando(false)
    })
    return () => unsub()
  }, [])

  if (verificando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#4488ff" />
      </View>
    )
  }

  return <Stack screenOptions={{ headerShown: false }} />
}