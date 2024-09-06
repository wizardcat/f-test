import { useAuthContext } from '@app/hooks/use-auth-context.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Bounce, toast } from 'react-toastify';
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type UserSchemaType = z.infer<typeof UserSchema>;

export const useRegister = () => {
  const { isAuthenticated, registerUser } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserSchemaType>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = async (data: UserSchemaType) => {
    registerUser(data);
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/user');

    toast.error('Register failed!', {
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
