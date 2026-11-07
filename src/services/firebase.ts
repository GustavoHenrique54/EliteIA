import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

// Configuração padrão vinculada do projeto EliteIA
export const DEFAULT_FIREBASE_CONFIG: FirebaseConfig = {
  apiKey: "AIzaSyBi7SNywUhq5O7TMvJYYNW2qmXYTE0OmpM",
  authDomain: "eliteia-3b7b6.firebaseapp.com",
  projectId: "eliteia-3b7b6",
  storageBucket: "eliteia-3b7b6.firebasestorage.app",
  messagingSenderId: "694607726010",
  appId: "1:694607726010:web:9b0053378c18b6e2d48983",
}

const LOCAL_STORAGE_KEY = 'ia_humano_firebase_config'

export function getStoredFirebaseConfig(): FirebaseConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed.projectId && parsed.apiKey) {
        return parsed
      }
    }
  } catch {
    // Ignore error
  }

  // Fallback para variáveis de ambiente Vite ou a configuração oficial
  const envConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || DEFAULT_FIREBASE_CONFIG.apiKey,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || DEFAULT_FIREBASE_CONFIG.authDomain,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || DEFAULT_FIREBASE_CONFIG.projectId,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || DEFAULT_FIREBASE_CONFIG.storageBucket,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || DEFAULT_FIREBASE_CONFIG.messagingSenderId,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || DEFAULT_FIREBASE_CONFIG.appId,
  }

  return envConfig
}

export function saveFirebaseConfig(config: FirebaseConfig) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config))
}

export function clearFirebaseConfig() {
  localStorage.removeItem(LOCAL_STORAGE_KEY)
}

let dbInstance: Firestore | null = null

export function getDb(): Firestore | null {
  const config = getStoredFirebaseConfig()
  if (!config || !config.apiKey || !config.projectId) return null

  try {
    const app = getApps().length === 0 ? initializeApp(config) : getApp()
    if (!dbInstance) {
      dbInstance = getFirestore(app)
    }
    return dbInstance
  } catch (err) {
    console.error('Erro ao inicializar Firebase:', err)
    return null
  }
}
