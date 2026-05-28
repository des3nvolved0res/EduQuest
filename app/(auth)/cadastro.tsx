import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { useRouter } from 'expo-router'
import { C, F, FS, PAD } from '@/constants/theme'

export default function CadastroScreen() {
  const [perfil, setPerfil] = useState<'aluno' | 'professor'>('aluno')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()

  async function cadastrar() {
    if (!nome || !email || !senha) {
      Alert.alert('ERRO', 'Preencha todos os campos.')
      return
    }
    if (senha.length < 6) {
      Alert.alert('ERRO', 'Senha deve ter pelo menos 6 caracteres.')
      return
    }
    setCarregando(true)
    try {
      const credencial = await createUserWithEmailAndPassword(auth, email, senha)
      const uid = credencial.user.uid
      await setDoc(doc(db, 'usuarios', uid), {
        nome, email, perfil,
        pontosPermanentes: 0,
        pontosTemporarios: 0,
        nivel: 1,
        criadoEm: new Date().toISOString(),
      })
      Alert.alert('SUCESSO!', 'Conta criada com sucesso!', [
        { text: 'ENTRAR', onPress: () => router.replace('/(auth)/login') }
      ])
    } catch (e: any) {
      if (e.code === 'auth/email-already-in-use') {
        Alert.alert('ERRO', 'Este e-mail ja esta cadastrado.')
      } else {
        Alert.alert('ERRO', 'Nao foi possivel criar a conta.')
      }
    }
    setCarregando(false)
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.backTxt}>◀ VOLTAR</Text>
            </TouchableOpacity>
            <Text style={s.winTitleTxt}>NOVO HEROI</Text>
          </View>
          <View style={s.logoWrap}>
            <Text style={s.logo}>EDUQUEST</Text>
            <Text style={s.logoSub}>REGISTRAR CONTA</Text>
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
            <Text style={s.winTitleTxt}>DADOS DO HEROI</Text>
          </View>
          <View style={s.formBody}>
            <Text style={s.label}>NOME COMPLETO</Text>
            <TextInput
              style={s.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome..."
              placeholderTextColor={C.text3}
            />
            <Text style={s.label}>E-MAIL</Text>
            <TextInput
              style={s.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={C.text3}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={s.label}>SENHA (MIN. 6 CARACTERES)</Text>
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
          <TouchableOpacity
            style={s.btnBlue}
            onPress={cadastrar}
            disabled={carregando}
            activeOpacity={0.8}
          >
            <Text style={s.btnBlueTxt}>
              {carregando ? 'CRIANDO CONTA...' : '▶ CRIAR CONTA'}
            </Text>
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
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  logoWrap: { alignItems: 'center', padding: 20 },
  logo: { fontFamily: F, fontSize: FS.logo, color: C.blue2, letterSpacing: 3, marginBottom: 8 },
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
    margin: 10,
  },
  btnBlueTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },
})