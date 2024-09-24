import { User } from '@app/common/interfaces';
import { useAuthContext } from '@app/hooks/use-auth-context.hook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { isAuthenticated, authLogout, getUser } = useAuthContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const getUserData = async () => {
      setIsLoading(true);
      const userData = await getUser();
      setIsLoading(false);
      setUser(userData);
    };
    getUserData();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    authLogout();
  };

  return {
    user,
    handleLogout,
    isLoading,
  };
};
