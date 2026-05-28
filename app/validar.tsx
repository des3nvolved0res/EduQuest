import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'

type Voucher = {
  id: string
  codigo: string
  nomeAluno: string
  nomeMateria: string
  xp: number
  validado: boolean
  criadoEm: string
}

export default function ValidarScreen() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [voucher, setVoucher] = useState<Voucher | null>(null)
  const [buscando, setBuscando] = useState(false)
  const [validando, setValidando] = useState(false)

  async function buscar() {
    if (!codigo.trim()) { Alert.alert('ERRO', 'Digite o codigo do voucher.'); return }
    setBuscando(true)
    try {
      const q = query(collection(db, 'vouchers'), where('codigo', '==', codigo.trim().toUpperCase()))
      const snap = await getDocs(q)
      if (snap.empty) {
        Alert.alert('NAO ENCONTRADO', 'Codigo invalido ou inexistente.')
        setVoucher(null)
      } else {
        const d = snap.docs[0]
        setVoucher({ id: d.id, ...d.data() } as Voucher)
      }
    } catch {
      Alert.alert('ERRO', 'Nao foi possivel buscar o voucher.')
    }
    setBuscando(false)
  }

  async function validar() {
    if (!voucher) return
    if (voucher.validado) { Alert.alert('ATENCAO', 'Este voucher ja foi validado.'); return }
    setValidando(true)
    try {
      await updateDoc(doc(db, 'vouchers', voucher.id), {
        validado: true,
        validadoEm: new Date().toISOString(),
      })
      setVoucher({ ...voucher, validado: true })
      Alert.alert('VALIDADO!', `Bonus de ${voucher.xp} XP em ${voucher.nomeMateria} confirmado para ${voucher.nomeAluno}.`)
    } catch {
      Alert.alert('ERRO', 'Nao foi possivel validar o voucher.')
    }
    setValidando(false)
  }

  return (
    <View style={s.root}>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.backTxt}>◀ VOLTAR</Text>
            </TouchableOpacity>
            <Text style={s.winTitleTxt}>🎟 VALIDAR VOUCHER</Text>
          </View>
          <View style={s.searchBody}>
            <Text style={s.label}>CODIGO DO VOUCHER</Text>
            <TextInput
              style={s.input}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="EX: EQ-ABC12345"
              placeholderTextColor={C.text3}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={s.btnGreen}
              onPress={buscar}
              disabled={buscando}
              activeOpacity={0.8}
            >
              <Text style={s.btnGreenTxt}>{buscando ? 'BUSCANDO...' : '▶ BUSCAR'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[s.win, { flex: 1 }]}>
        <View style={[s.winInner, { flex: 1 }]}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>RESULTADO</Text>
          </View>

          {!voucher ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontFamily: F, fontSize: 32, marginBottom: 14 }}>🔍</Text>
              <Text style={{ fontFamily: F, fontSize: FS.small, color: C.text3, textAlign: 'center' }}>
                AGUARDANDO CODIGO
              </Text>
              <Text style={{ fontFamily: F, fontSize: FS.tiny, color: C.text3, textAlign: 'center', marginTop: 6 }}>
                Digite o codigo apresentado pelo aluno
              </Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <View style={[s.winTitle, { borderBottomColor: voucher.validado ? C.green : C.gold }]}>
                <Text style={[s.winTitleTxt, { color: C.gold2 }]}>{voucher.codigo}</Text>
                {voucher.validado && (
                  <View style={[s.badge, { borderColor: C.green }]}>
                    <Text style={[s.badgeTxt, { color: C.green2 }]}>✓ VALIDADO</Text>
                  </View>
                )}
              </View>
              <View style={[s.statRow, { flex: 1 }]}>
                <Text style={s.statLbl}>ALUNO</Text>
                <Text style={s.statVal}>{voucher.nomeAluno}</Text>
              </View>
              <View style={[s.statRow, { flex: 1 }]}>
                <Text style={s.statLbl}>MATERIA</Text>
                <Text style={s.statVal}>{voucher.nomeMateria}</Text>
              </View>
              <View style={[s.statRow, { flex: 1 }]}>
                <Text style={s.statLbl}>XP CONQUISTADO</Text>
                <Text style={[s.statVal, { color: C.blue2 }]}>{voucher.xp} XP</Text>
              </View>
              <View style={[s.statRow, { flex: 1, borderBottomWidth: 0 }]}>
                <Text style={s.statLbl}>GERADO EM</Text>
                <Text style={s.statVal}>
                  {new Date(voucher.criadoEm).toLocaleDateString('pt-BR')}
                </Text>
              </View>
              {!voucher.validado && (
                <TouchableOpacity
                  style={s.btnGreen}
                  onPress={validar}
                  disabled={validando}
                  activeOpacity={0.8}
                >
                  <Text style={s.btnGreenTxt}>
                    {validando ? 'VALIDANDO...' : '✓ CONFIRMAR BONUS'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
    paddingVertical: 8, paddingHorizontal: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  winTitleTxt: { fontFamily: F, fontSize: FS.title, color: C.blue2, letterSpacing: 1 },
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  searchBody: { padding: PAD.win },
  label: { fontFamily: F, fontSize: FS.small, color: C.text2, letterSpacing: 1, marginBottom: 8 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    padding: 12, color: C.text,
    fontFamily: F, fontSize: FS.body,
    marginBottom: 10, letterSpacing: 2,
  },
  btnGreen: {
    backgroundColor: C.green,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.green2, borderLeftColor: C.green2,
    borderBottomColor: '#104830', borderRightColor: '#104830',
    paddingVertical: 16, alignItems: 'center',
    margin: 10,
  },
  btnGreenTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  statLbl: { fontFamily: F, fontSize: FS.small, color: C.text2 },
  statVal: { fontFamily: F, fontSize: FS.small, color: C.text },
  badge: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 3 },
  badgeTxt: { fontFamily: F, fontSize: FS.tiny },
})