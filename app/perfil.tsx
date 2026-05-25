import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'

type DadosAluno = {
  nome: string
  email: string
  pontosPermanentes: number
  pontosTemporarios: number
  nivel: number
  cosmeticosDesbloqueados?: string[]
  criadoEm: string
}

const todosCosmeticos: Record<string, { titulo: string; emoji: string; tipo: string }> = {
  titulo_matematica: { titulo: 'Mestre da Matemática', emoji: '📐', tipo: 'Título' },
  titulo_biologia: { titulo: 'Mestre da Biologia', emoji: '🧬', tipo: 'Título' },
  titulo_historia: { titulo: 'Mestre da História', emoji: '📜', tipo: 'Título' },
  moldura_ouro: { titulo: 'Moldura Dourada', emoji: '🥇', tipo: 'Moldura' },
  moldura_prata: { titulo: 'Moldura Prateada', emoji: '🥈', tipo: 'Moldura' },
}

function calcularNivel(xp: number) {
  const niveis = [0, 50, 150, 300, 500, 750, 1000, 1500, 2000, 3000]
  let nivel = 1
  for (let i = 0; i < niveis.length; i++) {
    if (xp >= niveis[i]) nivel = i + 1
  }
  const xpAtual = niveis[nivel - 1] ?? 0
  const xpProximo = niveis[nivel] ?? 9999
  const progresso = Math.min(((xp - xpAtual) / (xpProximo - xpAtual)) * 100, 100)
  return { nivel, xpProximo, progresso }
}

export default function PerfilScreen() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosAluno | null>(null)

  useEffect(() => {
    if (!auth.currentUser) return
    const uid = auth.currentUser.uid
    const unsub = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosAluno)
    })
    return () => unsub()
  }, [])

  const xpTotal = (dados?.pontosPermanentes ?? 0) + (dados?.pontosTemporarios ?? 0)
  const { nivel, xpProximo, progresso } = calcularNivel(dados?.pontosPermanentes ?? 0)
  const cosmetcosAluno = dados?.cosmeticosDesbloqueados ?? []
  const iniciais = dados?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') ?? '?'

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      <TouchableOpacity onPress={() => router.back()} style={s.btnVoltar}>
        <Text style={s.txtVoltar}>← Voltar</Text>
      </TouchableOpacity>

      <View style={s.avatarContainer}>
        <View style={s.avatar}>
          <Text style={s.avatarTxt}>{iniciais}</Text>
        </View>
        {cosmetcosAluno.includes('moldura_ouro') && (
          <Text style={s.moldura}>🥇</Text>
        )}
        {!cosmetcosAluno.includes('moldura_ouro') && cosmetcosAluno.includes('moldura_prata') && (
          <Text style={s.moldura}>🥈</Text>
        )}
      </View>

      <Text style={s.nome}>{dados?.nome ?? '...'}</Text>
      <Text style={s.email}>{dados?.email ?? '...'}</Text>

      {cosmetcosAluno.some(c => c.startsWith('titulo_')) && (
        <View style={s.tituloBadge}>
          {cosmetcosAluno.filter(c => c.startsWith('titulo_')).map(c => (
            <Text key={c} style={s.tituloTxt}>
              {todosCosmeticos[c]?.emoji} {todosCosmeticos[c]?.titulo}
            </Text>
          ))}
        </View>
      )}

      <View style={s.nivelContainer}>
        <View style={s.nivelHeader}>
          <Text style={s.nivelTxt}>Nível {nivel}</Text>
          <Text style={s.nivelMeta}>{dados?.pontosPermanentes ?? 0} / {xpProximo} XP</Text>
        </View>
        <View style={s.barraContainer}>
          <View style={[s.barra, { width: `${progresso}%` }]} />
        </View>
        <Text style={s.nivelSub}>
          {xpProximo - (dados?.pontosPermanentes ?? 0)} XP para o próximo nível
        </Text>
      </View>

      <View style={s.statsRow}>
        <View style={s.statCard}>
          <Text style={s.statEmoji}>💎</Text>
          <Text style={s.statValor}>{dados?.pontosPermanentes ?? 0}</Text>
          <Text style={s.statLabel}>Cristais</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statEmoji}>⚡</Text>
          <Text style={s.statValor}>{dados?.pontosTemporarios ?? 0}</Text>
          <Text style={s.statLabel}>Bônus ciclo</Text>
        </View>
        <View style={s.statCard}>
          <Text style={s.statEmoji}>🏆</Text>
          <Text style={s.statValor}>{xpTotal}</Text>
          <Text style={s.statLabel}>XP total</Text>
        </View>
      </View>

      <Text style={s.secao}>Conquistas desbloqueadas</Text>

      {cosmetcosAluno.length === 0 ? (
        <View style={s.vazio}>
          <Text style={s.vazioEmoji}>🔒</Text>
          <Text style={s.vazioTxt}>Nenhuma conquista ainda</Text>
          <Text style={s.vazioSub}>Acumule XP e visite a Loja de Conquistas</Text>
        </View>
      ) : (
        cosmetcosAluno.map(c => {
          const cosmetico = todosCosmeticos[c]
          if (!cosmetico) return null
          return (
            <View key={c} style={s.conquista}>
              <Text style={s.conquistaEmoji}>{cosmetico.emoji}</Text>
              <View style={s.conquistaTexto}>
                <Text style={s.conquistaTitulo}>{cosmetico.titulo}</Text>
                <Text style={s.conquistaTipo}>{cosmetico.tipo}</Text>
              </View>
              <Text style={s.conquistaSelo}>✓</Text>
            </View>
          )
        })
      )}

      <Text style={s.membro}>
        Membro desde {dados?.criadoEm
          ? new Date(dados.criadoEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
          : '...'}
      </Text>
    </ScrollView>
  )
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#1A1A2E' },
  container: { padding: 24, paddingTop: 60, alignItems: 'center' },
  btnVoltar: { alignSelf: 'flex-start', marginBottom: 24 },
  txtVoltar: { color: '#4A90E2', fontSize: 16 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: '#4A90E2', justifyContent: 'center', alignItems: 'center',
  },
  avatarTxt: { color: '#fff', fontSize: 36, fontWeight: 'bold' },
  moldura: { position: 'absolute', bottom: -8, right: -8, fontSize: 28 },
  nome: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  email: { color: '#888', fontSize: 14, marginBottom: 16 },
  tituloBadge: {
    backgroundColor: '#0F3460', borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 8, marginBottom: 24,
    borderWidth: 1, borderColor: '#4A90E2',
  },
  tituloTxt: { color: '#4A90E2', fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
  nivelContainer: {
    width: '100%', backgroundColor: '#16213E', borderRadius: 16,
    padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#333',
  },
  nivelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  nivelTxt: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  nivelMeta: { color: '#888', fontSize: 14 },
  barraContainer: {
    height: 8, backgroundColor: '#333', borderRadius: 4, marginBottom: 8,
  },
  barra: { height: 8, backgroundColor: '#4A90E2', borderRadius: 4 },
  nivelSub: { color: '#888', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 32, width: '100%' },
  statCard: {
    flex: 1, backgroundColor: '#16213E', borderRadius: 16,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#333',
  },
  statEmoji: { fontSize: 24, marginBottom: 6 },
  statValor: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 2 },
  secao: {
    color: '#888', fontSize: 13, marginBottom: 16, alignSelf: 'flex-start',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  vazio: { alignItems: 'center', paddingVertical: 32 },
  vazioEmoji: { fontSize: 48, marginBottom: 12 },
  vazioTxt: { color: '#888', fontSize: 16, marginBottom: 4 },
  vazioSub: { color: '#555', fontSize: 13 },
  conquista: {
    width: '100%', backgroundColor: '#16213E', borderRadius: 16,
    padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#27AE60',
  },
  conquistaEmoji: { fontSize: 32, marginRight: 16 },
  conquistaTexto: { flex: 1 },
  conquistaTitulo: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  conquistaTipo: { color: '#888', fontSize: 13, marginTop: 2 },
  conquistaSelo: { color: '#27AE60', fontSize: 20, fontWeight: 'bold' },
  membro: { color: '#555', fontSize: 13, marginTop: 24 },
})