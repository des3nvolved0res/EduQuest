import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { C, F } from '@/constants/theme'

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
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>

      {/* Janela título */}
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.backTxt}>◀ VOLTAR</Text>
            </TouchableOpacity>
          </View>
          <View style={s.titleBody}>
            <Text style={s.portalName}>{nomePortal[portal] ?? 'PORTAL'}</Text>
            <Text style={s.selectTxt}>SELECIONE A DISCIPLINA</Text>
          </View>
        </View>
      </View>

      {/* Contador ciclos */}
      {portal === 'ciclos' && (
        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.counterRow}>
              <Text style={s.counterIcon}>⏳</Text>
              <View style={s.counterInfo}>
                <Text style={s.counterTitle}>
                  {dias === 1 ? 'FALTA 1 DIA PARA O FIM DO CICLO!' : `FALTAM ${dias} DIAS PARA O FIM DO CICLO`}
                </Text>
                <Text style={s.counterSub}>Pontos temporarios expiram no fim do mes</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Lista de matérias */}
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>DISCIPLINAS</Text>
          </View>
          {materias.map((m, i) => (
            <TouchableOpacity
              key={m.id}
              style={[s.menuRow, sel === i && s.menuRowSel]}
              onPress={() => {
                setSel(i)
                router.push(`/topicos?portal=${portal}&materia=${m.id}`)
              }}
              activeOpacity={0.8}
            >
              <Text style={s.menuCursor}>{sel === i ? '▶' : ' '}</Text>
              <Text style={s.menuIcon}>{m.icon}</Text>
              <View style={s.menuBody}>
                <Text style={s.menuName}>{m.nome}</Text>
              </View>
              <View style={[s.xpBadge, { borderColor: m.cor }]}>
                <Text style={[s.xpTxt, { color: m.cor }]}>0 XP</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

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
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: 7, color: C.blue2, letterSpacing: 1 },
  backTxt: { fontFamily: F, fontSize: 6, color: C.text3 },

  titleBody: { padding: 10 },
  portalName: { fontFamily: F, fontSize: 8, color: C.gold2, marginBottom: 6 },
  selectTxt: { fontFamily: F, fontSize: 6, color: C.text3 },

  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
  },
  counterIcon: { fontSize: 20 },
  counterInfo: { flex: 1 },
  counterTitle: { fontFamily: F, fontSize: 6, color: C.gold2, marginBottom: 4 },
  counterSub: { fontFamily: F, fontSize: 5, color: C.text3 },

  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.panel,
    borderBottomWidth: 1,
    borderBottomColor: C.border2,
    padding: 10,
  },
  menuRowSel: { backgroundColor: C.sel, borderBottomColor: C.border },
  menuCursor: { fontFamily: F, fontSize: 8, color: C.gold2, width: 10 },
  menuIcon: { fontSize: 14, width: 20, textAlign: 'center' },
  menuBody: { flex: 1 },
  menuName: { fontFamily: F, fontSize: 7, color: C.text },
  xpBadge: {
    borderWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  xpTxt: { fontFamily: F, fontSize: 5 },
})