# 🤖 IA ou Humano? • O Teste dos Sentimentos

Aplicação web mobile-first minimalista estilo Tinder para dinâmica interativa em sala de aula / treinamentos.

## 🎯 Objetivo da Dinâmica
Os participantes recebem **15 cartões aleatórios** contendo relatos sobre diferentes sentimentos (Saudade, Frustração, Família, Ansiedade, Paz, etc.).
- **Arrastar para a Esquerda (ou botão IA):** O participante acredita que o texto foi sintetizado por uma IA.
- **Arrastar para a Direita (ou botão Humano):** O participante acredita que o texto foi escrito por uma pessoa real.
- **Ao final dos 15 cartões:** O participante descobre:
  - Quantos acertou e quantos errou;
  - A proporção total de textos de IA e de Humanos que caíram no sorteio dele;
  - **O segredo é mantido:** O aplicativo **não** revela individualmente quais frases eram de IA ou Humanos, fomentando o debate e a troca de percepções entre a turma!

---

## 🛠️ Tecnologias Utilizadas
- **React 19 + TypeScript + Vite**
- **Tailwind CSS** (Design minimalista, card branco com texto preto, estética moderna e limpa)
- **Framer Motion** (Gestos de arraste / swipe físicos suaves com rotação e carimbos táteis)
- **Lucide Icons**
- **Canvas-Confetti** (Celebração na tela final de resultados)

---

## 🚀 Como Rodar Localmente

1. Instalar as dependências:
   ```bash
   npm install
   ```

2. Iniciar o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Abrir o link exibido no terminal (geralmente `http://localhost:5173`) no navegador ou pelo celular (na mesma rede Wi-Fi).

---

## 📦 Como Publicar no GitHub e na Vercel (Passo a Passo)

### 1. Criar repositório e enviar para o GitHub
No terminal da pasta do projeto (`EliteIA`):

```bash
git init
git add .
git commit -m "feat: app IA ou Humano dinamica Tinder"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPOSITORIO.git
git push -u origin main
```

### 2. Deploy na Vercel em 1 minuto
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** -> **"Project"**.
3. Selecione o repositório que você acabou de subir.
4. A Vercel detectará automaticamente que é um projeto **Vite**.
5. Clique em **"Deploy"**.
6. Em menos de 1 minuto seu link estará no ar (ex: `https://ia-ou-humano.vercel.app`), pronto para ser enviado no WhatsApp da sua turma!
