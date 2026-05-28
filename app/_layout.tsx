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

  return <Stack screenOptions={{ headerShown: false }} />
}