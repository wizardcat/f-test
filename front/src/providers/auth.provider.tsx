import { errorMessage } from '@app/common/errorMessage';
import { User } from '@app/common/interfaces';
import { useAuthApi } from '@app/hooks/use-auth-api.hook';
import { accessTokenStore } from '@app/store/access-token.store';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const token = accessTokenStore.getAccessToken();
  const [isAuthenticated, setIsAuthenticated] = useState(token ? true : false);
  const { register, login, logout, getUserProfile } = useAuthApi();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login' || location.pathname === '/register') {
      return;
    }

    if (token) {
      navigate('/user');
    } else {
      navigate('/login');
    }
  }, [navigate, location.pathname, token]);

  const registerUser = async (user: User) => {
    try {
      await register(user);
      setIsAuthenticated(true);
      navigate('/user');
    } catch (e) {
      errorMessage('Error registering user');
      // throw Error('Error registering user');
    }
  };

  const authLogin = async (email: string, password: string) => {
    try {
      await login(email, password);

      setIsAuthenticated(true);
      navigate('/user');
    } catch (e) {
      errorMessage('Error logging in');
    }
  };

  const authLogout = () => {
    logout();
    setIsAuthenticated(false);
    navigate('/login');
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
