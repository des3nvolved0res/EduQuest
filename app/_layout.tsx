import { Stack } from 'expo-router'
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p'
import { View, ActivityIndicator } from 'react-native'

export default function RootLayout() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular })

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#4488ff" />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/cadastro" />
      <Stack.Screen name="(aluno)/index" />
      <Stack.Screen name="(professor)/index" />
      <Stack.Screen name="materias" />
      <Stack.Screen name="topicos" />
      <Stack.Screen name="pilulas" />
      <Stack.Screen name="quest" />
      <Stack.Screen name="loja" />
      <Stack.Screen name="perfil" />
      <Stack.Screen name="validar" />
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="missoes" />
    </Stack>
  )
}