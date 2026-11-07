export type AuthorType = 'IA' | 'Humano' | 'IA fingindo ser humano';

export interface SentimentText {
  id: number; // Número da Linha na planilha (2 a 114)
  row: number; // Número da Linha na planilha
  sentiment: string;
  author: AuthorType;
  text: string;
}

export interface VoteRecord {
  rowId: number;
  sentiment: string;
  actualAuthor: AuthorType;
  userChoice: 'IA' | 'Humano';
  isCorrect: boolean;
  timestamp: number;
}

export interface ParticipantSession {
  id: string;
  completedAt: number;
  totalCards: number;
  correctCount: number;
  wrongCount: number;
  // Detalhamento
  humanCards: number;
  humanCorrect: number;
  aiCards: number;
  aiCorrect: number;
  aiDeceptiveCards: number; // IA fingindo ser humano
  aiDeceptiveCorrect: number; // Usuário percebeu que era IA
  votes: VoteRecord[];
}

export interface TextStats {
  rowId: number;
  text: string;
  sentiment: string;
  author: AuthorType;
  totalVotes: number;
  correctVotes: number;
  wrongVotes: number;
  accuracyRate: number; // % de acertos
  fooledRate?: number; // % das vezes que acharam que IA era humano
}

export interface CategoryStats {
  sentiment: string;
  totalVotes: number;
  correctVotes: number;
  wrongVotes: number;
  accuracyRate: number;
}
