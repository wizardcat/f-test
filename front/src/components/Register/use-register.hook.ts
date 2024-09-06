import { useAuthContext } from '@app/hooks/use-auth-context.hook';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

type UserSchemaType = z.infer<typeof UserSchema>;

export const useRegister = () => {
  const { registerUser } = useAuthContext();

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

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
