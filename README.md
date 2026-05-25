# EduQuest 🎮

Plataforma educacional gamificada para alunos e professores da rede estadual.

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- Expo Go no celular

### Instalação

1. Clone o repositório:
   git clone https://github.com/SEU_USUARIO/EduQuest.git

2. Entre na pasta:
   cd EduQuest

3. Instale as dependências:
   npm install

4. Crie o arquivo .env na raiz com as chaves do Firebase:
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   EXPO_PUBLIC_FIREBASE_APP_ID=...

5. Inicie o projeto:
   npx expo start --tunnel

## Estrutura do projeto

app/
├── (auth)/        — login e cadastro
├── (aluno)/       — hub do aluno
├── (professor)/   — painel do professor
├── loja.tsx       — loja de conquistas
├── quest.tsx      — quiz gamificado
├── pilulas.tsx    — pílulas de conhecimento
├── topicos.tsx    — tópicos por matéria
├── materias.tsx   — grade de matérias
├── perfil.tsx     — perfil do aluno
├── validar.tsx    — validação de vouchers
├── dashboard.tsx  — dashboard do professor
└── missoes.tsx    — missões especiais

config/
└── firebase.ts    — configuração do Firebase

## Tecnologias
- React Native + Expo
- Firebase Authentication
- Cloud Firestore