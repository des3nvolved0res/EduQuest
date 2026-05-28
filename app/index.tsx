import { auth } from "@/config/firebase";
import { C } from "@/constants/theme";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function Index() {
  const [status, setStatus] = useState("conectando...");
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        setStatus("logado");
        router.replace("/(aluno)/");
      } else {
        setStatus("nao logado");
        router.replace("/(auth)/login");
      }
    });
    return () => unsub();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: C.bg,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      <ActivityIndicator color={C.blue} />
      <Text
        style={{
          color: C.blue2,
          fontFamily: "PressStart2P_400Regular",
          fontSize: 8,
        }}
      >
        {status}
      </Text>
    </View>
  );
}
