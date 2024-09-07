import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/modules/users/models/user.model';

@Table({ tableName: 'auth_refresh_tokens' })
export class AuthRefreshToken extends Model<AuthRefreshToken> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'hashed_refresh_token',
  })
  hashedRefreshToken: string;

  @Column({ type: DataType.DATE, allowNull: false, field: 'expires_at' })
  expiresAt: Date;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false, field: 'user_id' })
  userId: number;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;
}
