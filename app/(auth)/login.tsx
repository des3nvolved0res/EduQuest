import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { useRouter } from 'expo-router'
import { C, F } from '@/constants/theme'

export default function LoginScreen() {
  const [perfil, setPerfil] = useState<'aluno' | 'professor'>('aluno')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      if (usuario) router.replace('/(aluno)/')
    })
    return () => unsub()
  }, [])

  async function entrar() {
    if (!email || !senha) {
      Alert.alert('ERRO', 'Preencha usuario e senha.')
      return
    }
    setCarregando(true)
    try {
      const credencial = await signInWithEmailAndPassword(auth, email, senha)
      const uid = credencial.user.uid
      const snap = await getDoc(doc(db, 'usuarios', uid))
      const dados = snap.data()
      if (dados?.perfil !== perfil) {
        Alert.alert('PERFIL INCORRETO', `Essa conta e de ${dados?.perfil}.`)
        setCarregando(false)
        return
      }
      if (perfil === 'aluno') router.replace('/aluno')
      else router.replace('/professor')
    } catch {
      Alert.alert('ERRO', 'Usuario ou senha incorretos.')
    }
    setCarregando(false)
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      {/* Logo */}
      <View style={s.logoWrap}>
        <Text style={s.logo}>EDUQUEST</Text>
        <Text style={s.logoSub}>RPG DO CONHECIMENTO v1.0</Text>
      </View>

      {/* Toggle perfil */}
      <View style={s.toggle}>
        <TouchableOpacity
          style={[s.toggleBtn, perfil === 'aluno' && s.toggleBtnOn]}
          onPress={() => setPerfil('aluno')}
        >
          <Text style={[s.toggleTxt, perfil === 'aluno' && s.toggleTxtOn]}>
            ★ ALUNO
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.toggleBtn, perfil === 'professor' && s.toggleBtnOn]}
          onPress={() => setPerfil('professor')}
        >
          <Text style={[s.toggleTxt, perfil === 'professor' && s.toggleTxtOn]}>
            ◆ PROFESSOR
          </Text>
        </TouchableOpacity>
      </View>

      {/* Campos */}
      <Text style={s.label}>USUARIO</Text>
      <TextInput
        style={s.input}
        value={email}
        onChangeText={setEmail}
        placeholder="seu@email.com"
        placeholderTextColor={C.text3}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={s.label}>SENHA</Text>
      <TextInput
        style={s.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="••••••••"
        placeholderTextColor={C.text3}
        secureTextEntry
      />

      {/* Botão entrar */}
      <TouchableOpacity
        style={s.btnBlue}
        onPress={entrar}
        disabled={carregando}
        activeOpacity={0.8}
      >
        <Text style={s.btnBlueTxt}>
          {carregando ? 'CARREGANDO...' : '▶ ENTRAR'}
        </Text>
      </TouchableOpacity>

      {/* Cadastro */}
      <TouchableOpacity
        style={s.btnGhost}
        onPress={() => router.push('/(auth)/cadastro')}
        activeOpacity={0.8}
      >
        <Text style={s.btnGhostTxt}>NOVO HEROI: CADASTRAR</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: C.bg,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  logoWrap: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
    padding: 20,
    marginBottom: 20,
    backgroundColor: C.panel,
  },
  logo: {
    fontFamily: F,
    fontSize: 20,
    color: C.blue2,
    letterSpacing: 3,
    marginBottom: 8,
  },
  logoSub: {
    fontFamily: F,
    fontSize: 6,
    color: C.text3,
    letterSpacing: 2,
  },
  toggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: C.bg,
  },
  toggleBtnOn: {
    backgroundColor: C.blue,
  },
  toggleTxt: {
    fontFamily: F,
    fontSize: 7,
    color: C.text3,
    letterSpacing: 1,
  },
  toggleTxtOn: {
    color: '#000',
  },
  label: {
    fontFamily: F,
    fontSize: 6,
    color: C.text2,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
    color: C.text,
    fontFamily: F,
    fontSize: 8,
    marginBottom: 14,
  },
  btnBlue: {
    backgroundColor: C.blue,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: C.blue2,
    borderLeftColor: C.blue2,
    borderBottomColor: '#112266',
    borderRightColor: '#112266',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnBlueTxt: {
    fontFamily: F,
    fontSize: 8,
    color: '#000',
    letterSpacing: 1,
  },
  btnGhost: {
    backgroundColor: C.bg,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderTopColor: C.border,
    borderLeftColor: C.border,
    borderBottomColor: C.border2,
    borderRightColor: C.border2,
    paddingVertical: 10,
    alignItems: 'center',
  },
  btnGhostTxt: {
    fontFamily: F,
    fontSize: 6,
    color: C.text3,
    letterSpacing: 1,
  },
})