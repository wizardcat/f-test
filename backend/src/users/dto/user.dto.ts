import { IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from '../user.model';

export class UserDto implements Partial<User> {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  phone?: string;
}
