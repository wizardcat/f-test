import { useAuth } from '@app/providers/auth.provider';
import { useNavigate } from 'react-router-dom';

export const User = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  if (!auth.userData) {
    return <p>User is not logged in</p>;
  }

  return (
    <div>
      <h2>User Information</h2>
      <p>ID: {auth.userData.user.id}</p>
      <p>Email: {auth.userData.user.email}</p>
      <p>Name: {auth.userData.user.name}</p>
      <p>Phone: {auth.userData.user.phone}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
