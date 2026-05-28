import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'
import { useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      const unsub = onAuthStateChanged(auth, (usuario) => {
        if (usuario) {
          router.replace('/(aluno)/')
        } else {
          router.replace('/(auth)/login')
        }
      })
      return () => unsub()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#4488ff" />
    </View>
  )
}