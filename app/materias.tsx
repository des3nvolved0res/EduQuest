import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { collection, getDocs, doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'

const materias = [
  { id: 'matematica', nome: 'MATEMATICA', icon: '📐', cor: C.blue },
  { id: 'portugues',  nome: 'PORTUGUES',  icon: '📝', cor: C.purple },
  { id: 'biologia',   nome: 'BIOLOGIA',   icon: '🧬', cor: C.green },
  { id: 'historia',   nome: 'HISTORIA',   icon: '📜', cor: C.gold },
  { id: 'geografia',  nome: 'GEOGRAFIA',  icon: '🌍', cor: C.teal },
  { id: 'fisica',     nome: 'FISICA',     icon: '⚡', cor: C.gold2 },
  { id: 'quimica',    nome: 'QUIMICA',    icon: '🧪', cor: C.red },
  { id: 'ingles',     nome: 'INGLES',     icon: '🌐', cor: C.blue2 },
]

const nomePortal: Record<string, string> = {
  reliquias: 'PORTAL DAS RELIQUIAS',
  ciclos:    'PORTAL DOS CICLOS',
  mural:     'MURAL DO MESTRE',
}

type Missao = {
  id: string
  titulo: string
  materia: string
  nomeMateria: string
  emojiMateria: string
  bonusXP: number
  criadoEm: string
}

function calcularDiasRestantes() {
  const agora = new Date()
  const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
  return Math.ceil((fimDoMes.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))
}

export default function MateriasScreen() {
  const router = useRouter()
  const { portal } = useLocalSearchParams<{ portal: string }>()
  const [sel, setSel] = useState(0)
  const [missoes, setMissoes] = useState<Missao[]>([])
  const [carregando, setCarregando] = useState(false)
  const [xpMaterias, setXpMaterias] = useState<Record<string, number>>({})
  const dias = calcularDiasRestantes()

  useEffect(() => {
    if (portal === 'mural') {
      setCarregando(true)
      getDocs(collection(db, 'missoes')).then(snap => {
        const lista: Missao[] = []
        snap.forEach(d => lista.push({ id: d.id, ...d.data() } as Missao))
        lista.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
        setMissoes(lista)
        setCarregando(false)
      }).catch(() => setCarregando(false))
    }
  }, [portal])

  useEffect(() => {
    if (!auth.currentUser) return
    const uid = auth.currentUser.uid
    const unsub = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
      if (snap.exists()) {
        setXpMaterias(snap.data()?.xpMaterias ?? {})
     }
  })
  return () => unsub()
}, [])

  if (portal === 'mural') {
    return (
      <View style={s.root}>
        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={s.backTxt}>◀ VOLTAR</Text>
              </TouchableOpacity>
              <Text style={s.winTitleTxt}>MURAL DO MESTRE</Text>
            </View>
            <View style={s.titleBody}>
              <Text style={s.titleSub}>MISSOES ESPECIAIS DOS PROFESSORES</Text>
            </View>
          </View>
        </View>

        <View style={[s.win, { flex: 1 }]}>
          <View style={[s.winInner, { flex: 1 }]}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>MISSOES ATIVAS</Text>
              <Text style={s.winTitleSub}>{missoes.length} DISPONIVEL</Text>
            </View>
            {carregando ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator color={C.blue} />
              </View>
            ) : missoes.length === 0 ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Text style={{ fontFamily: F, fontSize: FS.body, color: C.text3, textAlign: 'center' }}>
                  NENHUMA MISSAO ATIVA
                </Text>
                <Text style={{ fontFamily: F, fontSize: FS.tiny, color: C.text3, textAlign: 'center', marginTop: 8 }}>
                  Aguarde seu professor lancar uma missao
                </Text>
              </View>
            ) : (
              <View style={{ flex: 1 }}>
                {missoes.map((m, i) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[s.missaoRow, { flex: 1 }]}
                    onPress={() => router.push(`/topicos?portal=mural&materia=${m.materia}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.menuCursor}>▶</Text>
                    <Text style={s.menuIcon}>{m.emojiMateria}</Text>
                    <View style={s.menuBody}>
                      <Text style={s.menuName}>{m.titulo}</Text>
                      <Text style={s.menuDesc}>{m.nomeMateria}</Text>
                    </View>
                    <View style={[s.xpBadge, { borderColor: C.purple }]}>
                      <Text style={[s.xpTxt, { color: C.purple2 }]}>+{m.bonusXP}XP</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={s.root}>
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.backTxt}>◀ VOLTAR</Text>
            </TouchableOpacity>
            <Text style={s.winTitleTxt}>{nomePortal[portal] ?? 'PORTAL'}</Text>
          </View>
          {portal === 'ciclos' && (
            <View style={s.counterRow}>
              <Text style={s.counterIcon}>⏳</Text>
              <View style={s.counterInfo}>
                <Text style={s.counterTitle}>
                  {dias === 1 ? 'FALTA 1 DIA PARA O FIM DO CICLO!' : `FALTAM ${dias} DIAS`}
                </Text>
                <Text style={s.counterSub}>Pontos temporarios expiram no fim do mes</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={[s.win, { flex: 1 }]}>
        <View style={[s.winInner, { flex: 1 }]}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>DISCIPLINAS</Text>
            <Text style={s.winTitleSub}>{materias.length} DISPONIVEIS</Text>
          </View>
          <View style={{ flex: 1 }}>
            {materias.map((m, i) => (
              <TouchableOpacity
                key={m.id}
                style={[s.menuRow, sel === i && s.menuRowSel, { flex: 1 }]}
                onPress={() => { setSel(i); router.push(`/topicos?portal=${portal}&materia=${m.id}`) }}
                activeOpacity={0.8}
              >
                <Text style={s.menuCursor}>{sel === i ? '▶' : ' '}</Text>
                <Text style={s.menuIcon}>{m.icon}</Text>
                <Text style={s.menuName}>{m.nome}</Text>
                <View style={[s.xpBadge, { borderColor: m.cor }]}>
                  <Text style={[s.xpTxt, { color: m.cor }]}>
                    {portal === 'ciclos' ? 'BONUS' : `${xpMaterias[m.id] ?? 0}XP`}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, padding: PAD.screen, paddingTop: PAD.top, gap: 8 },
  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 10, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: FS.title, color: C.blue2, letterSpacing: 1 },
  winTitleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  titleBody: { padding: PAD.win },
  titleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  counterRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: PAD.win,
    borderTopWidth: 1, borderTopColor: C.border2,
  },
  counterIcon: { fontSize: 24 },
  counterInfo: { flex: 1 },
  counterTitle: { fontFamily: F, fontSize: FS.small, color: C.gold2, marginBottom: 5 },
  counterSub: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    paddingHorizontal: PAD.screen,
    minHeight: 60,
  },
  menuRowSel: { backgroundColor: C.sel, borderBottomColor: C.border },
  menuCursor: { fontFamily: F, fontSize: 12, color: C.gold2, width: 16 },
  menuIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  menuBody: { flex: 1 },
  menuName: { flex: 1, fontFamily: F, fontSize: FS.body, color: C.text },
  menuDesc: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
  missaoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    paddingHorizontal: PAD.screen,
    minHeight: 72,
  },
  xpBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3 },
  xpTxt: { fontFamily: F, fontSize: FS.tiny },
})