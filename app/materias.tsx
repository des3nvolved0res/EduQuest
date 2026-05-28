import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
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

function calcularDiasRestantes() {
  const agora = new Date()
  const fimDoMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0)
  return Math.ceil((fimDoMes.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24))
}

export default function MateriasScreen() {
  const router = useRouter()
  const { portal } = useLocalSearchParams<{ portal: string }>()
  const [sel, setSel] = useState(0)
  const dias = calcularDiasRestantes()

  return (
    <View style={s.root}>
      <ScrollView style={s.scroll} contentContainerStyle={s.container} showsVerticalScrollIndicator={false}>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={s.backTxt}>◀ VOLTAR</Text>
              </TouchableOpacity>
              <Text style={s.winTitleTxt}>{nomePortal[portal] ?? 'PORTAL'}</Text>
            </View>
            <View style={s.titleBody}>
              <Text style={s.titleSub}>SELECIONE A DISCIPLINA</Text>
            </View>
          </View>
        </View>

        {portal === 'ciclos' && (
          <View style={s.win}>
            <View style={s.winInner}>
              <View style={s.counterRow}>
                <Text style={s.counterIcon}>⏳</Text>
                <View style={s.counterInfo}>
                  <Text style={s.counterTitle}>
                    {dias === 1 ? 'FALTA 1 DIA PARA O FIM DO CICLO!' : `FALTAM ${dias} DIAS`}
                  </Text>
                  <Text style={s.counterSub}>Pontos temporarios expiram no fim do mes</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>DISCIPLINAS</Text>
              <Text style={s.winTitleSub}>{materias.length} DISPONIVEIS</Text>
            </View>
            {materias.map((m, i) => (
              <TouchableOpacity
                key={m.id}
                style={[s.menuRow, sel === i && s.menuRowSel]}
                onPress={() => { setSel(i); router.push(`/topicos?portal=${portal}&materia=${m.id}`) }}
                activeOpacity={0.8}
              >
                <Text style={s.menuCursor}>{sel === i ? '▶' : ' '}</Text>
                <Text style={s.menuIcon}>{m.icon}</Text>
                <Text style={s.menuName}>{m.nome}</Text>
                <View style={[s.xpBadge, { borderColor: m.cor }]}>
                  <Text style={[s.xpTxt, { color: m.cor }]}>0 XP</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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

  titleBody: { padding: PAD.win },
  titleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  counterRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 12, padding: PAD.win,
  },
  counterIcon: { fontSize: 24 },
  counterInfo: { flex: 1 },
  counterTitle: { fontFamily: F, fontSize: FS.small, color: C.gold2, marginBottom: 5 },
  counterSub: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },

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
  xpBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3 },
  xpTxt: { fontFamily: F, fontSize: FS.tiny },
})