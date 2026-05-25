import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const perguntas = [
  {
    pergunta: "Quanto é 2 + 2?",
    alternativas: ["3", "4", "5", "6"],
    correta: 1,
  },
  {
    pergunta: "Qual é a capital do Brasil?",
    alternativas: ["São Paulo", "Rio de Janeiro", "Brasília", "Salvador"],
    correta: 2,
  },
  {
    pergunta: "Quanto é 5 x 3?",
    alternativas: ["10", "12", "15", "18"],
    correta: 2,
  },
];

export default function QuizScreen() {
  const [indice, setIndice] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(
    null,
  );
  const [pontos, setPontos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const perguntaAtual = perguntas[indice];

  function responder(i: number) {
    if (respostaSelecionada !== null) return;
    setRespostaSelecionada(i);
    if (i === perguntaAtual.correta) {
      setPontos((p) => p + 1);
    }
  }

  function proxima() {
    if (indice + 1 >= perguntas.length) {
      setFinalizado(true);
    } else {
      setIndice((i) => i + 1);
      setRespostaSelecionada(null);
    }
  }

  function corDaBotao(i: number) {
    if (respostaSelecionada === null) return "#3A3A3A";
    if (i === perguntaAtual.correta) return "#27AE60";
    if (i === respostaSelecionada) return "#E74C3C";
    return "#3A3A3A";
  }

  if (finalizado) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Quiz finalizado!</Text>
        <Text style={estilos.pontos}>
          Você acertou {pontos} de {perguntas.length}
        </Text>
        <TouchableOpacity
          style={estilos.botaoProxima}
          onPress={() => {
            setIndice(0);
            setPontos(0);
            setRespostaSelecionada(null);
            setFinalizado(false);
          }}
        >
          <Text style={estilos.textoBotao}>Jogar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.progresso}>
        Pergunta {indice + 1} de {perguntas.length}
      </Text>

      <Text style={estilos.pergunta}>{perguntaAtual.pergunta}</Text>

      {perguntaAtual.alternativas.map((alt, i) => (
        <TouchableOpacity
          key={i}
          style={[estilos.alternativa, { backgroundColor: corDaBotao(i) }]}
          onPress={() => responder(i)}
        >
          <Text style={estilos.textoAlternativa}>{alt}</Text>
        </TouchableOpacity>
      ))}

      {respostaSelecionada !== null && (
        <View>
          <Text style={estilos.feedback}>
            {respostaSelecionada === perguntaAtual.correta
              ? "✓ Correto!"
              : `✗ Errou! A resposta certa é: ${perguntaAtual.alternativas[perguntaAtual.correta]}`}
          </Text>
          <TouchableOpacity style={estilos.botaoProxima} onPress={proxima}>
            <Text style={estilos.textoBotao}>
              {indice + 1 >= perguntas.length ? "Ver resultado" : "Próxima"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#1A1A2E",
  },
  progresso: {
    color: "#888",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  titulo: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  pergunta: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    lineHeight: 32,
  },
  alternativa: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  textoAlternativa: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
  feedback: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 16,
  },
  botaoProxima: {
    backgroundColor: "#4A90E2",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  pontos: {
    color: "#4A90E2",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 32,
  },
});
