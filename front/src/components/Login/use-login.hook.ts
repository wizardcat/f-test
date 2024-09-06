import { useAuthContext } from '@app/hooks/use-auth-context.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
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

  const { isAuthenticated, authLogin } = useAuthContext();
  const navigate = useNavigate();

  const onSubmit = async (data: LoginSchemaType) => {
    authLogin(data.email, data.password);
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/user');

    toast.error('Login failed!', {
      position: 'bottom-center',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
      transition: Bounce,
    });
  }, [isAuthenticated, navigate]);

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
