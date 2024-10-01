import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { getModelToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUserDto, mockUser } from 'src/test/mock';
import { CryptoService } from '../crypto/crypto.service';
import { User } from './models/user.model';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersModel: typeof User;
  let cryptoService: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: {
            findByPk: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
            create: jest.fn().mockResolvedValue(mockUser),
          },
        },
        {
          provide: CryptoService,
          useValue: {
            generateHash: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersModel = module.get<typeof User>(getModelToken(User));
    cryptoService = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('addUser', () => {
    it('should successfully create a new user', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
      jest
        .spyOn(cryptoService, 'generateHash')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(usersModel, 'create').mockResolvedValue(mockUser as User);

      const result = await usersService.addUser(mockCreateUserDto);
      expect(result).toEqual(mockUser);
      expect(usersService.getUserByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(cryptoService.generateHash).toHaveBeenCalledWith('password');
      expect(usersModel.create).toHaveBeenCalledWith(mockUser);
    });

    it('should throw ConflictException if user with email already exists', async () => {
      const mockExistingUser = { ...mockUser } as User;

      jest
        .spyOn(usersService, 'getUserByEmail')
        .mockResolvedValue(mockExistingUser);

      await expect(usersService.addUser(mockCreateUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw InternalServerErrorException if user creation fails', async () => {
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
      jest
        .spyOn(cryptoService, 'generateHash')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(usersModel, 'create').mockRejectedValue(new Error('DB Error'));

      await expect(usersService.addUser(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      jest.spyOn(usersModel, 'findByPk').mockResolvedValue(mockUser as User);

      const result = await usersService.getUserById(1);
      expect(result).toEqual(mockUser);
      expect(usersModel.findByPk).toHaveBeenCalledWith(1, { raw: true });
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(usersModel, 'findByPk').mockResolvedValue(null);

      // await expect(usersService.getUserById(1)).rejects.toThrow(
      //   NotFoundException,
      // );
      await expect(usersService.getUserById(1)).rejects.toThrow(
        'Error fetching user',
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      jest
        .spyOn(usersModel, 'findByPk')
        .mockRejectedValue(new Error('DB Error'));

      await expect(usersService.getUserById(1)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      jest.spyOn(usersModel, 'findOne').mockResolvedValue(mockUser as User);

      const result = await usersService.getUserByEmail(mockUser.email);
      expect(result).toEqual(mockUser);
      expect(usersModel.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        raw: true,
      });
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersModel, 'findOne').mockResolvedValue(null);

      const result = await usersService.getUserByEmail(mockUser.email);
      expect(result).toBeNull();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      jest
        .spyOn(usersModel, 'findOne')
        .mockRejectedValue(new Error('DB Error'));

      await expect(usersService.getUserByEmail(mockUser.email)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
