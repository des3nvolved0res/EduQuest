import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/config/firebase'
import { C, F, FS, PAD } from '@/constants/theme'

type DadosProfessor = { nome: string }

export default function HomeProfessor() {
  const router = useRouter()
  const [dados, setDados] = useState<DadosProfessor | null>(null)

  useEffect(() => {
    if (!auth.currentUser) return
    const uid = auth.currentUser.uid
    const unsub = onSnapshot(doc(db, 'usuarios', uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosProfessor)
    })
    return () => unsub()
  }, [])

 async function sair() {
  Alert.alert(
    'SAIR DO JOGO',
    'Deseja realmente sair?',
    [
      { text: 'CANCELAR', style: 'cancel' },
      {
        text: 'SAIR',
        style: 'destructive',
        onPress: async () => {
          await signOut(auth)
          router.replace('/(auth)/login')
        }
      }
    ]
  )
}

  return (
    <View style={s.root}>
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>PAINEL DO MESTRE</Text>
            <TouchableOpacity onPress={sair}>
              <Text style={s.sairTxt}>SAIR</Text>
            </TouchableOpacity>
          </View>
          <View style={s.charRow}>
            <View style={s.avatar}>
              <Text style={s.avatarIcon}>📖</Text>
            </View>
            <View style={s.charInfo}>
              <Text style={s.charName}>
                {dados?.nome?.split(' ')[0].toUpperCase() ?? '...'}
              </Text>
              <Text style={s.charLv}>MESTRE · TURMA 3A</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[s.win, { flex: 1 }]}>
        <View style={[s.winInner, { flex: 1 }]}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>FERRAMENTAS</Text>
          </View>
          <View style={{ flex: 1 }}>
            {[
              { icon: '🎟️', nome: 'VALIDAR VOUCHER',  desc: 'Confirmar bonus de nota',     rota: '/validar' },
              { icon: '📊', nome: 'RANKING DA TURMA', desc: 'XP e progresso em tempo real', rota: '/dashboard' },
              { icon: '⚔️', nome: 'LANCAR MISSAO',    desc: 'Desafio com bonus de XP',      rota: '/missoes' },
            ].map((item, i) => (
              <TouchableOpacity
                key={i}
                style={[s.menuRow, { flex: 1 }]}
                onPress={() => router.push(item.rota as any)}
                activeOpacity={0.8}
              >
                <Text style={s.menuCursor}>▶</Text>
                <Text style={s.menuIcon}>{item.icon}</Text>
                <View style={s.menuBody}>
                  <Text style={s.menuName}>{item.nome}</Text>
                  <Text style={s.menuDesc}>{item.desc}</Text>
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
  sairTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  charRow: {
    flexDirection: 'row', gap: 12, padding: 14,
  },
  avatar: {
    width: 68, height: 68,
    backgroundColor: '#001428',
    borderWidth: 1, borderColor: C.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarIcon: { fontSize: 36 },
  charInfo: { flex: 1, justifyContent: 'center' },
  charName: { fontFamily: F, fontSize: FS.name, color: C.text, marginBottom: 4 },
  charLv: { fontFamily: F, fontSize: FS.small, color: C.text2 },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    paddingHorizontal: PAD.screen,
    minHeight: 80,
  },
  menuCursor: { fontFamily: F, fontSize: 12, color: C.gold2, width: 16 },
  menuIcon: { fontSize: 24, width: 30, textAlign: 'center' },
  menuBody: { flex: 1 },
  menuName: { fontFamily: F, fontSize: FS.body, color: C.text, marginBottom: 5 },
  menuDesc: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
})