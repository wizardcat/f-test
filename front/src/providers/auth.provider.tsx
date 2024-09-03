import { User } from '@app/common/interfaces';
import axios from 'axios';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { configuration } from '../common/config';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const { baseApiUri } = configuration;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );

  useEffect(() => {
    if (!accessToken) {
      localStorage.removeItem('accessToken');
      return;
    }

    localStorage.setItem('accessToken', accessToken);
    axios
      .get<User>(`${baseApiUri}/api/v1/users/profile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        setUser({ ...response.data });
      })
      .catch(() => {
        localStorage.removeItem('accessToken');
      });
  }, [accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post(`${baseApiUri}/api/v1/auth/sign-in`, {
        email,
        password,
      });
      setAccessToken(data.accessToken);
      setUser({ ...data.user, token: data.accessToken });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        `${baseApiUri}/api/v1/auth/refresh-token`,
      );
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error('Refresh token error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, login, logout, refreshAccessToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
