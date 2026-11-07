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

const LOCAL_STORAGE_KEY = 'ia_humano_firebase_config'

export function getStoredFirebaseConfig(): FirebaseConfig | null {
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

  // Fallback para variáveis de ambiente Vite (caso configuradas na Vercel)
  const envConfig: FirebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  }

  if (envConfig.projectId && envConfig.apiKey) {
    return envConfig
  }

  return null
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
  if (!config) return null

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
