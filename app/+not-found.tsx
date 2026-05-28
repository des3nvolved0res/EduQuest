import { useEffect } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/config/firebase'

export default function NotFound() {
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        router.replace('/(aluno)/')
      } else {
        router.replace('/(auth)/login')
      }
    })
    return () => unsub()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator color="#4488ff" />
    </View>
  )
}
