import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Op } from 'sequelize';
import { CryptoService } from 'src/modules/crypto/crypto.service';
import { User } from 'src/modules/users/models/user.model';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthRefreshToken } from './models/auth-refresh-token.model';

describe('AuthRefreshTokenService', () => {
  let authRefreshTokenService: AuthRefreshTokenService;
  let jwtService: JwtService;
  let cryptoService: CryptoService;
  let authRefreshTokenModel: typeof AuthRefreshToken;
  let usersModel: typeof User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRefreshTokenService,
        JwtService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_REFRESH_SECRET') {
                return 'test_refresh_secret';
              }
              return null;
            }),
          },
        },
        CryptoService,
        {
          provide: getModelToken(AuthRefreshToken),
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: getModelToken(User),
          useValue: {
            findByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    authRefreshTokenService = module.get<AuthRefreshTokenService>(
      AuthRefreshTokenService,
    );
    jwtService = module.get<JwtService>(JwtService);
    cryptoService = module.get<CryptoService>(CryptoService);
    authRefreshTokenModel = module.get<typeof AuthRefreshToken>(
      getModelToken(AuthRefreshToken),
    );
    usersModel = module.get<typeof User>(getModelToken(User));
  });

  describe('generateTokenPair', () => {
    it('should throw InternalServerErrorException if user is not found', async () => {
      const mockUser = { id: 1 } as Express.User;
      jest.spyOn(usersModel, 'findByPk').mockResolvedValue(null);

      await expect(
        authRefreshTokenService.generateTokenPair(mockUser),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should return accessToken and refreshToken', async () => {
      const mockUser = { id: 1 } as Express.User;
      const mockAccessToken = 'access_token';
      const mockRefreshToken = 'refresh_token';

      jest.spyOn(usersModel, 'findByPk').mockResolvedValue(mockUser as User);
      jest
        .spyOn(jwtService, 'sign')
        .mockReturnValueOnce(mockAccessToken)
        .mockReturnValueOnce(mockRefreshToken);
      jest
        .spyOn(authRefreshTokenService, 'generateRefreshToken')
        .mockResolvedValue(mockRefreshToken);

      const result = await authRefreshTokenService.generateTokenPair(mockUser);

      expect(result.accessToken).toBe(mockAccessToken);
      expect(result.refreshToken).toBe(mockRefreshToken);
    });
  });

  describe('generateRefreshToken', () => {
    it('should return new refresh token', async () => {
      const mockUser = { id: 1 } as Express.User;
      const mockRefreshToken = 'refresh_token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(mockRefreshToken);

      const result =
        await authRefreshTokenService.generateRefreshToken(mockUser);

      expect(result).toBe(mockRefreshToken);
    });

    it('should throw UnauthorizedException if refresh token is blacklisted', async () => {
      const mockUser = { id: 1 } as Express.User;
      const currentRefreshToken = 'current_refresh_token';
      const currentRefreshTokenExpiresAt = new Date();
      const hashedRefreshToken = 'hashed_refresh_token';

      jest
        .spyOn(cryptoService, 'generateSha256HashBase64')
        .mockReturnValue(hashedRefreshToken);
      // jest.spyOn(service, 'isRefreshTokenBlackListed').mockResolvedValue(true);
      jest
        .spyOn(authRefreshTokenService, 'isRefreshTokenBlackListed' as any)
        .mockResolvedValue(true);
      await expect(
        authRefreshTokenService.generateRefreshToken(
          mockUser,
          currentRefreshToken,
          currentRefreshTokenExpiresAt,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should store refresh token in the database', async () => {
      const mockUser = { id: 1 } as Express.User;
      const currentRefreshToken = 'current_refresh_token';
      const currentRefreshTokenExpiresAt = new Date();
      const hashedRefreshToken = 'hashed_refresh_token';

      jest
        .spyOn(cryptoService, 'generateSha256HashBase64')
        .mockReturnValue(hashedRefreshToken);
      jest
        .spyOn(authRefreshTokenService, 'isRefreshTokenBlackListed' as any)
        .mockResolvedValue(false);
      jest.spyOn(authRefreshTokenModel, 'create').mockResolvedValue({});

      await authRefreshTokenService.generateRefreshToken(
        mockUser,
        currentRefreshToken,
        currentRefreshTokenExpiresAt,
      );

      expect(authRefreshTokenModel.create).toHaveBeenCalledWith({
        hashedRefreshToken,
        expiresAt: currentRefreshTokenExpiresAt,
        userId: mockUser.id,
      });
    });
  });

  describe('isRefreshTokenBlackListed', () => {
    it('should return refresh token if found in the database', async () => {
      const hashedRefreshToken = 'hashed_refresh_token';
      const userId = 1;

      jest
        .spyOn(authRefreshTokenModel, 'findOne')
        .mockResolvedValue({} as User);

      const result = await (
        authRefreshTokenService as any
      ).isRefreshTokenBlackListed(hashedRefreshToken, userId);

      expect(result).toBeDefined();
    });

    it('should return null if refresh token is not found', async () => {
      const hashedRefreshToken = 'hashed_refresh_token';
      const userId = 1;

      jest.spyOn(authRefreshTokenModel, 'findOne').mockResolvedValue(null);

      const result = await (
        authRefreshTokenService as any
      ).isRefreshTokenBlackListed(hashedRefreshToken, userId);

      expect(result).toBeNull();
    });
  });

  describe('clearExpiredRefreshTokens', () => {
    it('should delete expired refresh tokens', async () => {
      jest.spyOn(authRefreshTokenModel, 'destroy').mockResolvedValue(1);

      await authRefreshTokenService.clearExpiredRefreshTokens();

      expect(authRefreshTokenModel.destroy).toHaveBeenCalledWith({
        where: {
          expiresAt: {
            [Op.lte]: expect.any(Date),
          },
        },
      });
    });
  });
});
