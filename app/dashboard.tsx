import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { C, F } from '@/constants/theme'

type Aluno = {
  id: string
  nome: string
  pontosPermanentes: number
  pontosTemporarios: number
  nivel: number
  perfil: string
}

export default function DashboardScreen() {
  const router = useRouter()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [carregando, setCarregando] = useState(true)
  const [totalVouchers, setTotalVouchers] = useState(0)
  const [vouchersValidados, setVouchersValidados] = useState(0)

  useEffect(() => {
    async function carregar() {
      try {
        const snapUsuarios = await getDocs(collection(db, 'usuarios'))
        const lista: Aluno[] = []
        snapUsuarios.forEach((doc) => {
          const d = doc.data()
          if (d.perfil === 'aluno') lista.push({ id: doc.id, ...d } as Aluno)
        })
        lista.sort((a, b) => b.pontosPermanentes - a.pontosPermanentes)
        setAlunos(lista)

        const snapVouchers = await getDocs(collection(db, 'vouchers'))
        setTotalVouchers(snapVouchers.size)
        setVouchersValidados(snapVouchers.docs.filter(d => d.data().validado).length)
      } catch (e) {
        console.log('Erro:', e)
      }
      setCarregando(false)
    }
    carregar()
  }, [])

  const totalXP = alunos.reduce((acc, a) => acc + a.pontosPermanentes, 0)
  const mediaXP = alunos.length > 0 ? Math.round(totalXP / alunos.length) : 0

  function medalha(i: number) {
    if (i === 0) return '🥇'
    if (i === 1) return '🥈'
    if (i === 2) return '🥉'
    return String(i + 1).padStart(2, '0')
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
            <Text style={s.winTitleTxt}>📊 RANKING DA TURMA</Text>
          </View>
        </View>
      </View>

      {/* Stats gerais */}
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>ESTATISTICAS GERAIS</Text>
          </View>
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: C.blue2 }]}>{alunos.length}</Text>
              <Text style={s.statLbl}>ALUNOS</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: C.gold2 }]}>{mediaXP}</Text>
              <Text style={s.statLbl}>XP MEDIO</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: C.green2 }]}>{vouchersValidados}/{totalVouchers}</Text>
              <Text style={s.statLbl}>VOUCHERS</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Ranking */}
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>TOP AVENTUREIROS</Text>
            <Text style={[s.winTitleTxt, { color: C.text3 }]}>{alunos.length} CADASTRADOS</Text>
          </View>

          {carregando ? (
            <View style={s.vazioBody}>
              <Text style={s.vazioTxt}>CARREGANDO...</Text>
            </View>
          ) : alunos.length === 0 ? (
            <View style={s.vazioBody}>
              <Text style={s.vazioEmoji}>📭</Text>
              <Text style={s.vazioTxt}>NENHUM ALUNO CADASTRADO</Text>
            </View>
          ) : (
            alunos.map((aluno, i) => (
              <View
                key={aluno.id}
                style={[s.rankRow, i === 0 && { borderBottomColor: C.gold }]}
              >
                <Text style={[s.rankPos, i < 3 && { fontSize: 14 }]}>
                  {medalha(i)}
                </Text>
                <View style={s.rankInfo}>
                  <Text style={s.rankNome}>{aluno.nome.toUpperCase()}</Text>
                  <View style={s.rankBarWrap}>
                    <View style={s.rankBarTrack}>
                      <View style={[s.rankBarFill, {
                        width: `${Math.min((aluno.pontosPermanentes / 500) * 100, 100)}%` as any,
                        backgroundColor: i === 0 ? C.gold : i === 1 ? C.text2 : C.blue,
                      }]} />
                    </View>
                    <Text style={[s.rankXP, {
                      color: i === 0 ? C.gold2 : i === 1 ? C.text2 : C.blue2
                    }]}>
                      {aluno.pontosPermanentes}XP
                    </Text>
                  </View>
                </View>
                <View style={s.nivelBadge}>
                  <Text style={s.nivelTxt}>NV{aluno.nivel}</Text>
                </View>
              </View>
            ))
          )}
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
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 5, paddingHorizontal: 8,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: 7, color: C.blue2, letterSpacing: 1 },
  backTxt: { fontFamily: F, fontSize: 6, color: C.text3 },

  statsRow: { flexDirection: 'row', padding: 8, gap: 6 },
  statBox: {
    flex: 1, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border2,
    padding: 10, alignItems: 'center',
  },
  statVal: { fontFamily: F, fontSize: 14, marginBottom: 4 },
  statLbl: { fontFamily: F, fontSize: 5, color: C.text3 },

  rankRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 10,
    borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  rankPos: {
    fontFamily: F, fontSize: 7,
    color: C.text3, width: 24, textAlign: 'center',
  },
  rankInfo: { flex: 1 },
  rankNome: { fontFamily: F, fontSize: 7, color: C.text, marginBottom: 4 },
  rankBarWrap: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rankBarTrack: {
    flex: 1, height: 5,
    backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border2,
    overflow: 'hidden',
  },
  rankBarFill: { height: '100%' },
  rankXP: { fontFamily: F, fontSize: 6, minWidth: 40, textAlign: 'right' },
  nivelBadge: {
    backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border2,
    paddingHorizontal: 6, paddingVertical: 3,
  },
  nivelTxt: { fontFamily: F, fontSize: 5, color: C.blue2 },

  vazioBody: { padding: 20, alignItems: 'center' as const },
  vazioEmoji: { fontSize: 32, marginBottom: 10 },
  vazioTxt: { fontFamily: F, fontSize: 7, color: C.text3 },
})