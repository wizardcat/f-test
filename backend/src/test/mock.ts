import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export const mockUser = {
  id: 1,
  name: 'John Silver',
  email: 'john@example.com',
  phone: '1234567890',
  password: 'hashedPassword',
};

export const wrongCredentials = {
  email: 'wrong@example.com',
  password: 'wrongpassword',
};

export const mockTokens = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
};

export const mockCreateUserDto: CreateUserDto = {
  ...mockUser,
  password: 'password',
};

export const mockRequest = {
  user: { id: 1 },
  headers: { cookie: 'refreshToken=old_refresh_token' },
};
