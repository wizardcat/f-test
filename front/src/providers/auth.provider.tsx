import { User } from '@app/common/interfaces';
import { useAuthApi } from '@app/hooks/use-auth-api.hook';
import { createContext, ReactNode, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  registerUser: (user: User) => Promise<void>;
  authLogin: (email: string, password: string) => Promise<void>;
  authLogout: () => void;
  getUser: () => Promise<any>;
  // getUserProfile: (authFalseCallback: () => void) => Promise<any>;
  // getUserById: (id: number, authFalseCallback: () => void) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { register, login, logout, getUserProfile } = useAuthApi();

  const registerUser = async (user: User) => {
    try {
      await register(user);
      setIsAuthenticated(true);
    } catch (e) {
      throw Error('Error registering user');
    }
  };

  const authLogin = async (email: string, password: string) => {
    try {
      await login(email, password);

      setIsAuthenticated(true);
    } catch (e) {
      setIsAuthenticated(false);
      throw e;
    }
  };

  const authLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  const getUser = async () => {
    // const user = await getUserProfile(() => {
    //   setIsAuthenticated(false);
    // });
    return getUserProfile(() => {
      setIsAuthenticated(false);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        registerUser,
        authLogin,
        authLogout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
