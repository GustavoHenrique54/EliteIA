# 🤖 IA ou Humano? • O Teste dos Sentimentos

Aplicação web mobile-first minimalista estilo Tinder para dinâmica interativa em sala de aula / treinamentos corporativos.

---

## 🎯 Regras da Dinâmica da Turma

Cada participante joga uma rodada com **20 cartões sorteados aleatoriamente**, distribuídos exatamente da seguinte forma:
- **9 textos escritos por Humanos** (de um banco de 35 depoimentos reais)
- **6 textos gerados por IA padrão** (de um banco de 52 textos)
- **5 textos gerados por IA MUITO instruída a fingir ser um ser humano** (de um banco de 26 textos com prompts de alta fidelidade humana)

### Como Jogar
- **Arrastar para a Esquerda 👈 (ou botão "É IA"):** O jogador aposta que o texto foi gerado por Inteligência Artificial.
- **Arrastar para a Direita 👉 (ou botão "É Humano"):** O jogador aposta que o texto foi escrito por um Humano real.
- **No celular:** Toque e arraste com o dedo.
- **No computador:** Use o mouse ou as setas do teclado (`←` e `→` ou teclas `A` e `D`).

---

## 📊 Análise Final para o Participante

Ao completar os 20 cartões:
1. **Pontuação Geral:** Total de acertos, erros e porcentagem de precisão.
2. **Separação por Categoria:**
   - Desempenho nos textos de **Humanos** (quantos reconheceu vs quantos confundiu com IA).
   - Desempenho nos textos de **IA Padrão** (quantos identificou como máquina).
3. **A Revelação Especial:**
   - O aplicativo informa com destaque que em **5 questões** a inteligência artificial foi **MUITO instruída a fingir ser humano**, mostrando em quantas delas a IA conseguiu enganar o participante!
4. **O Segredo Individual Continua:**
   - O aplicativo **não** revela quais frases específicas eram de quem para os alunos, preservando o debate aberto e a troca de experiências na turma.

---

## 🔐 Painel do Administrador (Acesso do Professor)

No topo do aplicativo há um botão discreto **"Admin"** protegido por senha.
- **Senha de acesso:** Definida via variável de ambiente `VITE_ADMIN_PASSWORD` (ou configurada no arquivo `.env`).

### Recursos do Painel:
- **ID baseado na Linha da Planilha:** Cada um dos 113 textos é indexado exatamente pelo número da sua linha no arquivo Excel original (`Sentimentos_textos.xlsx`, linhas 2 a 114).
- **Métricas Gerais em Tempo Real:**
  - Total de participantes que concluíram.
  - Votos totais, acertos e erros.
  - Taxa em que a turma reconheceu Humanos, IA padrão e a taxa de engano da IA camaleão.
- **Estatísticas por Sentimento:** Taxa de acerto em cada uma das 13 categorias (Ansiedade, Família, Felicidade, Raiva, Saudade, etc.).
- **Tabela Detalhada Item a Item:**
  - Número da Linha no Excel (ID).
  - Sentimento e Classificação Real (`Humano`, `IA` ou `IA fingindo ser humano`).
  - Texto completo da planilha.
  - Total de vezes que caiu para os alunos.
  - Taxa de Acerto (%) e Taxa que Enganou (%).
  - Busca por palavra-chave ou número de linha, filtros por sentimento/tipo e ordenação por colunas.
- **Exportação para Excel:** Baixa uma planilha `.CSV` completa com todos os dados e taxas consolidadas.
- **Reset de Turma:** Permite zerar as respostas para aplicar a dinâmica com uma nova turma.

---

## ☁️ Conexão com Banco em Nuvem (Firebase)

O aplicativo funciona de duas maneiras:

1. **Modo Automático / Local:** Salva os dados no navegador de cada dispositivo.
2. **Modo Nuvem (Firebase Firestore):** Os votos dos celulares de todos os alunos chegam em tempo real para o computador do professor!
   - Basta criar um projeto gratuito no [Firebase Console](https://console.firebase.google.com).
   - Ative o **Cloud Firestore** em modo de teste.
   - Abra o Painel de Admin no aplicativo, clique em **"Configurar Nuvem"** e cole as chaves do seu projeto Firebase (ou configure as variáveis de ambiente `VITE_FIREBASE_*` na Vercel).

---

## 🚀 Como Publicar no GitHub e na Vercel

### 1. Enviar para o GitHub
```bash
git add .
git commit -m "feat: dinamica 20 cards com nova categoria e painel admin"
git push origin main
```

### 2. Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com) e importe o repositório.
2. Framework preset: **Vite**.
3. Clique em **Deploy**. Em menos de 1 minuto o link estará ativo para compartilhar com seus alunos!
