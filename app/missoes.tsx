import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'

const materias = [
  { id: 'matematica', nome: 'MATEMATICA', emoji: '📐' },
  { id: 'portugues',  nome: 'PORTUGUES',  emoji: '📝' },
  { id: 'biologia',   nome: 'BIOLOGIA',   emoji: '🧬' },
  { id: 'historia',   nome: 'HISTORIA',   emoji: '📜' },
  { id: 'geografia',  nome: 'GEOGRAFIA',  emoji: '🌍' },
  { id: 'fisica',     nome: 'FISICA',     emoji: '⚡' },
  { id: 'quimica',    nome: 'QUIMICA',    emoji: '🧪' },
  { id: 'ingles',     nome: 'INGLES',     emoji: '🌐' },
]

type Missao = {
  id: string
  titulo: string
  nomeMateria: string
  emojiMateria: string
  bonusXP: number
  criadoEm: string
}

export default function MissoesScreen() {
  const router = useRouter()
  const [titulo, setTitulo] = useState('')
  const [materiaSel, setMateriaSel] = useState<string | null>(null)
  const [bonusXP, setBonusXP] = useState(20)
  const [missoes, setMissoes] = useState<Missao[]>([])
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    async function carregar() {
      try {
        const snap = await getDocs(collection(db, 'missoes'))
        const lista: Missao[] = []
        snap.forEach(doc => lista.push({ id: doc.id, ...doc.data() } as Missao))
        lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
        setMissoes(lista)
      } catch (e) {
        console.log('Erro:', e)
      }
    }
    carregar()
  }, [])

  async function lancar() {
    if (!titulo.trim()) { Alert.alert('ERRO', 'Digite o titulo da missao.'); return }
    if (!materiaSel) { Alert.alert('ERRO', 'Selecione uma materia.'); return }
    setSalvando(true)
    try {
      const materia = materias.find(m => m.id === materiaSel)
      const nova = {
        titulo: titulo.trim().toUpperCase(),
        materia: materiaSel,
        nomeMateria: materia?.nome,
        emojiMateria: materia?.emoji,
        bonusXP,
        professorId: auth.currentUser?.uid,
        criadoEm: new Date().toISOString(),
      }
      const ref = await addDoc(collection(db, 'missoes'), nova)
      setMissoes(prev => [{ id: ref.id, ...nova } as Missao, ...prev])
      setTitulo('')
      setMateriaSel(null)
      setBonusXP(20)
      Alert.alert('MISSAO LANCADA!', 'Os aventureiros foram notificados.')
    } catch {
      Alert.alert('ERRO', 'Nao foi possivel lancar a missao.')
    }
    setSalvando(false)
  }

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={s.backTxt}>◀ VOLTAR</Text>
              </TouchableOpacity>
              <Text style={s.winTitleTxt}>⚔️ MISSOES ESPECIAIS</Text>
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>TITULO DA MISSAO</Text>
            </View>
            <View style={s.inputBody}>
              <TextInput
                style={s.input}
                value={titulo}
                onChangeText={t => setTitulo(t.toUpperCase())}
                placeholder="EX: EQUACOES DO 2 GRAU"
                placeholderTextColor={C.text3}
                autoCapitalize="characters"
              />
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>MATERIA</Text>
            </View>
            {materias.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[s.menuRow, materiaSel === m.id && s.menuRowSel]}
                onPress={() => setMateriaSel(m.id)}
                activeOpacity={0.8}
              >
                <Text style={s.menuCursor}>{materiaSel === m.id ? '▶' : ' '}</Text>
                <Text style={s.menuIcon}>{m.emoji}</Text>
                <Text style={s.menuName}>{m.nome}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>BONUS DE XP</Text>
            </View>
            <View style={s.qtdRow}>
              <TouchableOpacity
                style={s.qtdBtn}
                onPress={() => setBonusXP(q => Math.max(10, q - 10))}
              >
                <Text style={s.qtdBtnTxt}>−</Text>
              </TouchableOpacity>
              <View style={s.qtdDisplay}>
                <Text style={s.qtdVal}>{bonusXP}</Text>
                <Text style={s.qtdLbl}>XP BONUS</Text>
              </View>
              <TouchableOpacity
                style={s.qtdBtn}
                onPress={() => setBonusXP(q => Math.min(100, q + 10))}
              >
                <Text style={s.qtdBtnTxt}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <TouchableOpacity
              style={[s.btnPurple, salvando && { opacity: 0.6 }]}
              onPress={lancar}
              disabled={salvando}
              activeOpacity={0.8}
            >
              <Text style={s.btnPurpleTxt}>
                {salvando ? 'LANCANDO...' : '⚔️ LANCAR MISSAO'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {missoes.length > 0 && (
          <View style={s.win}>
            <View style={s.winInner}>
              <View style={s.winTitle}>
                <Text style={s.winTitleTxt}>MISSOES ATIVAS</Text>
                <Text style={s.winTitleSub}>{missoes.length} TOTAL</Text>
              </View>
              {missoes.map((m) => (
                <View key={m.id} style={s.missaoRow}>
                  <Text style={s.missaoCursor}>◆</Text>
                  <Text style={s.missaoIcon}>{m.emojiMateria}</Text>
                  <View style={s.missaoInfo}>
                    <Text style={s.missaoTitulo}>{m.titulo}</Text>
                    <Text style={s.missaoMat}>
                      {m.nomeMateria} · {new Date(m.criadoEm).toLocaleDateString('pt-BR')}
                    </Text>
                  </View>
                  <View style={[s.xpBadge, { borderColor: C.purple }]}>
                    <Text style={[s.xpTxt, { color: C.purple2 }]}>+{m.bonusXP}XP</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  container: { padding: PAD.screen, paddingTop: PAD.top, paddingBottom: 32, gap: 8 },

  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 8, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: FS.title, color: C.blue2, letterSpacing: 1 },
  winTitleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  inputBody: { padding: PAD.win },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    padding: 12, color: C.text,
    fontFamily: F, fontSize: FS.body,
    letterSpacing: 1,
  },

  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    padding: PAD.item,
  },
  menuRowSel: { backgroundColor: C.sel, borderBottomColor: C.border },
  menuCursor: { fontFamily: F, fontSize: 12, color: C.gold2, width: 16 },
  menuIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  menuName: { flex: 1, fontFamily: F, fontSize: FS.body, color: C.text },

  qtdRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 28, padding: 18,
  },
  qtdBtn: {
    width: 44, height: 44, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtdBtnTxt: { fontFamily: F, fontSize: 20, color: C.text },
  qtdDisplay: { alignItems: 'center' },
  qtdVal: { fontFamily: F, fontSize: 32, color: C.text },
  qtdLbl: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  btnPurple: {
    backgroundColor: C.purple,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.purple2, borderLeftColor: C.purple2,
    borderBottomColor: '#330066', borderRightColor: '#330066',
    paddingVertical: 16, alignItems: 'center',
    margin: 10,
  },
  btnPurpleTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },

  missaoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: PAD.item,
    borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  missaoCursor: { fontFamily: F, fontSize: 10, color: C.purple2, width: 14 },
  missaoIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  missaoInfo: { flex: 1 },
  missaoTitulo: { fontFamily: F, fontSize: FS.body, color: C.text, marginBottom: 4 },
  missaoMat: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
  xpBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3 },
  xpTxt: { fontFamily: F, fontSize: FS.tiny },
})