import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function NotFound() {
  const router = useRouter();

  return (
    <View style={s.container}>
      <Text style={s.txt}>...</Text>
      <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
        <Text style={s.btn}>VOLTAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  txt: {
    color: "#4488ff",
    fontFamily: "PressStart2P_400Regular",
    fontSize: 8,
    marginBottom: 20,
  },
  btn: { color: "#4488ff", fontFamily: "PressStart2P_400Regular", fontSize: 8 },
});
