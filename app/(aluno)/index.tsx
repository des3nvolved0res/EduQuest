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

type DadosAluno = {
  nome: string;
  pontosPermanentes: number;
  pontosTemporarios: number;
  nivel: number;
};

const portais = [
  {
    id: "reliquias",
    nome: "RELIQUIAS",
    desc: "Pontos permanentes",
    icon: "💎",
    badge: "",
    badgeColor: C.teal2,
  },
  {
    id: "ciclos",
    nome: "CICLOS",
    desc: "12 dias restantes",
    icon: "⏳",
    badge: "!",
    badgeColor: C.gold2,
  },
  {
    id: "mural",
    nome: "MURAL DO MESTRE",
    desc: "2 missoes ativas",
    icon: "📜",
    badge: "NEW",
    badgeColor: C.teal2,
  },
  {
    id: "loja",
    nome: "LOJA",
    desc: "Troque XP por bonus",
    icon: "🏪",
    badge: "",
    badgeColor: C.teal2,
  },
  {
    id: "perfil",
    nome: "PERFIL",
    desc: "Status e conquistas",
    icon: "🧙",
    badge: "",
    badgeColor: C.teal2,
  },
];

export default function HubAluno() {
  const router = useRouter();
  const [dados, setDados] = useState<DadosAluno | null>(null);
  const [sel, setSel] = useState(0);

  useEffect(() => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const unsub = onSnapshot(doc(db, "usuarios", uid), (snap) => {
      if (snap.exists()) setDados(snap.data() as DadosAluno);
    });
    return () => unsub();
  }, []);

  async function sair() {
    await signOut(auth);
    router.replace("/(auth)/login");
  }

  function navegar(id: string) {
    if (id === "loja") router.push("/loja");
    else if (id === "perfil") router.push("/perfil");
    else router.push(`/materias?portal=${id}`);
  }

  const xpMax = 500;
  const xpPct = Math.min(((dados?.pontosPermanentes ?? 0) / xpMax) * 100, 100);
  const mpMax = 200;
  const mpPct = Math.min(((dados?.pontosTemporarios ?? 0) / mpMax) * 100, 100);

  return (
    <ScrollView style={s.scroll} contentContainerStyle={s.container}>
      {/* Janela de status do personagem */}
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>EDUQUEST</Text>
            <TouchableOpacity onPress={sair}>
              <Text style={s.sairTxt}>SAIR</Text>
            </TouchableOpacity>
          </View>

          <View style={s.charRow}>
            <View style={s.avatar}>
              <Text style={s.avatarIcon}>🧙</Text>
            </View>
            <View style={s.charInfo}>
              <Text style={s.charName}>
                {dados?.nome?.split(" ")[0].toUpperCase() ?? "..."}
              </Text>
              <Text style={s.charLv}>LV {dados?.nivel ?? 1}</Text>

              {/* HP = Cristais */}
              <View style={s.barRow}>
                <Text style={s.barLbl}>XP</Text>
                <View style={s.barTrack}>
                  <View
                    style={[
                      s.barFill,
                      { width: `${xpPct}%` as any, backgroundColor: C.green },
                    ]}
                  />
                </View>
                <Text style={[s.barVal, { color: C.green2 }]}>
                  {dados?.pontosPermanentes ?? 0}/{xpMax}
                </Text>
              </View>

              {/* MP = Bônus Ciclo */}
              <View style={s.barRow}>
                <Text style={s.barLbl}>MP</Text>
                <View style={s.barTrack}>
                  <View
                    style={[
                      s.barFill,
                      { width: `${mpPct}%` as any, backgroundColor: C.purple },
                    ]}
                  />
                </View>
                <Text style={[s.barVal, { color: C.purple2 }]}>
                  {dados?.pontosTemporarios ?? 0}/{mpMax}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={s.statsRow}>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: C.green2 }]}>
                {dados?.pontosPermanentes ?? 0}
              </Text>
              <Text style={s.statLbl}>CRISTAIS</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: C.purple2 }]}>
                {dados?.pontosTemporarios ?? 0}
              </Text>
              <Text style={s.statLbl}>BONUS</Text>
            </View>
            <View style={s.statBox}>
              <Text style={[s.statVal, { color: C.gold2 }]}>
                {dados?.nivel ?? 1}
              </Text>
              <Text style={s.statLbl}>NIVEL</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Menu de portais */}
      <View style={s.win}>
        <View style={s.winInner}>
          <View style={s.winTitle}>
            <Text style={s.winTitleTxt}>JORNADA</Text>
          </View>
          {portais.map((p, i) => (
            <TouchableOpacity
              key={p.id}
              style={[s.menuRow, sel === i && s.menuRowSel]}
              onPress={() => {
                setSel(i);
                navegar(p.id);
              }}
              activeOpacity={0.8}
            >
              <Text style={s.menuCursor}>{sel === i ? "▶" : " "}</Text>
              <Text style={s.menuIcon}>{p.icon}</Text>
              <View style={s.menuBody}>
                <Text style={s.menuName}>{p.nome}</Text>
                <Text style={s.menuDesc}>{p.desc}</Text>
              </View>
              {p.badge !== "" && (
                <Text
                  style={[
                    s.menuBadge,
                    { color: p.badgeColor, borderColor: p.badgeColor },
                  ]}
                >
                  {p.badge}
                </Text>
              )}
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

  win: {
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.panel,
  },
  winInner: {
    borderWidth: 1,
    borderColor: C.border2,
    margin: 2,
  },
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
  winTitleTxt: {
    fontFamily: F,
    fontSize: 7,
    color: C.blue2,
    letterSpacing: 1,
  },
  sairTxt: {
    fontFamily: F,
    fontSize: 6,
    color: C.text3,
  },

  charRow: {
    flexDirection: "row",
    gap: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border2,
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
  charInfo: { flex: 1 },
  charName: {
    fontFamily: F,
    fontSize: 9,
    color: C.text,
    marginBottom: 3,
  },
  charLv: {
    fontFamily: F,
    fontSize: 6,
    color: C.text2,
    marginBottom: 6,
  },
  barRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  barLbl: {
    fontFamily: F,
    fontSize: 6,
    color: C.text2,
    width: 16,
  },
  barTrack: {
    flex: 1,
    height: 7,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: "#334",
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  barVal: {
    fontFamily: F,
    fontSize: 6,
    minWidth: 48,
    textAlign: "right",
  },

  statsRow: {
    flexDirection: "row",
    padding: 8,
    gap: 6,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: C.border2,
    padding: 8,
    alignItems: "center",
  },
  statVal: {
    fontFamily: F,
    fontSize: 12,
    marginBottom: 4,
  },
  statLbl: {
    fontFamily: F,
    fontSize: 5,
    color: C.text3,
    letterSpacing: 0.5,
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.panel,
    borderBottomWidth: 1,
    borderBottomColor: C.border2,
    padding: 10,
  },
  menuRowSel: {
    backgroundColor: C.sel,
    borderBottomColor: C.border,
  },
  menuCursor: {
    fontFamily: F,
    fontSize: 8,
    color: C.gold2,
    width: 10,
  },
  menuIcon: { fontSize: 14, width: 20, textAlign: "center" },
  menuBody: { flex: 1 },
  menuName: {
    fontFamily: F,
    fontSize: 7,
    color: C.text,
    marginBottom: 2,
  },
  menuDesc: {
    fontFamily: F,
    fontSize: 5,
    color: C.text3,
  },
  menuBadge: {
    fontFamily: F,
    fontSize: 5,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
  },
});
