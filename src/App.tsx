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
  Info,
  Check,
  Award
} from 'lucide-react'
import { SENTIMENTOS_DATABASE, SentimentText } from './data/sentimentos'

const ROUND_SIZE = 15

// Função para embaralhar e pegar 15 itens
function getRandomRound(): SentimentText[] {
  const shuffled = [...SENTIMENTOS_DATABASE].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, ROUND_SIZE)
}

interface AnswerRecord {
  item: SentimentText
  userChoice: 'IA' | 'Humano'
  isCorrect: boolean
}

// Componente para o Card individual com física de Swipe
interface TinderCardProps {
  item: SentimentText
  onSwipe: (choice: 'IA' | 'Humano') => void
  isTop: boolean
  index: number
  total: number
}

function TinderCard({ item, onSwipe, isTop, index, total }: TinderCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-250, 250], [-18, 18])
  const opacity = useTransform(x, [-350, -150, 0, 150, 350], [0, 1, 1, 1, 0])

  // Indicadores de carimbo (stamp)
  const iaStampOpacity = useTransform(x, [-160, -30], [1, 0])
  const iaStampScale = useTransform(x, [-160, -30], [1.1, 0.8])

  const humanStampOpacity = useTransform(x, [30, 160], [0, 1])
  const humanStampScale = useTransform(x, [30, 160], [0.8, 1.1])

  const handleDragEnd = (_: any, info: any) => {
    const swipeThreshold = 90
    const velocityThreshold = 400

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      onSwipe('IA')
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      onSwipe('Humano')
    }
  }

  return (
    <motion.div
      style={{
        x: isTop ? x : 0,
        rotate: isTop ? rotate : 0,
        opacity: isTop ? opacity : 1,
        zIndex: total - index,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.95, y: 15, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{
        x: x.get() < 0 ? -450 : 450,
        rotate: x.get() < 0 ? -25 : 25,
        opacity: 0,
        transition: { duration: 0.25, ease: 'easeOut' }
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`absolute inset-0 w-full h-full bg-white rounded-3xl p-7 flex flex-col justify-between 
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
      <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100/90 text-zinc-700">
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
      <div className="flex-1 flex items-center justify-center py-6 px-1">
        <p className="font-serif-text text-xl sm:text-2xl text-zinc-800 leading-relaxed sm:leading-loose text-center font-normal">
          &ldquo;{item.text}&rdquo;
        </p>
      </div>

      {/* Rodapé do Card: Dica de Ação */}
      <div className="pt-4 border-t border-zinc-100/80 flex items-center justify-between text-[11px] text-zinc-400 uppercase tracking-wider font-medium">
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
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro')
  const [cards, setCards] = useState<SentimentText[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [copied, setCopied] = useState(false)

  // Iniciar nova rodada
  const startNewGame = useCallback(() => {
    const roundCards = getRandomRound()
    setCards(roundCards)
    setCurrentIndex(0)
    setAnswers([])
    setGameState('playing')
  }, [])

  // Registrar voto
  const handleVote = useCallback(
    (choice: 'IA' | 'Humano') => {
      if (currentIndex >= cards.length) return

      const currentCard = cards[currentIndex]
      const isCorrect = currentCard.author === choice

      setAnswers((prev) => [
        ...prev,
        {
          item: currentCard,
          userChoice: choice,
          isCorrect,
        },
      ])

      if ('vibrate' in navigator) {
        try {
          navigator.vibrate(30)
        } catch {
          // Ignore
        }
      }

      if (currentIndex + 1 >= cards.length) {
        // Fim da rodada
        setTimeout(() => {
          setGameState('results')
        }, 300)
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    },
    [cards, currentIndex]
  )

  // Atalhos de teclado (Desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleVote('IA')
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleVote('Humano')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState, handleVote])

  // Disparo de confetti nos resultados
  useEffect(() => {
    if (gameState === 'results') {
      const correctCount = answers.filter((a) => a.isCorrect).length
      if (correctCount >= 8) {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#18181b', '#71717a', '#a1a1aa'],
        })
      }
    }
  }, [gameState, answers])

  // Estatísticas da rodada
  const correctCount = answers.filter((a) => a.isCorrect).length
  const wrongCount = answers.length - correctCount
  const totalIA = answers.filter((a) => a.item.author === 'IA').length
  const totalHumano = answers.filter((a) => a.item.author === 'Humano').length
  const percentage = Math.round((correctCount / ROUND_SIZE) * 100)

  // Compartilhar resultado
  const handleShare = () => {
    const text = `🤖 IA ou Humano? - Desafio dos Sentimentos
Acertei: ${correctCount}/${ROUND_SIZE} (${percentage}%)
Erros: ${wrongCount}
Na minha rodada havia ${totalIA} textos de IA e ${totalHumano} de Humanos!
Será que você consegue distinguir a máquina do coração? 💭`

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      })
    }
  }

  return (
    <div className="min-h-[100dvh] w-full flex flex-col justify-between items-center bg-[#F7F7F8] px-4 py-5 select-none text-zinc-900">
      {/* Top Header */}
      <header className="w-full max-w-sm flex items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-xs tracking-tight">
            VS
          </div>
          <span className="font-bold tracking-tight text-sm text-zinc-900">
            IA ou Humano?
          </span>
        </div>
        <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 bg-zinc-200/70 text-zinc-600 rounded-full">
          Edição Dinâmica
        </span>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-sm flex-1 flex flex-col justify-center items-center my-auto">
        {gameState === 'intro' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white rounded-3xl p-7 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col text-center"
          >
            <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-zinc-800">
              <Sparkles className="w-7 h-7" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2">
              O Teste dos Sentimentos
            </h1>
            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
              Você consegue discernir o que brota da alma humana do que foi
              sintetizado por inteligência artificial?
            </p>

            {/* Como funciona */}
            <div className="bg-zinc-50 rounded-2xl p-4 text-left border border-zinc-100/80 mb-6 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Como Funciona
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-xs text-zinc-600 leading-normal">
                  Você receberá <strong className="text-zinc-900">15 cartões</strong> com depoimentos sobre diversos sentimentos.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-zinc-600 leading-normal">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800">
                    <ChevronLeft className="w-3.5 h-3.5" /> Esquerda = 🤖 Gerado por IA
                  </div>
                  <div className="flex items-center gap-1.5 font-medium text-zinc-800 mt-1">
                    <ChevronRight className="w-3.5 h-3.5" /> Direita = 👤 Escrito por Humano
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-white border border-zinc-200 text-zinc-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-xs text-zinc-600 leading-normal">
                  No final, veja sua pontuação e a proporção de cada um, mantendo o mistério de cada frase!
                </p>
              </div>
            </div>

            <button
              onClick={startNewGame}
              className="w-full py-4 px-6 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white font-semibold rounded-2xl text-sm transition-all shadow-md shadow-zinc-900/10 flex items-center justify-center gap-2"
            >
              Começar Dinâmica
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full flex flex-col items-center">
            {/* Barra de Progresso */}
            <div className="w-full mb-4 px-1">
              <div className="flex justify-between items-center text-xs font-medium text-zinc-500 mb-1.5">
                <span>Progresso</span>
                <span>
                  {currentIndex + 1} de {ROUND_SIZE}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200/70 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-zinc-900 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentIndex + 1) / ROUND_SIZE) * 100}%`,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Deck de Cards Estilo Tinder */}
            <div className="relative w-full h-[410px] sm:h-[430px] my-1">
              <AnimatePresence>
                {cards
                  .slice(currentIndex, currentIndex + 2)
                  .map((card, idx) => {
                    const actualIndex = currentIndex + idx
                    const isTop = idx === 0
                    return (
                      <TinderCard
                        key={card.id}
                        item={card}
                        onSwipe={handleVote}
                        isTop={isTop}
                        index={actualIndex}
                        total={ROUND_SIZE}
                      />
                    )
                  })}
              </AnimatePresence>
            </div>

            {/* Botões de Ação Inferiores (Mobile/Desktop) */}
            <div className="w-full flex items-center justify-center gap-5 mt-5">
              {/* Botão Votar IA */}
              <button
                onClick={() => handleVote('IA')}
                className="flex-1 py-3.5 px-4 bg-white hover:bg-zinc-50 active:scale-95 rounded-2xl border border-zinc-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2.5 transition-all text-zinc-800 group"
                aria-label="Votar Inteligência Artificial"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/80 transition-colors">
                  <Bot className="w-4 h-4 text-zinc-700" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Esquerda
                  </div>
                  <div className="text-sm font-bold leading-tight">É IA</div>
                </div>
              </button>

              {/* Botão Votar Humano */}
              <button
                onClick={() => handleVote('Humano')}
                className="flex-1 py-3.5 px-4 bg-white hover:bg-zinc-50 active:scale-95 rounded-2xl border border-zinc-200/90 shadow-[0_4px_12px_rgba(0,0,0,0.04)] flex items-center justify-center gap-2.5 transition-all text-zinc-800 group"
                aria-label="Votar Humano"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200/80 transition-colors">
                  <User className="w-4 h-4 text-zinc-700" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">
                    Direita
                  </div>
                  <div className="text-sm font-bold leading-tight">É Humano</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {gameState === 'results' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white rounded-3xl p-7 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.06)] border border-zinc-100 flex flex-col text-center"
          >
            {/* Ícone de Resultado */}
            <div className="w-16 h-16 bg-zinc-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-zinc-900 border border-zinc-200/60 shadow-inner">
              <Award className="w-8 h-8" />
            </div>

            <div className="text-xs uppercase font-semibold tracking-widest text-zinc-400 mb-1">
              Resultado Final
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 mb-1">
              {percentage}% de Precisão
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              {percentage >= 70
                ? 'Impressionante! Sua intuição para emoções é muito afiada.'
                : percentage >= 50
                ? 'Muito bom! A linha entre o artificial e o humano está sutil.'
                : 'A inteligência artificial conseguiu te enganar na maioria!'}
            </p>

            {/* Placar Acertos vs Erros */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Acertos
                </span>
                <span className="text-2xl font-bold text-zinc-900">
                  {correctCount}{' '}
                  <span className="text-xs text-zinc-400 font-normal">
                    / {ROUND_SIZE}
                  </span>
                </span>
              </div>
              <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-3.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Erros
                </span>
                <span className="text-2xl font-bold text-zinc-900">
                  {wrongCount}{' '}
                  <span className="text-xs text-zinc-400 font-normal">
                    / {ROUND_SIZE}
                  </span>
                </span>
              </div>
            </div>

            {/* Composição da Rodada (Quantos eram IA e quantos eram Humanos) */}
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 mb-4 text-left">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" /> Composição desta rodada
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-zinc-700 py-1 border-b border-zinc-200/50">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-zinc-500" /> Textos gerados por IA:
                </span>
                <span className="font-bold text-zinc-900">{totalIA}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-medium text-zinc-700 py-1 pt-1.5">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-500" /> Textos escritos por Humanos:
                </span>
                <span className="font-bold text-zinc-900">{totalHumano}</span>
              </div>
            </div>

            {/* Aviso da Dinâmica: O Segredo é Mantido */}
            <div className="p-3 bg-zinc-100/70 rounded-xl mb-6 flex items-start gap-2.5 text-left">
              <CheckCircle2 className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                <strong className="text-zinc-800">Regra da dinâmica:</strong> Para manter o debate e a discussão na sala, não revelamos individualmente quais cards eram de IA ou Humanos.
              </p>
            </div>

            {/* Ações */}
            <div className="space-y-2.5">
              <button
                onClick={startNewGame}
                className="w-full py-3.5 px-6 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white font-semibold rounded-2xl text-sm transition-all shadow-md shadow-zinc-900/10 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Jogar Nova Rodada
              </button>

              <button
                onClick={handleShare}
                className="w-full py-3 px-6 bg-white hover:bg-zinc-50 active:scale-[0.98] text-zinc-700 font-medium rounded-2xl text-xs border border-zinc-200 transition-all flex items-center justify-center gap-2"
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
        Arraste com o dedo no celular ou use as setas do teclado 👈 👉
      </footer>
    </div>
  )
}
