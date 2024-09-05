import { constants } from 'src/common/constants';
import { User } from './models/user.model';

const { USERS_PROVIDER } = constants.moduleProviders;

export const usersProviders = [
  {
    provide: USERS_PROVIDER,
    useValue: User,
  },
];
