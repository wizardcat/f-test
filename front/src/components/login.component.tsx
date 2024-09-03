import { useAuth } from '@app/providers/auth.provider';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const [email, setEmail] = useState('test@test.ttt');
  const [password, setPassword] = useState('12345678');
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate('/user');
    }
  }, [navigate, user]);

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};
