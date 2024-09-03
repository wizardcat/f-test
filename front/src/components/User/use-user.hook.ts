import { useAuth } from '@app/providers/auth.provider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useUser = () => {
  const { user, accessToken, refreshAccessToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
    console.log('dasdsadasdasd');
    if (!accessToken) refreshAccessToken();
    // if (!userData) {
    //   navigate('/login');
    // } else if (!accessToken) {
    //   refreshAccessToken();
    // }
  }, [user, accessToken, refreshAccessToken, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return {
    user,
    handleLogout,
  };
};
