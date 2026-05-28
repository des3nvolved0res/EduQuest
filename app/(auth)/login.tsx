import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { useRouter } from 'expo-router'
import { C, F, FS, PAD } from '@/constants/theme'

export default function LoginScreen() {
  const [perfil, setPerfil] = useState<'aluno' | 'professor'>('aluno')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

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
      if (perfil === 'aluno') router.replace('/(aluno)/')
      else router.replace('/(professor)/')
    } catch {
      Alert.alert('ERRO', 'Usuario ou senha incorretos.')
    }
    setCarregando(false)
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.logoWrap}>
            <Text style={s.logo}>EDUQUEST</Text>
            <Text style={s.logoSub}>RPG DO CONHECIMENTO v1.0</Text>
          </View>
        </View>
      </View>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>TIPO DE CONTA</Text>
          </View>
          <View style={s.toggle}>
            <TouchableOpacity
              style={[s.toggleBtn, perfil === 'aluno' && s.toggleBtnOn]}
              onPress={() => setPerfil('aluno')}
            >
              <Text style={[s.toggleTxt, perfil === 'aluno' && s.toggleTxtOn]}>★ ALUNO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.toggleBtn, perfil === 'professor' && s.toggleBtnOn]}
              onPress={() => setPerfil('professor')}
            >
              <Text style={[s.toggleTxt, perfil === 'professor' && s.toggleTxtOn]}>◆ PROFESSOR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>CREDENCIAIS</Text>
          </View>
          <View style={s.formBody}>
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
          </View>
        </View>
      </View>

      <View style={s.win}>
        <View style={s.winInner}>
          <TouchableOpacity style={s.btnBlue} onPress={entrar} disabled={carregando} activeOpacity={0.8}>
            <Text style={s.btnBlueTxt}>{carregando ? 'CARREGANDO...' : '▶ ENTRAR'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={() => router.push('/(auth)/cadastro')} activeOpacity={0.8}>
            <Text style={s.btnGhostTxt}>NOVO HEROI: CADASTRAR</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: PAD.screen, paddingTop: 60, gap: 8 },

  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 8, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: FS.title, color: C.blue2, letterSpacing: 1 },

  logoWrap: { alignItems: 'center', padding: 24 },
  logo: { fontFamily: F, fontSize: FS.logo, color: C.blue2, letterSpacing: 3, marginBottom: 10 },
  logoSub: { fontFamily: F, fontSize: FS.tiny, color: C.text3, letterSpacing: 2 },

  toggle: { flexDirection: 'row' },
  toggleBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: C.bg },
  toggleBtnOn: { backgroundColor: C.blue },
  toggleTxt: { fontFamily: F, fontSize: FS.small, color: C.text3, letterSpacing: 1 },
  toggleTxtOn: { color: '#000' },

  formBody: { padding: PAD.win },
  label: { fontFamily: F, fontSize: FS.small, color: C.text2, letterSpacing: 1, marginBottom: 8 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    padding: 12, color: C.text,
    fontFamily: F, fontSize: FS.body,
    marginBottom: 16,
  },

  btnBlue: {
    backgroundColor: C.blue,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.blue2, borderLeftColor: C.blue2,
    borderBottomColor: '#112266', borderRightColor: '#112266',
    paddingVertical: 16, alignItems: 'center',
    margin: 10, marginBottom: 6,
  },
  btnBlueTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },
  btnGhost: {
    paddingVertical: 12, alignItems: 'center',
    margin: 10, marginTop: 0,
    borderWidth: 1, borderColor: C.border2,
  },
  btnGhostTxt: { fontFamily: F, fontSize: FS.small, color: C.text3, letterSpacing: 1 },
})