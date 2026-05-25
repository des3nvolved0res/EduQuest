import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const [perfil, setPerfil] = useState<'aluno' | 'professor'>('aluno')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.')
      return
    }
    setCarregando(true)
    try {
      const credencial = await signInWithEmailAndPassword(auth, email, senha)
      const uid = credencial.user.uid
      const snap = await getDoc(doc(db, 'usuarios', uid))
      const dados = snap.data()

      if (dados?.perfil !== perfil) {
        Alert.alert('Perfil incorreto', `Essa conta é de ${dados?.perfil}, não de ${perfil}.`)
        setCarregando(false)
        return
      }

      if (perfil === 'aluno') {
        router.replace('/(aluno)')
      } else {
        router.replace('/(professor)')
      }
    } catch (e: any) {
      Alert.alert('Erro', 'E-mail ou senha incorretos.')
    }
    setCarregando(false)
  }

  return (
    <View style={s.container}>
      <Text style={s.logo}>EduQuest</Text>
      <Text style={s.subtitulo}>Inicie sua jornada</Text>

      <View style={s.seletor}>
        <TouchableOpacity
          style={[s.btnPerfil, perfil === 'aluno' && s.btnPerfilAtivo]}
          onPress={() => setPerfil('aluno')}
        >
          <Text style={[s.txtPerfil, perfil === 'aluno' && s.txtPerfilAtivo]}>
            👤 Aluno
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.btnPerfil, perfil === 'professor' && s.btnPerfilAtivo]}
          onPress={() => setPerfil('professor')}
        >
          <Text style={[s.txtPerfil, perfil === 'professor' && s.txtPerfilAtivo]}>
            📖 Professor
          </Text>
        </TouchableOpacity>
      </View>

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
        placeholder="Senha"
        placeholderTextColor="#888"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <TouchableOpacity style={s.btnEntrar} onPress={entrar} disabled={carregando}>
        <Text style={s.txtEntrar}>
          {carregando ? 'Entrando...' : '→ Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
        <Text style={s.linkCadastro}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
    padding: 24,
    justifyContent: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 32,
  },
  seletor: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  btnPerfil: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    backgroundColor: '#16213E',
  },
  btnPerfilAtivo: {
    backgroundColor: '#4A90E2',
  },
  txtPerfil: {
    color: '#888',
    fontSize: 15,
    fontWeight: 'bold',
  },
  txtPerfilAtivo: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#16213E',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  btnEntrar: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  txtEntrar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkCadastro: {
    color: '#4A90E2',
    textAlign: 'center',
    fontSize: 15,
  },
})