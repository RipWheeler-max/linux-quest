import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, getUserProgress } from '../services/firebase';
import type { UserProgress } from '../types';

interface AuthContextType {
  user: User | null;
  progress: UserProgress | null;
  loading: boolean;
  refreshProgress: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  progress: null,
  loading: false,
  refreshProgress: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProgress = async () => {
    if (user) {
      try {
        const userProgress = await getUserProgress(user.uid);
        setProgress(userProgress);
      } catch (error) {
        console.error('Failed to refresh progress:', error);
      }
    }
  };

  useEffect(() => {
    // 立即设置loading为false，不让它卡住
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      if (user) {
        try {
          const userProgress = await getUserProgress(user.uid);
          setProgress(userProgress);
        } catch (error) {
          console.error('Failed to get user progress:', error);
          setProgress(null);
        }
      } else {
        setProgress(null);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, progress, loading, refreshProgress }}>
      {children}
    </AuthContext.Provider>
  );
};
