import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal } from 'react-native'
import { useState, useEffect } from 'react'
import { useRouter } from 'expo-router'
import { doc, onSnapshot, updateDoc, increment, addDoc, collection } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

const materias = [
  { id: 'matematica', titulo: 'Matemática', emoji: '📐' },
  { id: 'portugues', titulo: 'Português', emoji: '📝' },
  { id: 'biologia', titulo: 'Biologia', emoji: '🧬' },
  { id: 'historia', titulo: 'História', emoji: '📜' },
  { id: 'geografia', titulo: 'Geografia', emoji: '🌍' },
  { id: 'fisica', titulo: 'Física', emoji: '⚡' },
  { id: 'quimica', titulo: 'Química', emoji: '🧪' },
  { id: 'ingles', titulo: 'Inglês', emoji: '🌐' },
]

const cosmeticos = [
  { id: 'titulo_matematica', titulo: 'Mestre da Matemática', emoji: '📐', custo: 50, tipo: 'titulo' },
  { id: 'titulo_biologia', titulo: 'Mestre da Biologia', emoji: '🧬', custo: 50, tipo: 'titulo' },
  { id: 'titulo_historia', titulo: 'Mestre da História', emoji: '📜', custo: 50, tipo: 'titulo' },
  { id: 'moldura_ouro', titulo: 'Moldura Dourada', emoji: '🥇', custo: 100, tipo: 'moldura' },
  { id: 'moldura_prata', titulo: 'Moldura Prateada', emoji: '🥈', custo: 60, tipo: 'moldura' },
]

type DadosAluno = {
  nome: string
  pontosPermanentes: number
  pontosTemporarios: number
  nivel: number
  cosmeticosDesbloqueados?: string[]
}

export default function LojaScreen() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosAluno | null>(null)
  const [abaSelecionada, setAbaSelecionada] = useState<'bonus' | 'cosmeticos'>('bonus')
  const [materiaSelecionada, setMateriaSelecionada] = useState<string | null>(null)
  const [tipoPonto, setTipoPonto] = useState<'permanentes' | 'temporarios'>('permanentes')
  const [quantidade, setQuantidade] = useState(10)
  const [modalVisivel, setModalVisivel] = useState(false)
  const [voucher, setVoucher] = useState<string | null>(null)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!auth.currentUser) return
    const uid = auth.currentUser.uid
    const unsub = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosAluno)
    })
    return () => unsub()
  }, [])

  const saldoDisponivel = tipoPonto === 'permanentes'
    ? dados?.pontosPermanentes ?? 0
    : dados?.pontosTemporarios ?? 0

  function gerarCodigoVoucher() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let codigo = 'EQ-'
    for (let i = 0; i < 8; i++) {
      codigo += chars[Math.floor(Math.random() * chars.length)]
    }
    return codigo
  }

  async function resgatar() {
    if (!materiaSelecionada) {
      Alert.alert('Atenção', 'Selecione uma matéria.')
      return
    }
    if (quantidade > saldoDisponivel) {
      Alert.alert('Saldo insuficiente', `Você tem apenas ${saldoDisponivel} XP disponível.`)
      return
    }
    if (quantidade < 10) {
      Alert.alert('Atenção', 'O mínimo para resgate é 10 XP.')
      return
    }

    setSalvando(true)
    try {
      const uid = auth.currentUser!.uid
      const campo = tipoPonto === 'permanentes' ? 'pontosPermanentes' : 'pontosTemporarios'
      const codigo = gerarCodigoVoucher()
      const materia = materias.find(m => m.id === materiaSelecionada)

      await updateDoc(doc(db, 'usuarios', uid), {
        [campo]: increment(-quantidade),
      })

      await addDoc(collection(db, 'vouchers'), {
        codigo,
        uid,
        nomeAluno: dados?.nome,
        materia: materiaSelecionada,
        nomeMateria: materia?.titulo,
        xp: quantidade,
        validado: false,
        criadoEm: new Date().toISOString(),
      })

      setVoucher(codigo)
      setModalVisivel(true)
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível gerar o voucher.')
      console.log(e)
    }
    setSalvando(false)
  }

  async function comprarCosmetico(cosmetico: typeof cosmeticos[0]) {
    if ((dados?.pontosPermanentes ?? 0) < cosmetico.custo) {
      Alert.alert('Saldo insuficiente', `Você precisa de ${cosmetico.custo} Cristais.`)
      return
    }
    if (dados?.cosmeticosDesbloqueados?.includes(cosmetico.id)) {
      Alert.alert('Já desbloqueado', 'Você já possui este item.')
      return
    }

    Alert.alert(
      'Confirmar compra',
      `Deseja comprar "${cosmetico.titulo}" por ${cosmetico.custo} Cristais?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Comprar',
          onPress: async () => {
            try {
              const uid = auth.currentUser!.uid
              await updateDoc(doc(db, 'usuarios', uid), {
                pontosPermanentes: increment(-cosmetico.custo),
                cosmeticosDesbloqueados: [...(dados?.cosmeticosDesbloqueados ?? []), cosmetico.id],
              })
              Alert.alert('Parabéns!', `"${cosmetico.titulo}" desbloqueado!`)
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível comprar o item.')
            }
          }
        }
      ]
    )
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={s.titulo}>Loja de Conquistas</Text>

      <View style={s.saldoRow}>
        <View style={s.saldoCard}>
          <Text style={s.saldoEmoji}>💎</Text>
          <Text style={s.saldoValor}>{dados?.pontosPermanentes ?? 0}</Text>
          <Text style={s.saldoLabel}>Cristais</Text>
        </View>
        <View style={s.saldoCard}>
          <Text style={s.saldoEmoji}>⚡</Text>
          <Text style={s.saldoValor}>{dados?.pontosTemporarios ?? 0}</Text>
          <Text style={s.saldoLabel}>Bônus ciclo</Text>
        </View>
      </View>

      <View style={s.abas}>
        <TouchableOpacity
          style={[s.aba, abaSelecionada === 'bonus' && s.abaAtiva]}
          onPress={() => setAbaSelecionada('bonus')}
        >
          <Text style={[s.txtAba, abaSelecionada === 'bonus' && s.txtAbaAtiva]}>
            🎓 Bônus de nota
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.aba, abaSelecionada === 'cosmeticos' && s.abaAtiva]}
          onPress={() => setAbaSelecionada('cosmeticos')}
        >
          <Text style={[s.txtAba, abaSelecionada === 'cosmeticos' && s.txtAbaAtiva]}>
            ✨ Cosméticos
          </Text>
        </TouchableOpacity>
      </View>

      {abaSelecionada === 'bonus' && (
        <View>
          <Text style={s.secao}>Tipo de pontos</Text>
          <View style={s.tipoRow}>
            <TouchableOpacity
              style={[s.tipoBotao, tipoPonto === 'permanentes' && s.tipoBotaoAtivo]}
              onPress={() => setTipoPonto('permanentes')}
            >
              <Text style={[s.tipoTxt, tipoPonto === 'permanentes' && s.tipoTxtAtivo]}>
                💎 Cristais
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.tipoBotao, tipoPonto === 'temporarios' && s.tipoBotaoAtivo]}
              onPress={() => setTipoPonto('temporarios')}
            >
              <Text style={[s.tipoTxt, tipoPonto === 'temporarios' && s.tipoTxtAtivo]}>
                ⚡ Bônus ciclo
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={s.secao}>Selecione a matéria</Text>
          <View style={s.materiasGrade}>
            {materias.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={[s.materiaBtn, materiaSelecionada === m.id && s.materiaBtnAtivo]}
                onPress={() => setMateriaSelecionada(m.id)}
              >
                <Text style={s.materiaEmoji}>{m.emoji}</Text>
                <Text style={[s.materiaTxt, materiaSelecionada === m.id && s.materiaTxtAtivo]}>
                  {m.titulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.secao}>Quantidade de XP</Text>
          <View style={s.quantidadeRow}>
            <TouchableOpacity
              style={s.btnQtd}
              onPress={() => setQuantidade(q => Math.max(10, q - 10))}
            >
              <Text style={s.txtQtd}>−</Text>
            </TouchableOpacity>
            <View style={s.qtdDisplay}>
              <Text style={s.qtdValor}>{quantidade}</Text>
              <Text style={s.qtdLabel}>XP</Text>
            </View>
            <TouchableOpacity
              style={s.btnQtd}
              onPress={() => setQuantidade(q => Math.min(saldoDisponivel, q + 10))}
            >
              <Text style={s.txtQtd}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[s.btnResgatar, salvando && { opacity: 0.6 }]}
            onPress={resgatar}
            disabled={salvando}
          >
            <Text style={s.txtResgatar}>
              {salvando ? 'Gerando voucher...' : '🎟️ Gerar voucher'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {abaSelecionada === 'cosmeticos' && (
        <View>
          {cosmeticos.map((c) => {
            const desbloqueado = dados?.cosmeticosDesbloqueados?.includes(c.id)
            return (
              <TouchableOpacity
                key={c.id}
                style={[s.cosmeticoCard, desbloqueado && s.cosmeticoDesbloqueado]}
                onPress={() => comprarCosmetico(c)}
              >
                <Text style={s.cosmeticoEmoji}>{c.emoji}</Text>
                <View style={s.cosmeticoTexto}>
                  <Text style={s.cosmeticoTitulo}>{c.titulo}</Text>
                  <Text style={s.cosmeticoTipo}>{c.tipo}</Text>
                </View>
                {desbloqueado ? (
                  <Text style={s.desbloqueadoBadge}>✓ Seu</Text>
                ) : (
                  <View style={s.custoBadge}>
                    <Text style={s.custoTxt}>💎 {c.custo}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>
      )}

      <Modal visible={modalVisivel} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalCard}>
            <Text style={s.modalEmoji}>🎟️</Text>
            <Text style={s.modalTitulo}>Voucher gerado!</Text>
            <Text style={s.modalSub}>Apresente este código ao seu professor</Text>

            <View style={s.codigoContainer}>
              <Text style={s.codigo}>{voucher}</Text>
            </View>

            <Text style={s.modalInfo}>
              {materias.find(m => m.id === materiaSelecionada)?.emoji}{' '}
              {materias.find(m => m.id === materiaSelecionada)?.titulo} • {quantidade} XP
            </Text>

            <TouchableOpacity
              style={s.btnFechar}
              onPress={() => {
                setModalVisivel(false)
                setVoucher(null)
                setMateriaSelecionada(null)
                setQuantidade(10)
              }}
            >
              <Text style={s.txtFechar}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60 },
  btnVoltar: { marginBottom: 24 },
  txtVoltar: { color: '#4A90E2', fontSize: 16 },
  titulo: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  saldoRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  saldoCard: {
    flex: 1, backgroundColor: '#16213E', borderRadius: 16,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333',
  },
  saldoEmoji: { fontSize: 28, marginBottom: 6 },
  saldoValor: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  saldoLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  abas: { flexDirection: 'row', marginBottom: 24, gap: 12 },
  aba: {
    flex: 1, padding: 12, borderRadius: 12,
    backgroundColor: '#16213E', alignItems: 'center',
    borderWidth: 1, borderColor: '#333',
  },
  abaAtiva: { backgroundColor: '#4A90E2', borderColor: '#4A90E2' },
  txtAba: { color: '#888', fontSize: 14, fontWeight: 'bold' },
  txtAbaAtiva: { color: '#fff' },
  secao: {
    color: '#888', fontSize: 13, marginBottom: 12,
    textTransform: 'uppercase', letterSpacing: 1,
  },
  tipoRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  tipoBotao: {
    flex: 1, padding: 12, borderRadius: 12,
    backgroundColor: '#16213E', alignItems: 'center',
    borderWidth: 1, borderColor: '#333',
  },
  tipoBotaoAtivo: { borderColor: '#4A90E2', backgroundColor: '#0F3460' },
  tipoTxt: { color: '#888', fontSize: 14 },
  tipoTxtAtivo: { color: '#4A90E2' },
  materiasGrade: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  materiaBtn: {
    width: '22%', padding: 10, borderRadius: 12,
    backgroundColor: '#16213E', alignItems: 'center',
    borderWidth: 1, borderColor: '#333',
  },
  materiaBtnAtivo: { borderColor: '#4A90E2', backgroundColor: '#0F3460' },
  materiaEmoji: { fontSize: 22, marginBottom: 4 },
  materiaTxt: { color: '#888', fontSize: 11, textAlign: 'center' },
  materiaTxtAtivo: { color: '#4A90E2' },
  quantidadeRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 24, marginBottom: 24,
  },
  btnQtd: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#16213E', justifyContent: 'center',
    alignItems: 'center', borderWidth: 1, borderColor: '#333',
  },
  txtQtd: { color: '#fff', fontSize: 22 },
  qtdDisplay: { alignItems: 'center' },
  qtdValor: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  qtdLabel: { color: '#888', fontSize: 14 },
  btnResgatar: {
    backgroundColor: '#4A90E2', padding: 18,
    borderRadius: 16, alignItems: 'center', marginBottom: 32,
  },
  txtResgatar: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  cosmeticoCard: {
    backgroundColor: '#16213E', borderRadius: 16, padding: 16,
    marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#333',
  },
  cosmeticoDesbloqueado: { borderColor: '#27AE60', opacity: 0.7 },
  cosmeticoEmoji: { fontSize: 32, marginRight: 16 },
  cosmeticoTexto: { flex: 1 },
  cosmeticoTitulo: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  cosmeticoTipo: { color: '#888', fontSize: 13, marginTop: 2 },
  desbloqueadoBadge: { color: '#27AE60', fontSize: 14, fontWeight: 'bold' },
  custoBadge: {
    backgroundColor: '#0F3460', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  custoTxt: { color: '#4A90E2', fontSize: 13, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  modalCard: {
    backgroundColor: '#16213E', borderRadius: 24,
    padding: 32, alignItems: 'center', width: '100%',
    borderWidth: 1, borderColor: '#333',
  },
  modalEmoji: { fontSize: 48, marginBottom: 16 },
  modalTitulo: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  modalSub: { color: '#888', fontSize: 15, marginBottom: 24, textAlign: 'center' },
  codigoContainer: {
    backgroundColor: '#0F3460', borderRadius: 16,
    paddingHorizontal: 24, paddingVertical: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#4A90E2',
  },
  codigo: { color: '#4A90E2', fontSize: 28, fontWeight: 'bold', letterSpacing: 4 },
  modalInfo: { color: '#888', fontSize: 15, marginBottom: 24 },
  btnFechar: {
    backgroundColor: '#4A90E2', padding: 16,
    borderRadius: 12, alignItems: 'center', width: '100%',
  },
  txtFechar: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
})