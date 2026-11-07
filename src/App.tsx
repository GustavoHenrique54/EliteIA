import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import {
  Bot,
  User,
  RotateCcw,
  Sparkles,
  Share2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Check,
  Award,
  Flame,
  BrainCircuit,
  Lock,
} from 'lucide-react'
import { SentimentText, VoteRecord, ParticipantSession } from './types'
import { generate20CardRound } from './services/deck'
import { saveSession } from './services/storage'
import { AdminDashboard } from './components/AdminDashboard'

const TOTAL_CARDS = 20

// Componente para o Card individual com física de Swipe estilo Tinder
interface TinderCardProps {
  item: SentimentText
  onSwipe: (choice: 'IA' | 'Humano') => void
  isTop: boolean
  index: number
  total: number
  activeDirection?: 'left' | 'right' | null
}

function TinderCard({
  item,
  onSwipe,
  isTop,
  index,
  total,
  activeDirection,
}: TinderCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-18, 18])
  const opacity = useTransform(x, [-350, -150, 0, 150, 350], [0, 1, 1, 1, 0])
  const [swipedDir, setSwipedDir] = useState<'left' | 'right' | null>(null)

  // Indicadores visuais de carimbo (stamp)
  const iaStampOpacity = useTransform(x, [-160, -30], [1, 0])
  const iaStampScale = useTransform(x, [-160, -30], [1.1, 0.8])

  const humanStampOpacity = useTransform(x, [30, 160], [0, 1])
  const humanStampScale = useTransform(x, [30, 160], [0.8, 1.1])

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 65
    const velocityThreshold = 300

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      setSwipedDir('left')
      onSwipe('IA')
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      setSwipedDir('right')
      onSwipe('Humano')
    }
  }

  const exitDirection = swipedDir || activeDirection || (x.get() < 0 ? 'left' : 'right')

  return (
    <motion.div
      custom={exitDirection}
      variants={{
        initial: { scale: 0.95, y: 15, opacity: 0 },
        animate: { scale: 1, y: 0, opacity: 1 },
        exit: (dir: string) => ({
          x: dir === 'left' ? -550 : 550,
          rotate: dir === 'left' ? -25 : 25,
          opacity: 0,
          transition: { duration: 0.25, ease: 'easeOut' },
        }),
      }}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: total - index,
      }}
      drag={isTop ? 'x' : false}
      dragDirectionLock
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.65}
      onDragEnd={handleDragEnd}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`absolute inset-0 w-full h-full bg-white rounded-3xl p-5 sm:p-7 flex flex-col justify-between 
        shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08),0_0_1px_1px_rgba(0,0,0,0.06)] border border-zinc-100 
        cursor-grab active:cursor-grabbing select-none overflow-hidden touch-none`}
    >
      {/* Carimbo IA (Aparece ao arrastar para esquerda) */}
      <motion.div
        style={{
          opacity: iaStampOpacity,
          scale: iaStampScale,
        }}
        className="pointer-events-none absolute top-7 right-7 border-2 border-zinc-900 text-zinc-900 bg-zinc-50/95 
                   font-extrabold text-sm sm:text-base uppercase tracking-widest px-3.5 py-1.5 rounded-xl 
                   rotate-12 shadow-sm flex items-center gap-1.5 z-20"
      >
        <Bot className="w-4 h-4 text-zinc-800" />
        <span>IA 🤖</span>
      </motion.div>

      {/* Carimbo Humano (Aparece ao arrastar para direita) */}
      <motion.div
        style={{
          opacity: humanStampOpacity,
          scale: humanStampScale,
        }}
        className="pointer-events-none absolute top-7 left-7 border-2 border-zinc-900 text-zinc-900 bg-zinc-50/95 
                   font-extrabold text-sm sm:text-base uppercase tracking-widest px-3.5 py-1.5 rounded-xl 
                   -rotate-12 shadow-sm flex items-center gap-1.5 z-20"
      >
        <User className="w-4 h-4 text-zinc-800" />
        <span>HUMANO 👤</span>
      </motion.div>

      {/* Topo do Card: Categoria / Sentimento */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/90 text-zinc-800">
          <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-semibold tracking-wider uppercase">
            {item.sentiment}
          </span>
        </div>
        <span className="text-xs font-medium text-zinc-400">
          {index + 1} de {total}
        </span>
      </div>

      {/* Meio do Card: Texto do Sentimento */}
      <div className="flex-1 flex items-center justify-center py-5 px-1 overflow-y-auto">
        <p className="font-serif-text text-lg sm:text-2xl text-zinc-800 leading-relaxed sm:leading-relaxed text-center font-normal">
          &ldquo;{item.text}&rdquo;
        </p>
      </div>

      {/* Rodapé do Card: Dica de Ação */}
      <div className="pt-3 border-t border-zinc-100/80 flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
        <span className="flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" /> Arrasta: IA
        </span>
        <span className="text-zinc-300">•</span>
        <span className="flex items-center gap-1">
          Humano: Arrasta <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [view, setView] = useState<'app' | 'admin'>('app')
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro')
  const [cards, setCards] = useState<SentimentText[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<VoteRecord[]>([])
  const [copied, setCopied] = useState(false)
  const [lastDirection, setLastDirection] = useState<'left' | 'right' | null>(null)

  // Iniciar nova rodada com 20 cards (9 humanos, 6 IA, 5 IA fingindo)
  const startNewGame = useCallback(() => {
    const roundCards = generate20CardRound()
    setCards(roundCards)
    setCurrentIndex(0)
    setAnswers([])
    setLastDirection(null)
    setGameState('playing')
  }, [])

  // Registrar voto
  const handleVote = useCallback(
    async (choice: 'IA' | 'Humano') => {
      setLastDirection(choice === 'IA' ? 'left' : 'right')
      if (currentIndex >= cards.length) return

      const currentCard = cards[currentIndex]
      // Regra de acerto:
      // Se era Humano -> Acerta se votou Humano
      // Se era IA ou IA fingindo -> Acerta se votou IA (pois a essência foi gerada por IA)
      const isActualAI =
        currentCard.author === 'IA' ||
        currentCard.author === 'IA fingindo ser humano'
      const isCorrect = isActualAI ? choice === 'IA' : choice === 'Humano'

      const newRecord: VoteRecord = {
        rowId: currentCard.row, // ID = Linha na planilha
        sentiment: currentCard.sentiment,
        actualAuthor: currentCard.author,
        userChoice: choice,
        isCorrect,
        timestamp: Date.now(),
      }

      const updatedAnswers = [...answers, newRecord]
      setAnswers(updatedAnswers)

      // Feedback háptico
      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(30)
        } catch {
          // Ignore
        }
      }

      if (currentIndex + 1 >= cards.length) {
        // Fim da rodada -> salvar dados de todos os participantes!
        const correctCount = updatedAnswers.filter((a) => a.isCorrect).length
        const humanCards = updatedAnswers.filter(
          (a) => a.actualAuthor === 'Humano'
        )
        const aiCards = updatedAnswers.filter((a) => a.actualAuthor === 'IA')
        const aiDeceptiveCards = updatedAnswers.filter(
          (a) => a.actualAuthor === 'IA fingindo ser humano'
        )

        const sessionPayload: ParticipantSession = {
          id: 'sess_' + Math.random().toString(36).substring(2, 9),
          completedAt: Date.now(),
          totalCards: TOTAL_CARDS,
          correctCount,
          wrongCount: TOTAL_CARDS - correctCount,
          humanCards: humanCards.length,
          humanCorrect: humanCards.filter((a) => a.isCorrect).length,
          aiCards: aiCards.length,
          aiCorrect: aiCards.filter((a) => a.isCorrect).length,
          aiDeceptiveCards: aiDeceptiveCards.length,
          aiDeceptiveCorrect: aiDeceptiveCards.filter((a) => a.isCorrect).length,
          votes: updatedAnswers,
        }

        // Salva na nuvem/storage
        saveSession(sessionPayload).catch((err) =>
          console.error('Erro ao salvar sessão:', err)
        )

        setTimeout(() => {
          setGameState('results')
        }, 300)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    },
    [cards, currentIndex, answers]
  )

  // Atalhos de teclado no Desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || view !== 'app') return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleVote('IA')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleVote('Humano')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, view, handleVote])

  // Disparo de confetti nos resultados
  useEffect(() => {
    if (gameState === 'results') {
      const correctCount = answers.filter((a) => a.isCorrect).length
      if (correctCount >= 11) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#18181b', '#71717a', '#d4d4d8'],
        })
      }
    }
  }, [gameState, answers])

  // Estatísticas da rodada do participante
  const correctCount = answers.filter((a) => a.isCorrect).length
  const wrongCount = answers.length - correctCount
  const percentage = Math.round((correctCount / TOTAL_CARDS) * 100)

  // Segmentação solicitada: Separar em IA e Humanos
  const humanAnswers = answers.filter((a) => a.actualAuthor === 'Humano')
  const humanCorrect = humanAnswers.filter((a) => a.isCorrect).length

  // IA total (6 padrão + 5 fingindo = 11)
  const aiStandardAnswers = answers.filter((a) => a.actualAuthor === 'IA')
  const aiStandardCorrect = aiStandardAnswers.filter((a) => a.isCorrect).length

  // As 5 em que a IA foi MUITO instruída a fingir ser humano
  const aiDeceptiveAnswers = answers.filter(
    (a) => a.actualAuthor === 'IA fingindo ser humano'
  )
  const aiDeceptiveCorrect = aiDeceptiveAnswers.filter((a) => a.isCorrect).length // Usuário descobriu que era IA
  const aiDeceptiveFooled = aiDeceptiveAnswers.filter((a) => !a.isCorrect).length // Usuário achou que era humano!

  // Compartilhar resultado
  const handleShare = () => {
    const text = `🤖 IA ou Humano? • Teste dos Sentimentos
Acertei: ${correctCount}/${TOTAL_CARDS} (${percentage}%)
• Textos Humanos: ${humanCorrect}/${humanAnswers.length} reconhecidos
• Textos de IA Padrão: ${aiStandardCorrect}/${aiStandardAnswers.length} identificados
• IA Disfarçada de Humano: A IA me enganou em ${aiDeceptiveFooled} de ${aiDeceptiveAnswers.length} questões! 🎭
Você consegue distinguir? 💭`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  // Se o usuário clicou no Admin
  if (view === 'admin') {
    return <AdminDashboard onBack={() => setView('app')} />
  }

  return (
    <div className="fixed inset-0 h-[100dvh] w-full flex flex-col justify-between items-center bg-[#F7F7F8] px-4 py-2.5 sm:py-4 select-none text-zinc-900 overflow-hidden touch-none">
      {/* Top Header */}
      <header className="w-full max-w-sm flex items-center justify-between py-1.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs tracking-tight">
            VS
          </div>
          <span className="font-bold tracking-tight text-sm text-zinc-900">
            IA ou Humano?
          </span>
        </div>

        {/* Botão de Admin discreto */}
        <button
          onClick={() => setView('admin')}
          className="text-[11px] font-medium tracking-wide text-zinc-500 hover:text-zinc-900 px-2.5 py-1 bg-zinc-200/60 hover:bg-zinc-200 rounded-full transition-colors flex items-center gap-1"
          title="Área do Professor / Administrador"
        >
          <Lock className="w-3 h-3 text-zinc-500" />
          <span>Admin</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-sm flex-1 flex flex-col justify-center items-center my-auto overflow-hidden">
        {/* TELA DE INTRO */}
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col text-center max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y"
          >
            <div className="w-12 h-12 sm:w-13 sm:h-13 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 text-zinc-800 shrink-0">
              <BrainCircuit className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mb-1">
              O Teste dos Sentimentos
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4 sm:mb-5">
              Será que a inteligência artificial consegue imitar com perfeição a
              vulnerabilidade humana?
            </p>

            {/* Como funciona */}
            <div className="bg-zinc-50 rounded-2xl p-3.5 sm:p-4 text-left border border-zinc-100/80 mb-4 sm:mb-5 space-y-2.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Dinâmica da Rodada
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-xs text-zinc-600 leading-normal">
                  Você responderá a <strong className="text-zinc-900">20 cartões</strong> sorteados sobre emoções reais e sintetizadas.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-zinc-600 leading-normal">
                  <div className="flex items-center gap-1 font-medium text-zinc-800">
                    <ChevronLeft className="w-3.5 h-3.5" /> Esquerda = 🤖 Gerado por IA
                  </div>
                  <div className="flex items-center gap-1 font-medium text-zinc-800 mt-0.5">
                    <ChevronRight className="w-3.5 h-3.5" /> Direita = 👤 Escrito por Humano
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-xs text-zinc-600 leading-normal">
                  No fim, você verá a análise detalhada separando IA e Humanos, e uma revelação surpreendente sobre os modelos!
                </p>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="w-full py-3.5 sm:py-4 px-6 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white font-semibold rounded-2xl text-sm transition-all shadow-md shadow-zinc-900/10 flex items-center justify-center gap-2 shrink-0"
            >
              Iniciar Rodada (20 Cards)
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* TELA DE JOGO (SWIPE TINDER) */}
        {gameState === 'playing' && (
          <div className="w-full h-full flex flex-col justify-between items-center py-1">
            {/* Barra de Progresso */}
            <div className="w-full mb-2 px-1 shrink-0">
              <div className="flex justify-between items-center text-xs font-medium text-zinc-500 mb-1.5">
                <span>Progresso</span>
                <span>
                  {currentIndex + 1} de {TOTAL_CARDS}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-zinc-900 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentIndex + 1) / TOTAL_CARDS) * 100}%`,
                  }}
                  transition={{ duration: 0.25 }}
                />
              </div>
            </div>

            {/* Deck de Cards Estilo Tinder */}
            <div className="relative w-full flex-1 max-h-[420px] min-h-[300px] h-[390px] sm:h-[420px] my-1 touch-none">
              <AnimatePresence custom={lastDirection}>
                {cards
                  .slice(currentIndex, currentIndex + 2)
                  .map((card, idx) => {
                    const actualIndex = currentIndex + idx
                    const isTop = idx === 0
                    return (
                      <TinderCard
                        key={card.id + '_' + actualIndex}
                        item={card}
                        onSwipe={handleVote}
                        isTop={isTop}
                        index={actualIndex}
                        total={TOTAL_CARDS}
                        activeDirection={lastDirection}
                      />
                    )
                  })}
              </AnimatePresence>
            </div>

            {/* Botões de Ação Inferiores (Mobile / Desktop) */}
            <div className="w-full flex items-center justify-center gap-3 sm:gap-4 mt-3 mb-1 shrink-0">
              {/* Botão Votar IA */}
              <button
                onClick={() => handleVote('IA')}
                className="flex-1 py-3.5 px-4 bg-white hover:bg-zinc-50 active:scale-95 rounded-2xl border border-zinc-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2.5 transition-all text-zinc-800 group"
                aria-label="Votar Inteligência Artificial"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/80 transition-colors shrink-0">
                  <Bot className="w-4 h-4 text-zinc-700" />
                </div>
                <span className="text-sm sm:text-base font-bold leading-tight">É IA</span>
              </button>

              {/* Botão Votar Humano */}
              <button
                onClick={() => handleVote('Humano')}
                className="flex-1 py-3.5 px-4 bg-white hover:bg-zinc-50 active:scale-95 rounded-2xl border border-zinc-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2.5 transition-all text-zinc-800 group"
                aria-label="Votar Humano"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/80 transition-colors shrink-0">
                  <User className="w-4 h-4 text-zinc-700" />
                </div>
                <span className="text-sm sm:text-base font-bold leading-tight">É Humano</span>
              </button>
            </div>
          </div>
        )}

        {/* TELA DE RESULTADOS */}
        {gameState === 'results' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-3xl p-5 sm:p-7 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col text-center max-h-[85dvh] overflow-y-auto overscroll-contain touch-pan-y"
          >
            {/* Ícone de Resultado */}
            <div className="w-14 h-14 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-3 text-zinc-900 border border-zinc-200/60 shadow-inner">
              <Award className="w-7 h-7" />
            </div>

            <div className="text-[10px] uppercase font-semibold tracking-widest text-zinc-400 mb-1">
              Resultado Final
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">
              {percentage}% de Precisão
            </h2>
            <p className="text-xs text-zinc-500 mb-4">
              Você acertou <strong>{correctCount}</strong> e errou{' '}
              <strong>{wrongCount}</strong> de 20 cartões.
            </p>

            {/* SEPARAÇÃO: IA vs HUMANOS */}
            <div className="space-y-3 mb-4 text-left">
              {/* Bloco Humanos */}
              <div className="bg-zinc-50 border border-zinc-200/70 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                    <User className="w-3.5 h-3.5 text-zinc-700" />
                    Textos de Humanos (9 cards)
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    {humanCorrect} / 9
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">
                  Você reconheceu com sucesso {humanCorrect} textos e achou que{' '}
                  {9 - humanCorrect} tinham sido gerados por IA.
                </p>
              </div>

              {/* Bloco IA Padrão */}
              <div className="bg-zinc-50 border border-zinc-200/70 rounded-2xl p-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-800">
                    <Bot className="w-3.5 h-3.5 text-zinc-700" />
                    Textos de IA Padrão (6 cards)
                  </div>
                  <span className="text-xs font-bold text-zinc-900">
                    {aiStandardCorrect} / 6
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-tight">
                  Você identificou {aiStandardCorrect} como IA e foi enganado em{' '}
                  {6 - aiStandardCorrect}.
                </p>
              </div>

              {/* REVELAÇÃO: IA MUITO INSTRUÍDA A FINGIR SER HUMANO */}
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 text-amber-950">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                  <Flame className="w-4 h-4 text-amber-600" />
                  A Revelação: IA em Modo Camaleão!
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed mb-2">
                  Em <strong>5 questões</strong> desta sua rodada, a IA foi{' '}
                  <strong className="underline decoration-amber-400">MUITO instruída</strong> a
                  fingir ser um ser humano, usando relatos confessionais e
                  imperfeições realistas.
                </p>
                <div className="bg-white/80 rounded-xl p-2.5 flex items-center justify-between text-xs border border-amber-200/60">
                  <span className="text-amber-900 font-medium">
                    A IA conseguiu te enganar em:
                  </span>
                  <span className="font-extrabold text-amber-800 text-sm">
                    {aiDeceptiveFooled} de 5 ({aiDeceptiveCorrect} desmascaradas)
                  </span>
                </div>
              </div>
            </div>

            {/* Aviso da Dinâmica: O Mistério Individual Continua */}
            <div className="p-3 bg-zinc-100/70 rounded-xl mb-4 flex items-start gap-2 text-left">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                <strong className="text-zinc-800">Regra da dinâmica:</strong> As frases individuais continuam secretas para manter o debate vivo com o restante da turma!
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-2">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white font-semibold rounded-2xl text-xs sm:text-sm transition-all shadow-md shadow-zinc-900/10 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Jogar Nova Rodada (20 Cards)
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 px-6 bg-white hover:bg-zinc-50 active:scale-[0.98] text-zinc-700 font-medium rounded-2xl text-xs border border-zinc-200 transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-zinc-900" />
                    Copiado para a Área de Transferência!
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    Copiar Resumo para a Turma
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer Minimalista */}
      <footer className="w-full max-w-sm text-center py-2 text-[11px] text-zinc-400">
        Arraste no celular 👈 IA | Humano 👉
      </footer>
    </div>
  )
}
