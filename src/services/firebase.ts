import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import type { UserProgress } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyBE7s1ax4tvCAuzRAUrfEB3PruASSSVvq0",
  authDomain: "linux-quest-95b89.firebaseapp.com",
  projectId: "linux-quest-95b89",
  storageBucket: "linux-quest-95b89.firebasestorage.app",
  messagingSenderId: "961247747106",
  appId: "1:961247747106:web:4f0ff0b61eeb335fa1fe7b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Auth functions
export const registerUser = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // 创建用户进度文档
  await initializeUserProgress(userCredential.user.uid);
  return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore functions
export const initializeUserProgress = async (userId: string) => {
  const defaultProgress: UserProgress = {
    userId,
    completedLevels: [],
    currentLevel: 1,
    totalPlayTime: 0,
    hintsUsed: {},
    achievements: [],
    lastLoginAt: new Date(),
    createdAt: new Date()
  };
  await setDoc(doc(db, 'userProgress', userId), defaultProgress);
  return defaultProgress;
};

export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const docRef = doc(db, 'userProgress', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as UserProgress;
  }
  return null;
};

export const updateUserProgress = async (userId: string, updates: Partial<UserProgress>) => {
  const docRef = doc(db, 'userProgress', userId);
  await updateDoc(docRef, updates);
};

export const completeLevel = async (userId: string, levelId: number) => {
  const progress = await getUserProgress(userId);
  if (progress && !progress.completedLevels.includes(levelId)) {
    const completedLevels = [...progress.completedLevels, levelId];
    const currentLevel = Math.max(progress.currentLevel, levelId + 1);
    await updateUserProgress(userId, { completedLevels, currentLevel });
  }
};

export const useHint = async (userId: string, levelId: number) => {
  const progress = await getUserProgress(userId);
  if (progress) {
    const hintsUsed = { ...progress.hintsUsed };
    hintsUsed[levelId] = (hintsUsed[levelId] || 0) + 1;
    await updateUserProgress(userId, { hintsUsed });
  }
};

export const resetProgress = async (userId: string) => {
  const defaultProgress: UserProgress = {
    userId,
    completedLevels: [],
    currentLevel: 1,
    totalPlayTime: 0,
    hintsUsed: {},
    achievements: [],
    lastLoginAt: new Date(),
    createdAt: new Date()
  };
  await setDoc(doc(db, 'userProgress', userId), defaultProgress);
  return defaultProgress;
};
