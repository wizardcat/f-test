import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ type: String, example: 'Qp5w6@example.com' })
  email: string;

  @MinLength(8, {
    message: 'Min password length is 8 characters',
  })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: '1234',
  })
  password: string;
}
