import { User } from '@app/common/interfaces';
import { createContext, ReactNode, useContext, useState } from 'react';

export interface UserData {
  user: User;
  accessToken?: string;
}

interface AuthContextProps {
  userData: UserData | null;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const login = async (userData: { email: string; password: string }) => {
    try {
      const response = await fetch(
        'http://localhost:3001/api/v1/auth/sign-in',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to log in');
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setUserData(null);
  };

  return (
    <AuthContext.Provider value={{ userData: userData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
