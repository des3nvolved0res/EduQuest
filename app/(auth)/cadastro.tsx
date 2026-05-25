import { auth, db } from "@/config/firebase";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CadastroScreen() {
  const [perfil, setPerfil] = useState<"aluno" | "professor">("aluno");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  async function cadastrar() {
    if (!nome || !email || !senha) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }
    if (senha.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setCarregando(true);
    try {
      const credencial = await createUserWithEmailAndPassword(
        auth,
        email,
        senha,
      );
      const uid = credencial.user.uid;

      await setDoc(doc(db, "usuarios", uid), {
        nome,
        email,
        perfil,
        pontosPermanentes: 0,
        pontosTemporarios: 0,
        nivel: 1,
        criadoEm: new Date().toISOString(),
      });

      Alert.alert("Sucesso!", "Conta criada com sucesso!", [
        {
          text: "Entrar",
          onPress: () => router.replace("/(auth)/login"),
        },
      ]);
    } catch (e: any) {
      console.log("Erro Firebase:", e.code, e.message);
      if (e.code === "auth/email-already-in-use") {
        Alert.alert("Erro", "Este e-mail já está cadastrado.");
      } else if (e.code === "auth/network-request-failed") {
        Alert.alert("Erro", "Sem conexão com a internet.");
      } else {
        Alert.alert("Erro", e.message);
      }
    }
    setCarregando(false);
  }

  return (
    <ScrollView contentContainerStyle={s.container}>
      <Text style={s.logo}>EduQuest</Text>
      <Text style={s.subtitulo}>Crie sua conta</Text>

      <View style={s.seletor}>
        <TouchableOpacity
          style={[s.btnPerfil, perfil === "aluno" && s.btnPerfilAtivo]}
          onPress={() => setPerfil("aluno")}
        >
          <Text style={[s.txtPerfil, perfil === "aluno" && s.txtPerfilAtivo]}>
            👤 Aluno
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btnPerfil, perfil === "professor" && s.btnPerfilAtivo]}
          onPress={() => setPerfil("professor")}
        >
          <Text
            style={[s.txtPerfil, perfil === "professor" && s.txtPerfilAtivo]}
          >
            📖 Professor
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={s.input}
        placeholder="Nome completo"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={s.input}
        placeholder="E-mail"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={s.input}
        placeholder="Senha (mínimo 6 caracteres)"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity
        style={s.btnCadastrar}
        onPress={cadastrar}
        disabled={carregando}
      >
        <Text style={s.txtBotao}>
          {carregando ? "Criando conta..." : "Criar conta"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={s.linkVoltar}>← Voltar para o login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1A1A2E",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4A90E2",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginBottom: 32,
  },
  seletor: {
    flexDirection: "row",
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  btnPerfil: {
    flex: 1,
    padding: 14,
    alignItems: "center",
    backgroundColor: "#16213E",
  },
  btnPerfilAtivo: {
    backgroundColor: "#4A90E2",
  },
  txtPerfil: {
    color: "#888",
    fontSize: 15,
    fontWeight: "bold",
  },
  txtPerfilAtivo: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#16213E",
    borderRadius: 12,
    padding: 16,
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  btnCadastrar: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  txtBotao: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkVoltar: {
    color: "#4A90E2",
    textAlign: "center",
    fontSize: 15,
  },
});
