import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { C, F, FS, PAD } from '@/constants/theme'

const topicosPorMateria: Record<string, { id: string; titulo: string; descricao: string }[]> = {
  matematica: [
    { id: 'trigonometria', titulo: 'TRIGONOMETRIA',   descricao: 'Seno, cosseno e tangente' },
    { id: 'funcoes',       titulo: 'FUNCOES',          descricao: 'Funcoes do 1 e 2 grau' },
    { id: 'geometria',     titulo: 'GEOMETRIA',        descricao: 'Areas e volumes' },
    { id: 'estatistica',   titulo: 'ESTATISTICA',      descricao: 'Media, moda e mediana' },
    { id: 'probabilidade', titulo: 'PROBABILIDADE',    descricao: 'Eventos e combinacoes' },
  ],
  portugues: [
    { id: 'interpretacao', titulo: 'INTERPRETACAO',    descricao: 'Leitura e analise' },
    { id: 'gramatica',     titulo: 'GRAMATICA',        descricao: 'Classes e funcoes' },
    { id: 'redacao',       titulo: 'REDACAO',          descricao: 'Dissertacao e argumentacao' },
    { id: 'literatura',    titulo: 'LITERATURA',       descricao: 'Movimentos literarios' },
  ],
  biologia: [
    { id: 'celula',        titulo: 'CELULA',           descricao: 'Estrutura e funcoes' },
    { id: 'genetica',      titulo: 'GENETICA',         descricao: 'Hereditariedade e DNA' },
    { id: 'ecologia',      titulo: 'ECOLOGIA',         descricao: 'Ecossistemas e cadeias' },
    { id: 'evolucao',      titulo: 'EVOLUCAO',         descricao: 'Darwin e selecao natural' },
  ],
  historia: [
    { id: 'brasil-colonial',  titulo: 'BRASIL COLONIAL',  descricao: 'Colonizacao e resistencia' },
    { id: 'revolucoes',       titulo: 'REVOLUCOES',        descricao: 'Francesa, Industrial e Russa' },
    { id: 'guerra-mundial',   titulo: 'GUERRAS MUNDIAIS',  descricao: 'I e II Guerra Mundial' },
    { id: 'brasil-republica', titulo: 'BRASIL REPUBLICA',  descricao: 'Da proclamacao ao presente' },
  ],
  geografia: [
    { id: 'climatologia', titulo: 'CLIMATOLOGIA',     descricao: 'Climas e fenomenos' },
    { id: 'geopolitica',  titulo: 'GEOPOLITICA',      descricao: 'Relacoes entre paises' },
    { id: 'urbanizacao',  titulo: 'URBANIZACAO',      descricao: 'Cidades e crescimento' },
    { id: 'relevo',       titulo: 'RELEVO',           descricao: 'Formacoes e processos' },
  ],
  fisica: [
    { id: 'mecanica',      titulo: 'MECANICA',        descricao: 'Movimento e forcas' },
    { id: 'termodinamica', titulo: 'TERMODINAMICA',   descricao: 'Calor e temperatura' },
    { id: 'optica',        titulo: 'OPTICA',          descricao: 'Luz e reflexao' },
    { id: 'eletricidade',  titulo: 'ELETRICIDADE',    descricao: 'Circuitos e corrente' },
  ],
  quimica: [
    { id: 'atomistica', titulo: 'ATOMISTICA',         descricao: 'Estrutura do atomo' },
    { id: 'ligacoes',   titulo: 'LIGACOES QUIMICAS',  descricao: 'Ionica e covalente' },
    { id: 'reacoes',    titulo: 'REACOES',            descricao: 'Tipos e balanceamento' },
    { id: 'solucoes',   titulo: 'SOLUCOES',           descricao: 'Concentracao e misturas' },
  ],
  ingles: [
    { id: 'gramatica-en', titulo: 'GRAMMAR',          descricao: 'Tenses and structures' },
    { id: 'vocabulary',   titulo: 'VOCABULARY',       descricao: 'Words and expressions' },
    { id: 'reading',      titulo: 'READING',          descricao: 'Text comprehension' },
    { id: 'writing',      titulo: 'WRITING',          descricao: 'Essays and composition' },
  ],
}

const nomesMateria: Record<string, string> = {
  matematica: '📐 MATEMATICA',
  portugues:  '📝 PORTUGUES',
  biologia:   '🧬 BIOLOGIA',
  historia:   '📜 HISTORIA',
  geografia:  '🌍 GEOGRAFIA',
  fisica:     '⚡ FISICA',
  quimica:    '🧪 QUIMICA',
  ingles:     '🌐 INGLES',
}

export default function TopicosScreen() {
  const router = useRouter()
  const { portal, materia } = useLocalSearchParams<{ portal: string; materia: string }>()
  const topicos = topicosPorMateria[materia] ?? []
  const [sel, setSel] = useState(0)

return (
    <View style={s.root}>
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.backTxt}>◀ VOLTAR</Text>
            </TouchableOpacity>
            <Text style={s.winTitleTxt}>{nomesMateria[materia] ?? materia}</Text>
          </View>
          <View style={s.titleBody}>
            <Text style={s.titleSub}>SELECIONE O TOPICO</Text>
          </View>
        </View>
      </View>

      <View style={[s.win, { flex: 1 }]}>
        <View style={[s.winInner, { flex: 1 }]}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>TOPICOS</Text>
            <Text style={s.winTitleSub}>{topicos.length} DISPONIVEL</Text>
          </View>
          <View style={{ flex: 1 }}>
            {topicos.map((t, i) => (
              <TouchableOpacity
                key={t.id}
                style={[s.menuRow, sel === i && s.menuRowSel, { flex: 1 }]}
                onPress={() => { setSel(i); router.push(`/pilulas?portal=${portal}&materia=${materia}&topico=${t.id}`) }}
                activeOpacity={0.8}
              >
                <Text style={s.menuCursor}>{sel === i ? '▶' : ' '}</Text>
                <View style={s.numBox}>
                  <Text style={s.numTxt}>{String(i + 1).padStart(2, '0')}</Text>
                </View>
                <View style={s.menuBody}>
                  <Text style={s.menuName}>{t.titulo}</Text>
                  <Text style={s.menuDesc}>{t.descricao}</Text>
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
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    paddingHorizontal: PAD.screen,
    minHeight: 72,
  },
  menuRowSel: { backgroundColor: C.sel, borderBottomColor: C.border },
  menuCursor: { fontFamily: F, fontSize: 12, color: C.gold2, width: 16 },
  numBox: {
    width: 32, height: 32, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  numTxt: { fontFamily: F, fontSize: FS.small, color: C.blue2 },
  menuBody: { flex: 1 },
  menuName: { fontFamily: F, fontSize: FS.body, color: C.text, marginBottom: 4 },
  menuDesc: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
})