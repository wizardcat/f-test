import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export const mockUser = {
  id: 1,
  name: 'John Silver',
  email: 'john@example.com',
  phone: '1234567890',
  password: 'hashedPassword',
};

export const mockCreateUserDto: CreateUserDto = {
  ...mockUser,
  password: 'password',
};
