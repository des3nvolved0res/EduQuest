import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from 'firebase/firestore'
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

const cosmeticos = [
  { id: 'titulo_matematica', nome: 'MESTRE DA MATEMATICA', emoji: '📐', custo: 50 },
  { id: 'titulo_biologia',   nome: 'MESTRE DA BIOLOGIA',   emoji: '🧬', custo: 50 },
  { id: 'titulo_historia',   nome: 'MESTRE DA HISTORIA',   emoji: '📜', custo: 50 },
  { id: 'moldura_ouro',      nome: 'MOLDURA DOURADA',      emoji: '🥇', custo: 100 },
  { id: 'moldura_prata',     nome: 'MOLDURA PRATEADA',     emoji: '🥈', custo: 60 },
]

type DadosAluno = {
  pontosPermanentes: number
  pontosTemporarios: number
  cosmeticosDesbloqueados?: string[]
}

export default function LojaScreen() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosAluno | null>(null)
  const [aba, setAba] = useState<'bonus' | 'cosmeticos'>('bonus')
  const [materiaSel, setMateriaSel] = useState<string | null>(null)
  const [tipoPonto, setTipoPonto] = useState<'permanentes' | 'temporarios'>('permanentes')
  const [quantidade, setQuantidade] = useState(10)
  const [modal, setModal] = useState(false)
  const [voucher, setVoucher] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!auth.currentUser) return
    const unsub = onSnapshot(doc(db, 'usuarios', auth.currentUser.uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosAluno)
    })
    return () => unsub()
  }, [])

  const saldo = tipoPonto === 'permanentes'
    ? dados?.pontosPermanentes ?? 0
    : dados?.pontosTemporarios ?? 0

  function gerarCodigo() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let c = 'EQ-'
    for (let i = 0; i < 8; i++) c += chars[Math.floor(Math.random() * chars.length)]
    return c
  }

  async function resgatar() {
    if (!materiaSel) { Alert.alert('ERRO', 'Selecione uma materia.'); return }
    if (quantidade > saldo) { Alert.alert('SALDO INSUFICIENTE', `Voce tem apenas ${saldo} XP.`); return }
    if (quantidade < 10) { Alert.alert('ERRO', 'Minimo para resgate: 10 XP.'); return }
    setSalvando(true)
    try {
      const uid = auth.currentUser!.uid
      const campo = tipoPonto === 'permanentes' ? 'pontosPermanentes' : 'pontosTemporarios'
      const codigo = gerarCodigo()
      const materia = materias.find(m => m.id === materiaSel)
      await updateDoc(doc(db, 'usuarios', uid), { [campo]: increment(-quantidade) })
      await addDoc(collection(db, 'vouchers'), {
        codigo, uid,
        nomeAluno: auth.currentUser?.email,
        materia: materiaSel,
        nomeMateria: materia?.nome,
        xp: quantidade,
        validado: false,
        criadoEm: new Date().toISOString(),
      })
      setVoucher(codigo)
      setModal(true)
    } catch {
      Alert.alert('ERRO', 'Nao foi possivel gerar o voucher.')
    }
    setSalvando(false)
  }

  async function comprar(c: typeof cosmeticos[0]) {
    if ((dados?.pontosPermanentes ?? 0) < c.custo) {
      Alert.alert('SALDO INSUFICIENTE', `Voce precisa de ${c.custo} Cristais.`)
      return
    }
    if (dados?.cosmeticosDesbloqueados?.includes(c.id)) {
      Alert.alert('JA DESBLOQUEADO', 'Voce ja possui este item.')
      return
    }
    Alert.alert('CONFIRMAR', `Comprar "${c.nome}" por ${c.custo} Cristais?`, [
      { text: 'CANCELAR', style: 'cancel' },
      {
        text: 'COMPRAR', onPress: async () => {
          try {
            await updateDoc(doc(db, 'usuarios', auth.currentUser!.uid), {
              pontosPermanentes: increment(-c.custo),
              cosmeticosDesbloqueados: [...(dados?.cosmeticosDesbloqueados ?? []), c.id],
            })
            Alert.alert('DESBLOQUEADO!', `"${c.nome}" adicionado ao perfil!`)
          } catch { Alert.alert('ERRO', 'Nao foi possivel comprar.') }
        }
      }
    ])
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
              <Text style={s.winTitleTxt}>🏪 LOJA</Text>
            </View>
            <View style={s.saldoRow}>
              <View style={s.saldoBox}>
                <Text style={[s.saldoVal, { color: C.green2 }]}>{dados?.pontosPermanentes ?? 0}</Text>
                <Text style={s.saldoLbl}>💎 CRISTAIS</Text>
              </View>
              <View style={s.saldoBox}>
                <Text style={[s.saldoVal, { color: C.purple2 }]}>{dados?.pontosTemporarios ?? 0}</Text>
                <Text style={s.saldoLbl}>⚡ BONUS</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={s.win}>
          <View style={s.winInner}>
            <View style={s.toggle}>
              <TouchableOpacity
                style={[s.toggleBtn, aba === 'bonus' && s.toggleBtnOn]}
                onPress={() => setAba('bonus')}
              >
                <Text style={[s.toggleTxt, aba === 'bonus' && s.toggleTxtOn]}>🎓 BONUS DE NOTA</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.toggleBtn, aba === 'cosmeticos' && s.toggleBtnOn]}
                onPress={() => setAba('cosmeticos')}
              >
                <Text style={[s.toggleTxt, aba === 'cosmeticos' && s.toggleTxtOn]}>✨ COSMETICOS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {aba === 'bonus' && (
          <>
            <View style={s.win}>
              <View style={s.winInner}>
                <View style={s.winTitle}>
                  <Text style={s.winTitleTxt}>TIPO DE PONTOS</Text>
                </View>
                <View style={s.toggle}>
                  <TouchableOpacity
                    style={[s.toggleBtn, tipoPonto === 'permanentes' && s.toggleBtnOn]}
                    onPress={() => setTipoPonto('permanentes')}
                  >
                    <Text style={[s.toggleTxt, tipoPonto === 'permanentes' && s.toggleTxtOn]}>💎 CRISTAIS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.toggleBtn, tipoPonto === 'temporarios' && s.toggleBtnOn]}
                    onPress={() => setTipoPonto('temporarios')}
                  >
                    <Text style={[s.toggleTxt, tipoPonto === 'temporarios' && s.toggleTxtOn]}>⚡ BONUS</Text>
                  </TouchableOpacity>
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
                  <Text style={s.winTitleTxt}>QUANTIDADE</Text>
                  <Text style={s.winTitleSub}>SALDO: {saldo} XP</Text>
                </View>
                <View style={s.qtdRow}>
                  <TouchableOpacity style={s.qtdBtn} onPress={() => setQuantidade(q => Math.max(10, q - 10))}>
                    <Text style={s.qtdBtnTxt}>−</Text>
                  </TouchableOpacity>
                  <View style={s.qtdDisplay}>
                    <Text style={s.qtdVal}>{quantidade}</Text>
                    <Text style={s.qtdLbl}>XP</Text>
                  </View>
                  <TouchableOpacity style={s.qtdBtn} onPress={() => setQuantidade(q => Math.min(saldo, q + 10))}>
                    <Text style={s.qtdBtnTxt}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={s.win}>
              <View style={s.winInner}>
                <TouchableOpacity style={[s.btnGold, salvando && { opacity: 0.6 }]} onPress={resgatar} disabled={salvando} activeOpacity={0.8}>
                  <Text style={s.btnGoldTxt}>{salvando ? 'GERANDO...' : '🎟 GERAR VOUCHER'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {aba === 'cosmeticos' && (
          <View style={s.win}>
            <View style={s.winInner}>
              <View style={s.winTitle}>
                <Text style={s.winTitleTxt}>ITENS DISPONIVEIS</Text>
              </View>
              {cosmeticos.map((c) => {
                const tem = dados?.cosmeticosDesbloqueados?.includes(c.id)
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[s.menuRow, tem && { opacity: 0.5 }]}
                    onPress={() => comprar(c)}
                    activeOpacity={0.8}
                  >
                    <Text style={s.menuCursor}>{tem ? '✓' : '▶'}</Text>
                    <Text style={s.menuIcon}>{c.emoji}</Text>
                    <Text style={s.menuName}>{c.nome}</Text>
                    <View style={[s.xpBadge, { borderColor: tem ? C.green : C.gold }]}>
                      <Text style={[s.xpTxt, { color: tem ? C.green2 : C.gold2 }]}>
                        {tem ? 'SEU' : `${c.custo}XP`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          </View>
        )}

      </ScrollView>

      <Modal visible={modal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <View style={s.winTitle}>
              <Text style={s.winTitleTxt}>🎟 COMPROVANTE GERADO!</Text>
            </View>
            <View style={s.voucherBody}>
              <Text style={s.voucherTag}>CODIGO DE AUTENTICACAO</Text>
              <Text style={s.voucherCode}>{voucher}</Text>
              <Text style={s.voucherInfo}>
                {materias.find(m => m.id === materiaSel)?.emoji}{' '}
                {materias.find(m => m.id === materiaSel)?.nome} · {quantidade} XP
              </Text>
              <Text style={s.voucherSub}>APRESENTE AO PROFESSOR</Text>
            </View>
            <TouchableOpacity
              style={s.btnBlue}
              onPress={() => { setModal(false); setVoucher(null); setMateriaSel(null); setQuantidade(10) }}
              activeOpacity={0.8}
            >
              <Text style={s.btnBlueTxt}>▶ ENTENDIDO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  saldoRow: { flexDirection: 'row', padding: 10, gap: 8 },
  saldoBox: {
    flex: 1, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border2,
    padding: 12, alignItems: 'center',
  },
  saldoVal: { fontFamily: F, fontSize: 18, marginBottom: 5 },
  saldoLbl: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },

  toggle: { flexDirection: 'row' },
  toggleBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', backgroundColor: C.bg },
  toggleBtnOn: { backgroundColor: C.blue },
  toggleTxt: { fontFamily: F, fontSize: FS.small, color: C.text3, letterSpacing: 1 },
  toggleTxtOn: { color: '#000' },

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

  qtdRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 28, padding: 16,
  },
  qtdBtn: {
    width: 40, height: 40, backgroundColor: '#000',
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtdBtnTxt: { fontFamily: F, fontSize: 18, color: C.text },
  qtdDisplay: { alignItems: 'center' },
  qtdVal: { fontFamily: F, fontSize: 28, color: C.text },
  qtdLbl: { fontFamily: F, fontSize: FS.small, color: C.text3 },

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
  btnGold: {
    backgroundColor: C.gold,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.gold2, borderLeftColor: C.gold2,
    borderBottomColor: '#442200', borderRightColor: '#442200',
    paddingVertical: 16, alignItems: 'center',
    margin: 10,
  },
  btnGoldTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  modalCard: {
    width: '100%', backgroundColor: C.panel,
    borderWidth: 1, borderColor: C.gold,
  },
  voucherBody: { padding: 24, alignItems: 'center' },
  voucherTag: { fontFamily: F, fontSize: FS.tiny, color: C.text3, letterSpacing: 2, marginBottom: 12 },
  voucherCode: { fontFamily: F, fontSize: 18, color: C.gold2, letterSpacing: 4, marginBottom: 12 },
  voucherInfo: { fontFamily: F, fontSize: FS.small, color: C.text2, marginBottom: 8 },
  voucherSub: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
})