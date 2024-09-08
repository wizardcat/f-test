import { Exclude } from 'class-transformer';

export class UserResponse {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponse>) {
    Object.assign(this, partial);
  }
}
