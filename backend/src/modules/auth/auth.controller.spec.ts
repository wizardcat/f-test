import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { UsersService } from 'src/modules/users/users.service';
import { mockCreateUserDto, mockRequest, mockTokens } from 'src/test/mock';
import { User } from '../users/models/user.model';
import { UserResponse } from '../users/transformers/user.response.transformer';
import { AuthRefreshTokenService } from './auth-refresh-token.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;
  let usersService: UsersService;
  let authRefreshTokenService: AuthRefreshTokenService;
  let mockResponse: Partial<Response>;

  beforeEach(async () => {
    mockResponse = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      header: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(),
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

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    authRefreshTokenService = module.get<AuthRefreshTokenService>(
      AuthRefreshTokenService,
    );
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user and set refresh token cookie', async () => {
      jest.spyOn(authService, 'register').mockResolvedValue(mockTokens);

      const result = await authController.register(
        mockCreateUserDto,
        mockResponse as Response,
      );

      expect(authService.register).toHaveBeenCalledWith(mockCreateUserDto);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.anything(),
      );
      expect(result).toEqual({ accessToken: mockTokens.accessToken });
    });
  });

  describe('login', () => {
    it('should log in a user and set refresh token cookie', async () => {
      jest.spyOn(authService, 'login').mockResolvedValue(mockTokens);

      const result = await authController.login(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(authService.login).toHaveBeenCalledWith(mockRequest.user);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.anything(),
      );
      expect(result).toEqual({ accessToken: mockTokens.accessToken });
    });
  });

  describe('profile', () => {
    it('should return user profile and set cache-control header', async () => {
      const mockUser = { id: 1 };
      const mockUserResponse = new UserResponse(mockUser);

      jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValue(mockUser as User);

      const result = await authController.profile(
        mockUser as Express.User,
        mockResponse as Response,
      );

      expect(usersService.getUserById).toHaveBeenCalledWith(mockUser.id);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'Cache-Control',
        'no-store',
      );
      expect(result).toEqual(mockUserResponse);
    });

    it('should throw InternalServerErrorException if authUser is invalid', async () => {
      const mockInvalidUser = { id: null };

      await expect(
        authController.profile(
          mockInvalidUser as Express.User,
          mockResponse as Response,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('refreshTokens', () => {
    it('should refresh tokens and set new refresh token cookie', async () => {
      jest
        .spyOn(authRefreshTokenService, 'generateTokenPair')
        .mockResolvedValue(mockTokens);

      const result = await authController.refreshTokens(
        mockRequest as Request,
        mockResponse as Response,
      );

      expect(authRefreshTokenService.generateTokenPair).toHaveBeenCalledWith(
        mockRequest.user,
        'old_refresh_token',
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.anything(),
      );
      expect(result).toEqual({ accessToken: mockTokens.accessToken });
    });

    it('should throw InternalServerErrorException if no user is found in request', async () => {
      const mockRequest = { user: null } as Request;

      await expect(
        authController.refreshTokens(mockRequest, mockResponse as Response),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('clearAuthCookie', () => {
    it('should clear the auth cookie', () => {
      authController.clearAuthCookie(mockResponse as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('refreshToken');
    });
  });
});
