import { auth, db } from "@/config/firebase";
import { C, F } from "@/constants/theme";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type DadosProfessor = {
  nome: string;
};

export default function HomeProfessor() {
  const router = useRouter();
  const [dados, setDados] = useState<DadosProfessor | null>(null);

  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const unsub = onSnapshot(doc(db, "usuarios", uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosProfessor);
    });
    return () => unsub();
  }, []);

  async function sair() {
    await signOut(auth);
    router.replace("/(auth)/login");
  }

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
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
                {dados?.nome?.split(" ")[0].toUpperCase() ?? "..."}
              </Text>
              <Text style={s.charLv}>MESTRE · TURMA 3A</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>FERRAMENTAS</Text>
          </View>
          {[
            {
              icon: "🎟️",
              nome: "VALIDAR VOUCHER",
              desc: "Confirmar bonus de nota",
              rota: "/validar",
            },
            {
              icon: "📊",
              nome: "RANKING DA TURMA",
              desc: "XP e progresso em tempo real",
              rota: "/dashboard",
            },
            {
              icon: "⚔️",
              nome: "LANCAR MISSAO",
              desc: "Desafio com bonus de XP",
              rota: "/missoes",
            },
          ].map((item, i) => (
            <TouchableOpacity
              key={i}
              style={s.menuRow}
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
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: C.bg },
  container: { padding: 12, paddingTop: 48, gap: 4 },
  win: { borderWidth: 1, borderColor: C.border, backgroundColor: C.panel },
  winInner: { borderWidth: 1, borderColor: C.border2, margin: 2 },
  winTitle: {
    backgroundColor: C.panel,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingVertical: 5,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  winTitleTxt: { fontFamily: F, fontSize: 7, color: C.blue2, letterSpacing: 1 },
  sairTxt: { fontFamily: F, fontSize: 6, color: C.text3 },
  charRow: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    backgroundColor: "#001428",
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarIcon: { fontSize: 28 },
  charInfo: { flex: 1, justifyContent: "center" },
  charName: { fontFamily: F, fontSize: 9, color: C.text, marginBottom: 4 },
  charLv: { fontFamily: F, fontSize: 6, color: C.text2 },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.panel,
    borderBottomWidth: 1,
    borderBottomColor: C.border2,
    padding: 10,
  },
  menuCursor: { fontFamily: F, fontSize: 8, color: C.gold2, width: 10 },
  menuIcon: { fontSize: 14, width: 20, textAlign: "center" },
  menuBody: { flex: 1 },
  menuName: { fontFamily: F, fontSize: 7, color: C.text, marginBottom: 2 },
  menuDesc: { fontFamily: F, fontSize: 5, color: C.text3 },
});
