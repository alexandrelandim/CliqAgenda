import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  onboardingCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock user with completed onboarding
    setUser({
      id: '1',
      name: 'Usuário Demo',
      email,
      phone: '(11) 99999-9999',
      onboardingCompleted: true,
    });
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser({
      id: Date.now().toString(),
      name,
      email,
      phone,
      onboardingCompleted: false,
    });
  };

  const logout = () => {
    setUser(null);
  };

  const completeOnboarding = () => {
    if (user) {
      setUser({ ...user, onboardingCompleted: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, completeOnboarding }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
