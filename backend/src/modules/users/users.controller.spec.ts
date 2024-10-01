import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mockCreateUserDto, mockUser } from 'src/test/mock';
import { UserResponse } from './transformers/user.response.transformer';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;
  const userId = '1';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            addUser: jest.fn().mockResolvedValue(mockUser),
            getUserById: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('addUser', () => {
    it('should call UsersService.addUser with CreateUserDto and return the result', async () => {
      const result = await usersController.addUser(mockCreateUserDto);
      expect(usersService.addUser).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if CreateUserDto is invalid', async () => {
      //TODO - e2e test for invalid CreateUserDto
    });
  });

  describe('getUserById', () => {
    it('should call UsersService.getUserById with correct id and return a UserResponse', async () => {
      const result = await usersController.getUserById(userId);
      expect(usersService.getUserById).toHaveBeenCalledWith(+userId);
      expect(result).toEqual(new UserResponse(mockUser));
    });

    it('should handle user not found scenario', async () => {
      jest
        .spyOn(usersService, 'getUserById')
        .mockRejectedValue(new NotFoundException('User not found'));
      await expect(usersController.getUserById(userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('should handle service errors properly', async () => {
      jest
        .spyOn(usersService, 'getUserById')
        .mockRejectedValue(new Error('Database error'));
      await expect(usersController.getUserById(userId)).rejects.toThrow(
        'Database error',
      );
    });
  });
});
