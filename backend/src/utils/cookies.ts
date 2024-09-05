import { Request } from 'express';

export const cookieConfig = {
  refreshToken: {
    name: 'refreshToken',
    options: {
      // for production:
      // path: '/auth/api/refresh-tokens',
      path: '/',
      httpOnly: true,
      sameSite: 'strict' as const,
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    },
  },
};

export const extractRefreshTokenFromCookies = (req: Request) => {
  const cookies = req.headers.cookie?.split('; ');

  if (!cookies?.length) {
    return null;
  }

  const refreshTokenCookie = cookies.find((cookie) =>
    cookie.startsWith(`${cookieConfig.refreshToken.name}=`),
  );

  if (!refreshTokenCookie) {
    return null;
  }
  const refreshToken = refreshTokenCookie.split('=')[1] as string;

  return refreshToken;
};
