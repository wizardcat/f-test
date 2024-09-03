import { useAuth } from '@app/providers/auth.provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const { user, login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchemaType) => {
    await login(data.email, data.password);
  };

  useEffect(() => {
    if (user) {
      navigate('/user');
    }
  }, [user, navigate]);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
