import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUserDto, mockUser, wrongCredentials } from 'src/test/mock';
import { CryptoService } from '../crypto/crypto.service';
import { User } from '../users/models/user.model';
import { UsersService } from '../users/users.service';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let cryptoService: CryptoService;
  let authRefreshTokenService: AuthRefreshTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            addUser: jest.fn(),
            getUserByEmail: jest.fn(),
          },
        },
        {
          provide: CryptoService,
          useValue: {
            verifyHash: jest.fn(),
          },
        },
        {
          provide: AuthRefreshTokenService,
          useValue: {
            generateTokenPair: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    cryptoService = module.get<CryptoService>(CryptoService);
    authRefreshTokenService = module.get<AuthRefreshTokenService>(
      AuthRefreshTokenService,
    );
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should throw InternalServerErrorException if email or password is missing', async () => {
      const mockCreateUserDtoMissed = {
        ...mockCreateUserDto,
        email: undefined,
        password: undefined,
      };

      await expect(
        authService.register(mockCreateUserDtoMissed),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('should call UsersService.addUser and AuthRefreshTokenService.generateTokenPair', async () => {
      jest.spyOn(usersService, 'addUser').mockResolvedValue(mockUser as User);
      jest
        .spyOn(authRefreshTokenService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        });

      const result = await authService.register(mockCreateUserDto);

      expect(usersService.addUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(authRefreshTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockUser,
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });
  });

  describe('login', () => {
    it('should throw InternalServerErrorException if user id is not provided', async () => {
      const mockUser = { id: null } as Express.User;

      await expect(authService.login(mockUser)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should call AuthRefreshTokenService.generateTokenPair', async () => {
      const mockUser = { id: 1 } as Express.User;
      jest
        .spyOn(authRefreshTokenService, 'generateTokenPair')
        .mockResolvedValue({
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        });

      const result = await authService.login(mockUser);

      expect(authRefreshTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockUser,
      );
      expect(result).toEqual({
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      });
    });
  });

  describe('validateUser', () => {
    it('should return null if user does not exist', async () => {
      const email = wrongCredentials.email;
      const password = wrongCredentials.password;
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      const result = await authService.validateUser(email, password);

      expect(usersService.getUserByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null if password does not match', async () => {
      const email = wrongCredentials.email;
      const password = wrongCredentials.password;

      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValue(mockUser as User);
      jest.spyOn(cryptoService, 'verifyHash').mockResolvedValue(false);

      const result = await authService.validateUser(email, password);

      expect(cryptoService.verifyHash).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toBeNull();
    });

    it('should return user if password matches', async () => {
      const email = wrongCredentials.email;
      const password = wrongCredentials.password;

      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValue(mockUser as User);
      jest.spyOn(cryptoService, 'verifyHash').mockResolvedValue(true);

      const result = await authService.validateUser(email, password);

      expect(cryptoService.verifyHash).toHaveBeenCalledWith(
        password,
        mockUser.password,
      );
      expect(result).toEqual(mockUser);
    });
  });
});
