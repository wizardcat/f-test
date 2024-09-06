import { useAuthContext } from '@app/hooks/use-auth-context.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export const useLogin = () => {
  const { authLogin } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    authLogin(data.email, data.password);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
