import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(8, {
    message: 'Min password length is 8 characters',
  })
  @IsString()
  password: string;
}
