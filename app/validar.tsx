import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/config/firebase'

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

  async function buscarVoucher() {
    if (!codigo.trim()) {
      Alert.alert('Atenção', 'Digite o código do voucher.')
      return
    }
    setBuscando(true)
    try {
      const q = query(
        collection(db, 'vouchers'),
        where('codigo', '==', codigo.trim().toUpperCase())
      )
      const snap = await getDocs(q)
      if (snap.empty) {
        Alert.alert('Não encontrado', 'Código inválido ou inexistente.')
        setVoucher(null)
      } else {
        const docSnap = snap.docs[0]
        setVoucher({ id: docSnap.id, ...docSnap.data() } as Voucher)
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível buscar o voucher.')
    }
    setBuscando(false)
  }

  async function validarVoucher() {
    if (!voucher) return
    if (voucher.validado) {
      Alert.alert('Atenção', 'Este voucher já foi validado.')
      return
    }
    setValidando(true)
    try {
      await updateDoc(doc(db, 'vouchers', voucher.id), {
        validado: true,
        validadoEm: new Date().toISOString(),
      })
      setVoucher({ ...voucher, validado: true })
      Alert.alert(
        '✓ Validado!',
        `Bônus de ${voucher.xp} XP em ${voucher.nomeMateria} confirmado para ${voucher.nomeAluno}.`
      )
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível validar o voucher.')
    }
    setValidando(false)
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.titulo}>Validar voucher</Text>
      <Text style={s.descricao}>Digite o código apresentado pelo aluno</Text>

      <View style={s.inputRow}>
        <TextInput
          style={s.input}
          placeholder="Ex: EQ-ABC12345"
          placeholderTextColor="#888"
          value={codigo}
          onChangeText={setCodigo}
          autoCapitalize="characters"
        />
        <TouchableOpacity
          style={s.btnBuscar}
          onPress={buscarVoucher}
          disabled={buscando}
        >
          <Text style={s.txtBuscar}>
            {buscando ? '...' : '🔍'}
          </Text>
        </TouchableOpacity>
      </View>

      {voucher && (
        <View style={[s.card, voucher.validado && s.cardValidado]}>
          <View style={s.cardHeader}>
            <Text style={s.cardCodigo}>{voucher.codigo}</Text>
            {voucher.validado && (
              <View style={s.badgeValidado}>
                <Text style={s.txtBadge}>✓ Validado</Text>
              </View>
            )}
          </View>

          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Aluno</Text>
            <Text style={s.infoValor}>{voucher.nomeAluno}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Matéria</Text>
            <Text style={s.infoValor}>{voucher.nomeMateria}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>XP conquistado</Text>
            <Text style={[s.infoValor, { color: '#4A90E2' }]}>{voucher.xp} XP</Text>
          </View>
          <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={s.infoLabel}>Gerado em</Text>
            <Text style={s.infoValor}>
              {new Date(voucher.criadoEm).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          {!voucher.validado && (
            <TouchableOpacity
              style={s.btnValidar}
              onPress={validarVoucher}
              disabled={validando}
            >
              <Text style={s.txtValidar}>
                {validando ? 'Validando...' : '✓ Confirmar bônus'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60 },
  btnVoltar: { marginBottom: 24 },
  txtVoltar: { color: '#4A90E2', fontSize: 16 },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  descricao: { color: '#888', fontSize: 15, marginBottom: 24 },
  inputRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  input: {
    flex: 1, backgroundColor: '#16213E', borderRadius: 12,
    padding: 16, color: '#fff', fontSize: 16,
    borderWidth: 1, borderColor: '#333',
  },
  btnBuscar: {
    backgroundColor: '#4A90E2', borderRadius: 12,
    width: 52, justifyContent: 'center', alignItems: 'center',
  },
  txtBuscar: { fontSize: 20 },
  card: {
    backgroundColor: '#16213E', borderRadius: 16,
    padding: 20, borderWidth: 1, borderColor: '#333',
  },
  cardValidado: { borderColor: '#27AE60' },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  cardCodigo: { color: '#4A90E2', fontSize: 20, fontWeight: 'bold', letterSpacing: 2 },
  badgeValidado: {
    backgroundColor: '#1a4a2e', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: '#27AE60',
  },
  txtBadge: { color: '#27AE60', fontSize: 13, fontWeight: 'bold' },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333',
  },
  infoLabel: { color: '#888', fontSize: 15 },
  infoValor: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  btnValidar: {
    backgroundColor: '#27AE60', padding: 16,
    borderRadius: 12, alignItems: 'center', marginTop: 20,
  },
  txtValidar: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})