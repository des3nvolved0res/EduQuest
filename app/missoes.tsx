import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { C, F } from '@/constants/theme'

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
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      {/* Header */}
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

      {/* Título */}
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

      {/* Matéria */}
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

      {/* Bônus XP */}
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

      {/* Botão lançar */}
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

      {/* Missões ativas */}
      {missoes.length > 0 && (
        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>MISSOES ATIVAS</Text>
              <Text style={[s.winTitleTxt, { color: C.text3 }]}>{missoes.length} TOTAL</Text>
            </View>
            {missoes.map((m) => (
              <View key={m.id} style={s.missaoRow}>
                <Text style={s.missaoCursor}>◆</Text>
                <Text style={s.missaoIcon}>{m.emojiMateria}</Text>
                <View style={s.missaoInfo}>
                  <Text style={s.missaoTitulo}>{m.titulo}</Text>
                  <Text style={s.missaoMat}>{m.nomeMateria} · {new Date(m.criadoEm).toLocaleDateString('pt-BR')}</Text>
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
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 12, paddingTop: 48, gap: 4 },

  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 5, paddingHorizontal: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: 7, color: C.blue2, letterSpacing: 1 },
  backTxt: { fontFamily: F, fontSize: 6, color: C.text3 },

  inputBody: { padding: 10 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    padding: 10, color: C.text,
    fontFamily: F, fontSize: 8,
    letterSpacing: 1,
  },

  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    padding: 10,
  },
  menuRowSel: { backgroundColor: C.sel, borderBottomColor: C.border },
  menuCursor: { fontFamily: F, fontSize: 8, color: C.gold2, width: 10 },
  menuIcon: { fontSize: 14, width: 20, textAlign: 'center' },
  menuName: { flex: 1, fontFamily: F, fontSize: 7, color: C.text },

  qtdRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 24, padding: 14,
  },
  qtdBtn: {
    width: 36, height: 36, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtdBtnTxt: { fontFamily: F, fontSize: 14, color: C.text },
  qtdDisplay: { alignItems: 'center' },
  qtdVal: { fontFamily: F, fontSize: 24, color: C.text },
  qtdLbl: { fontFamily: F, fontSize: 6, color: C.text3 },

  btnPurple: {
    backgroundColor: C.purple,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.purple2, borderLeftColor: C.purple2,
    borderBottomColor: '#330066', borderRightColor: '#330066',
    paddingVertical: 14, alignItems: 'center', margin: 8,
  },
  btnPurpleTxt: { fontFamily: F, fontSize: 8, color: '#000', letterSpacing: 1 },

  missaoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 10,
    borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  missaoCursor: { fontFamily: F, fontSize: 8, color: C.purple2, width: 10 },
  missaoIcon: { fontSize: 14, width: 20, textAlign: 'center' },
  missaoInfo: { flex: 1 },
  missaoTitulo: { fontFamily: F, fontSize: 7, color: C.text, marginBottom: 2 },
  missaoMat: { fontFamily: F, fontSize: 5, color: C.text3 },
  xpBadge: { borderWidth: 1, paddingHorizontal: 5, paddingVertical: 2 },
  xpTxt: { fontFamily: F, fontSize: 5 },
})