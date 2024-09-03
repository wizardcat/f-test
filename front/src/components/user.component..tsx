import { useAuth } from '@app/providers/auth.provider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const User = () => {
  const { user: userData, accessToken, refreshAccessToken, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log({ userData, accessToken });
    if (!userData) {
      navigate('/login');
    } else if (!accessToken) {
      refreshAccessToken();
    }
  }, [userData, accessToken, refreshAccessToken, navigate]);

  // if (!userData) return <div>Loading...</div>;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!userData) {
    return <p>User is not logged in</p>;
  }

  return (
    <div>
      <h2>User Information</h2>
      <p>ID: {userData.id}</p>
      <p>Email: {userData.email}</p>
      <p>Name: {userData.name}</p>
      <p>Phone: {userData.phone}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
