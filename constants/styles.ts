import { StyleSheet } from 'react-native'
import { C, F, FS, PAD } from './theme'

export const base = StyleSheet.create({
  // Layout
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { flex: 1 },
  container: {
    padding: PAD.screen,
    paddingTop: PAD.top,
    paddingBottom: 32,
    gap: 8,
  },

  // Janela FF7
  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border,
    paddingVertical: 8, paddingHorizontal: 12,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  winTitleTxt: { fontFamily: F, fontSize: FS.title, color: C.blue2, letterSpacing: 1 },
  winTitleSub: { fontFamily: F, fontSize: FS.small, color: C.text3 },

  // Botões
  btnBlue: {
    backgroundColor: C.blue,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.blue2, borderLeftColor: C.blue2,
    borderBottomColor: '#112266', borderRightColor: '#112266',
    paddingVertical: 16, alignItems: 'center' as const,
    margin: 10, marginBottom: 6,
  },
  btnBlueTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },

  btnGold: {
    backgroundColor: C.gold,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.gold2, borderLeftColor: C.gold2,
    borderBottomColor: '#442200', borderRightColor: '#442200',
    paddingVertical: 16, alignItems: 'center' as const,
    margin: 10, marginBottom: 6,
  },
  btnGoldTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },

  btnGreen: {
    backgroundColor: C.green,
    borderTopWidth: 2, borderLeftWidth: 2,
    borderBottomWidth: 2, borderRightWidth: 2,
    borderTopColor: C.green2, borderLeftColor: C.green2,
    borderBottomColor: '#104830', borderRightColor: '#104830',
    paddingVertical: 16, alignItems: 'center' as const,
    margin: 10, marginBottom: 6,
  },
  btnGreenTxt: { fontFamily: F, fontSize: FS.body, color: '#000', letterSpacing: 1 },

  btnGhost: {
    paddingVertical: 12, alignItems: 'center' as const,
    margin: 10, marginTop: 0,
    borderWidth: 1, borderColor: C.border2,
  },
  btnGhostTxt: { fontFamily: F, fontSize: FS.small, color: C.text3, letterSpacing: 1 },

  // Menu item
  menuRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 10,
    backgroundColor: C.panel,
    borderBottomWidth: 1, borderBottomColor: C.border2,
    padding: PAD.item,
  },
  menuRowSel: { backgroundColor: C.sel, borderBottomColor: C.border },
  menuCursor: { fontFamily: F, fontSize: 12, color: C.gold2, width: 16 },
  menuIcon: { fontSize: 22, width: 28, textAlign: 'center' as const },
  menuBody: { flex: 1 },
  menuName: { fontFamily: F, fontSize: FS.body, color: C.text, marginBottom: 4 },
  menuDesc: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
  menuBadge: {
    fontFamily: F, fontSize: FS.tiny,
    paddingHorizontal: 5, paddingVertical: 2,
    borderWidth: 1,
  },

  // Stat row
  statRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    padding: 12,
    borderBottomWidth: 1, borderBottomColor: C.border2,
  },
  statLbl: { fontFamily: F, fontSize: FS.small, color: C.text2 },
  statVal: { fontFamily: F, fontSize: FS.sub },

  // Textos
  backTxt: { fontFamily: F, fontSize: FS.small, color: C.text3 },
  label: { fontFamily: F, fontSize: FS.small, color: C.text2, letterSpacing: 1, marginBottom: 8 },
  input: {
    backgroundColor: C.bg,
    borderWidth: 1, borderColor: C.border,
    padding: 12, color: C.text,
    fontFamily: F, fontSize: FS.body,
    marginBottom: 16,
  },

  // XP badge
  xpBadge: { borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3 },
  xpTxt: { fontFamily: F, fontSize: FS.tiny },

  // Vazio
  vazioBody: { padding: 24, alignItems: 'center' as const },
  vazioEmoji: { fontSize: 36, marginBottom: 12 },
  vazioTxt: { fontFamily: F, fontSize: FS.small, color: C.text3, marginBottom: 6 },
  vazioSub: { fontFamily: F, fontSize: FS.tiny, color: C.text3 },
})