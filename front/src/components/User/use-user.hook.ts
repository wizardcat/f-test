import { User } from '@app/common/interfaces';
import { useAuthContext } from '@app/hooks/use-auth-context.hook';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const [user, setUser] = useState<User>({} as User);
  const { isAuthenticated, authLogout, getUser } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    const getUserData = async () => {
      const userData = await getUser();
      setUser(userData);
    };
    getUserData();
  }, [isAuthenticated, navigate, getUser]);

  const handleLogout = () => {
    authLogout();
    navigate('/login');
  };

  return {
    user,
    handleLogout,
  };
};
