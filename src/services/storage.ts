import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { getDb } from './firebase'
import {
  ParticipantSession,
  CategoryStats,
  TextStats,
  AuthorType,
} from '../types'
import { SENTIMENTOS_DATABASE } from '../data/sentimentos'

const LOCAL_SESSIONS_KEY = 'ia_humano_local_sessions'

/**
 * Salva a sessão de um participante (na nuvem se Firebase ativo, e sempre em cache local)
 */
export async function saveSession(session: ParticipantSession): Promise<boolean> {
  // 1. Salva localmente
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY)
    const existing: ParticipantSession[] = raw ? JSON.parse(raw) : []
    existing.push(session)
    localStorage.setItem(LOCAL_SESSIONS_KEY, JSON.stringify(existing))
  } catch (err) {
    console.warn('Erro ao salvar localmente:', err)
  }

  // 2. Tenta salvar no Firebase Firestore
  const db = getDb()
  if (db) {
    try {
      await addDoc(collection(db, 'sessions'), {
        ...session,
        syncedAt: Date.now(),
      })
      return true
    } catch (err) {
      console.error('Erro ao enviar sessão para o Firestore:', err)
      return false
    }
  }

  return true
}

/**
 * Carrega todas as sessões salvas
 */
export async function loadAllSessions(): Promise<{
  sessions: ParticipantSession[]
  isCloud: boolean
}> {
  const db = getDb()
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'sessions'))
      const cloudSessions: ParticipantSession[] = []
      snap.forEach((docItem) => {
        cloudSessions.push(docItem.data() as ParticipantSession)
      })
      return { sessions: cloudSessions, isCloud: true }
    } catch (err) {
      console.error('Falha ao ler do Firestore, usando fallback local:', err)
    }
  }

  // Fallback Local
  try {
    const raw = localStorage.getItem(LOCAL_SESSIONS_KEY)
    const localSessions: ParticipantSession[] = raw ? JSON.parse(raw) : []
    return { sessions: localSessions, isCloud: false }
  } catch {
    return { sessions: [], isCloud: false }
  }
}

/**
 * Apaga todas as sessões (para reiniciar dados de uma nova turma)
 */
export async function resetAllSessions(): Promise<void> {
  localStorage.removeItem(LOCAL_SESSIONS_KEY)
  const db = getDb()
  if (db) {
    try {
      const snap = await getDocs(collection(db, 'sessions'))
      const deletePromises = snap.docs.map((d) => deleteDoc(doc(db, 'sessions', d.id)))
      await Promise.all(deletePromises)
    } catch (err) {
      console.error('Erro ao limpar Firestore:', err)
    }
  }
}

/**
 * Calcula estatísticas consolidadas por categoria e por texto individual
 */
export function calculateAggregatedStats(sessions: ParticipantSession[]) {
  const totalParticipants = sessions.length
  let totalVotes = 0
  let totalCorrect = 0
  let totalWrong = 0

  // Por Tipo de autor
  const authorTypeStats: Record<
    AuthorType,
    { total: number; correct: number; wrong: number }
  > = {
    Humano: { total: 0, correct: 0, wrong: 0 },
    IA: { total: 0, correct: 0, wrong: 0 },
    'IA fingindo ser humano': { total: 0, correct: 0, wrong: 0 },
  }

  // Mapa por Categoria
  const categoryMap = new Map<
    string,
    { total: number; correct: number; wrong: number }
  >()

  // Mapa por Linha da Planilha (ID)
  const textMap = new Map<
    number,
    { total: number; correct: number; wrong: number }
  >()

  for (const session of sessions) {
    totalVotes += session.totalCards
    totalCorrect += session.correctCount
    totalWrong += session.wrongCount

    for (const vote of session.votes) {
      // Tipo de autor
      const aType = vote.actualAuthor
      if (authorTypeStats[aType]) {
        authorTypeStats[aType].total += 1
        if (vote.isCorrect) {
          authorTypeStats[aType].correct += 1
        } else {
          authorTypeStats[aType].wrong += 1
        }
      }

      // Categoria
      const catEntry = categoryMap.get(vote.sentiment) || {
        total: 0,
        correct: 0,
        wrong: 0,
      }
      catEntry.total += 1
      if (vote.isCorrect) catEntry.correct += 1
      else catEntry.wrong += 1
      categoryMap.set(vote.sentiment, catEntry)

      // Texto (Linha da Planilha)
      const textEntry = textMap.get(vote.rowId) || {
        total: 0,
        correct: 0,
        wrong: 0,
      }
      textEntry.total += 1
      if (vote.isCorrect) textEntry.correct += 1
      else textEntry.wrong += 1
      textMap.set(vote.rowId, textEntry)
    }
  }

  // Lista de Categorias
  const categories: CategoryStats[] = Array.from(categoryMap.entries())
    .map(([sentiment, data]) => ({
      sentiment,
      totalVotes: data.total,
      correctVotes: data.correct,
      wrongVotes: data.wrong,
      accuracyRate: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes)

  // Lista de Textos com Linha da Planilha como ID
  const textStats: TextStats[] = SENTIMENTOS_DATABASE.map((item) => {
    const data = textMap.get(item.id) || { total: 0, correct: 0, wrong: 0 }
    const accuracyRate =
      data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    // fooledRate: taxa em que o participante achou que era humano quando era IA
    const fooledRate =
      item.author !== 'Humano' && data.total > 0
        ? Math.round((data.wrong / data.total) * 100)
        : 0

    return {
      rowId: item.id,
      text: item.text,
      sentiment: item.sentiment,
      author: item.author,
      totalVotes: data.total,
      correctVotes: data.correct,
      wrongVotes: data.wrong,
      accuracyRate,
      fooledRate,
    }
  })

  return {
    totalParticipants,
    totalVotes,
    totalCorrect,
    totalWrong,
    overallAccuracy:
      totalVotes > 0 ? Math.round((totalCorrect / totalVotes) * 100) : 0,
    authorTypeStats: {
      Humano: {
        ...authorTypeStats.Humano,
        accuracy:
          authorTypeStats.Humano.total > 0
            ? Math.round(
                (authorTypeStats.Humano.correct /
                  authorTypeStats.Humano.total) *
                  100
              )
            : 0,
      },
      IA: {
        ...authorTypeStats.IA,
        accuracy:
          authorTypeStats.IA.total > 0
            ? Math.round(
                (authorTypeStats.IA.correct / authorTypeStats.IA.total) * 100
              )
            : 0,
      },
      'IA fingindo ser humano': {
        ...authorTypeStats['IA fingindo ser humano'],
        accuracy:
          authorTypeStats['IA fingindo ser humano'].total > 0
            ? Math.round(
                (authorTypeStats['IA fingindo ser humano'].correct /
                  authorTypeStats['IA fingindo ser humano'].total) *
                  100
              )
            : 0,
        fooledRate:
          authorTypeStats['IA fingindo ser humano'].total > 0
            ? Math.round(
                (authorTypeStats['IA fingindo ser humano'].wrong /
                  authorTypeStats['IA fingindo ser humano'].total) *
                  100
              )
            : 0,
      },
    },
    categories,
    textStats,
  }
}
