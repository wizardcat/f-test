import { configuration } from '@app/common/config';
import { User } from '@app/common/interfaces';
import { accessTokenStore } from '@app/store/access-token.store';
import axios from 'axios';

let debouncedPromise: Promise<unknown> | null;
let debouncedResolve: (...args: unknown[]) => void;
let debouncedReject: (...args: unknown[]) => void;
let timeout: ReturnType<typeof setTimeout>;

export const useAuthApi = () => {
  const { baseApiUri } = configuration;

  const register = async (user: User) => {
    const { data } = await axios.post(
      `${baseApiUri}/api/v1/auth/register`,
      user,
      { withCredentials: true },
    );

    accessTokenStore.setAccessToken(data.access_token);
    return data;
  };

  const login = async (email: string, password: string) => {
    const { data } = await axios.post(
      `${baseApiUri}/api/v1/auth/login`,
      {
        email,
        password,
      },
      { withCredentials: true },
    );
    accessTokenStore.setAccessToken(data.access_token);

    return data;
  };

  const clearAuthCookie = async () => {
    const { data } = await axios.post(
      `${baseApiUri}/api/v1/auth/clear-auth-cookie`,
      {
        withCredentials: true,
      },
    );
    return data;
  };

  const logout = () => {
    accessTokenStore.removeAccessToken();
    return clearAuthCookie();
  };

  const refreshTokens = async () => {
    clearTimeout(timeout);
    if (!debouncedPromise) {
      debouncedPromise = new Promise((resolve, reject) => {
        debouncedResolve = resolve;
        debouncedReject = reject;
      });
    }

    timeout = setTimeout(() => {
      const executeLogic = async () => {
        const { data } = await axios.post(
          `${baseApiUri}/api/v1/auth/refresh-tokens`,
          {
            withCredentials: true,
          },
        );

        accessTokenStore.setAccessToken(data.access_token);
      };

      executeLogic().then(debouncedResolve).catch(debouncedReject);

      debouncedPromise = null;
    }, 200);

    return debouncedPromise;
  };

  const getUserProfile = async (
    authFalseCallback: () => void,
  ): Promise<User | undefined> => {
    const authToken = accessTokenStore.getAccessToken();
    if (!authToken) {
      throw new Error('No authorization token found');
    }

    try {
      const { data } = await axios.get(`${baseApiUri}/api/v1/auth/profile`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      return data;
    } catch (e: any) {
      if (e?.status === 401) {
        try {
          await refreshTokens();
        } catch (e) {
          authFalseCallback();
          throw e;
        }
        return await getUserProfile(authFalseCallback);
      }
    }
  };

  const getUserById = async (
    id: number,
    authFalseCallback: () => void,
  ): Promise<User | undefined> => {
    const authToken = accessTokenStore.getAccessToken();
    if (!authToken) {
      throw new Error('No authorization token found');
    }
    try {
      const { data } = await axios.get(`${baseApiUri}/api/v1/users/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${authToken}` },
      });

      return data;
    } catch (e: any) {
      if (e?.status === 401) {
        try {
          await refreshTokens();
        } catch (e) {
          authFalseCallback();
          throw e;
        }
        return await getUserById(id, authFalseCallback);
      }
    }
  };

  return { register, login, logout, getUserProfile, getUserById };
};
