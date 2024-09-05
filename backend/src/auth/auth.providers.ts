import { constants } from 'src/common/constants';
import { AuthRefreshToken } from './models/auth-refresh-token.model';

const { AUTH_PROVIDER } = constants.moduleProviders;

export const authProviders = [
  {
    provide: AUTH_PROVIDER,
    useValue: AuthRefreshToken,
  },
];
