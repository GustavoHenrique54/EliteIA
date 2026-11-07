import { SENTIMENTOS_DATABASE } from '../data/sentimentos'
import { SentimentText } from '../types'

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

/**
 * Cria uma rodada exatamente com:
 * - 9 de Humanos
 * - 6 de IA (padrão)
 * - 5 de IA fingindo ser humano
 * Total: 20 cards embaralhados
 */
export function generate20CardRound(): SentimentText[] {
  const humanos = SENTIMENTOS_DATABASE.filter((item) => item.author === 'Humano')
  const ias = SENTIMENTOS_DATABASE.filter((item) => item.author === 'IA')
  const iasFingindo = SENTIMENTOS_DATABASE.filter(
    (item) => item.author === 'IA fingindo ser humano'
  )

  const selectedHumanos = shuffleArray(humanos).slice(0, 9)
  const selectedIAs = shuffleArray(ias).slice(0, 6)
  const selectedIAsFingindo = shuffleArray(iasFingindo).slice(0, 5)

  const combined = [
    ...selectedHumanos,
    ...selectedIAs,
    ...selectedIAsFingindo,
  ]

  return shuffleArray(combined)
}

