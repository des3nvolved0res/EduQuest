import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'

type DadosAluno = {
  nome: string
  email: string
  pontosPermanentes: number
  pontosTemporarios: number
  nivel: number
  cosmeticosDesbloqueados?: string[]
  criadoEm: string
}

const todosCosmeticos: Record<string, { nome: string; emoji: string; tipo: string }> = {
  titulo_matematica: { nome: 'MESTRE DA MATEMATICA', emoji: '📐', tipo: 'TITULO' },
  titulo_biologia:   { nome: 'MESTRE DA BIOLOGIA',   emoji: '🧬', tipo: 'TITULO' },
  titulo_historia:   { nome: 'MESTRE DA HISTORIA',   emoji: '📜', tipo: 'TITULO' },
  moldura_ouro:      { nome: 'MOLDURA DOURADA',       emoji: '🥇', tipo: 'MOLDURA' },
  moldura_prata:     { nome: 'MOLDURA PRATEADA',      emoji: '🥈', tipo: 'MOLDURA' },
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

  const xp = dados?.pontosPermanentes ?? 0
  const { nivel, xpProximo, progresso } = calcularNivel(xp)
  const cosmeticos = dados?.cosmeticosDesbloqueados ?? []
  const iniciais = dados?.nome?.split(' ').map(n => n[0]).slice(0, 2).join('') ?? '?'

 return (
    <View style={s.root}>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={s.backTxt}>◀ VOLTAR</Text>
            </TouchableOpacity>
            <Text style={s.winTitleTxt}>STATUS DO HEROI</Text>
          </View>
          <View style={s.charRow}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>{iniciais}</Text>
            </View>
            <View style={s.charInfo}>
              <Text style={s.charName}>{dados?.nome?.toUpperCase() ?? '...'}</Text>
              <Text style={s.charEmail}>{auth.currentUser?.email ?? '...'}</Text>
              {cosmeticos.some(c => c.startsWith('titulo_')) && (
                <View style={s.tituloBadge}>
                  {cosmeticos.filter(c => c.startsWith('titulo_')).map(c => (
                    <Text key={c} style={s.tituloTxt}>
                      {todosCosmeticos[c]?.emoji} {todosCosmeticos[c]?.nome}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>NIVEL {nivel}</Text>
            <Text style={[s.winTitleTxt, { color: C.gold2 }]}>{xp} / {xpProximo} XP</Text>
          </View>
          <View style={s.nivelBody}>
            <View style={s.progTrack}>
              <View style={[s.progFill, { width: `${progresso}%` as any }]} />
            </View>
            <Text style={s.progSub}>{xpProximo - xp} XP PARA O PROXIMO NIVEL</Text>
          </View>
        </View>
      </View>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>ESTATISTICAS</Text>
          </View>
          <View style={s.statRow}>
            <Text style={s.statLbl}>CRISTAIS</Text>
            <Text style={[s.statVal, { color: C.green2 }]}>{dados?.pontosPermanentes ?? 0}</Text>
          </View>
          <View style={s.statRow}>
            <Text style={s.statLbl}>BONUS CICLO</Text>
            <Text style={[s.statVal, { color: C.purple2 }]}>{dados?.pontosTemporarios ?? 0}</Text>
          </View>
          <View style={s.statRow}>
            <Text style={s.statLbl}>XP TOTAL</Text>
            <Text style={[s.statVal, { color: C.blue2 }]}>
              {(dados?.pontosPermanentes ?? 0) + (dados?.pontosTemporarios ?? 0)}
            </Text>
          </View>
          <View style={[s.statRow, { borderBottomWidth: 0 }]}>
            <Text style={s.statLbl}>MEMBRO DESDE</Text>
            <Text style={[s.statVal, { color: C.text2, fontSize: FS.small }]}>
              {dados?.criadoEm
                ? new Date(dados.criadoEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).toUpperCase()
                : '...'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[s.win, { flex: 1 }]}>
        <View style={[s.winInner, { flex: 1 }]}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>CONQUISTAS</Text>
            <Text style={s.winTitleSub}>{cosmeticos.length} DESBLOQUEADO</Text>
          </View>
          {cosmeticos.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
              <Text style={{ fontFamily: F, fontSize: 32, marginBottom: 14 }}>🔒</Text>
              <Text style={{ fontFamily: F, fontSize: FS.small, color: C.text3, marginBottom: 6 }}>NENHUMA CONQUISTA AINDA</Text>
              <Text style={{ fontFamily: F, fontSize: FS.tiny, color: C.text3 }}>Acumule XP e visite a loja</Text>
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              {cosmeticos.map(c => {
                const item = todosCosmeticos[c]
                if (!item) return null
                return (
                  <View key={c} style={[s.conquistaRow, { flex: 1 }]}>
                    <Text style={s.menuCursor}>✓</Text>
                    <Text style={s.menuIcon}>{item.emoji}</Text>
                    <View style={s.menuBody}>
                      <Text style={s.menuName}>{item.nome}</Text>
                      <Text style={s.menuDesc}>{item.tipo}</Text>
                    </View>
                    <View style={[s.xpBadge, { borderColor: C.green }]}>
                      <Text style={[s.xpTxt, { color: C.green2 }]}>ATIVO</Text>
                    </View>
                  </View>
                )
              })}
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
  winTitleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  charRow: { flexDirection: 'row', gap: 14, padding: 14 },
  avatar: {
    width: 64, height: 64, backgroundColor: '#001428',
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarTxt: { fontFamily: F, fontSize: 16, color: C.blue2 },
  charInfo: { flex: 1, justifyContent: 'center' },
  charName: { fontFamily: F, fontSize: FS.sub, color: C.text, marginBottom: 5 },
  charEmail: { fontFamily: F, fontSize: FS.tiny, color: C.text3, marginBottom: 8 },
  tituloBadge: { backgroundColor: '#000', borderWidth: 1, borderColor: C.gold, paddingHorizontal: 8, paddingVertical: 4 },
  tituloTxt: { fontFamily: F, fontSize: FS.tiny, color: C.gold2 },
  nivelBody: { padding: 14 },
  progTrack: { height: 10, backgroundColor: '#000', borderWidth: 1, borderColor: C.border2, overflow: 'hidden', marginBottom: 8 },
  progFill: { height: '100%', backgroundColor: C.blue },
  progSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  statRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  statLbl: { fontFamily: F, fontSize: FS.small, color: C.text2 },
  statVal: { fontFamily: F, fontSize: FS.sub },
  conquistaRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    paddingHorizontal: PAD.screen, minHeight: 64,
  },
  menuCursor: { fontFamily: F, fontSize: 12, color: C.green2, width: 16 },
  menuIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  menuBody: { flex: 1 },
  menuName: { fontFamily: F, fontSize: FS.body, color: C.text, marginBottom: 4 },
  menuDesc: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
  xpBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3 },
  xpTxt: { fontFamily: F, fontSize: FS.tiny },
})