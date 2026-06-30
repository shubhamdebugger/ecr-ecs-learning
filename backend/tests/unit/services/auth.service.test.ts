import bcrypt from 'bcryptjs';
import * as authService from '../../../src/services/auth.service';
import * as userRepository from '../../../src/repositories/user.repository';
import { generateTokenPair } from '../../../src/utilities/token.util';
import { AppError } from '../../../src/middleware/error.middleware';

jest.mock('../../../src/repositories/user.repository');
jest.mock('../../../src/utilities/token.util');
jest.mock('bcryptjs');

const mockUserRepo = userRepository as jest.Mocked<typeof userRepository>;
const mockGenerateTokenPair = generateTokenPair as jest.MockedFunction<typeof generateTokenPair>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('auth service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerInput = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123',
    };

    it('should register a new user successfully', async () => {
      const mockUser = {
        _id: { toString: () => 'user-id-123' },
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepo.userExistsByEmail.mockResolvedValue(false);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      mockUserRepo.createUser.mockResolvedValue(mockUser as never);
      mockGenerateTokenPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authService.register(registerInput);

      expect(result.user.email).toBe(registerInput.email);
      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(mockUserRepo.userExistsByEmail).toHaveBeenCalledWith(registerInput.email);
    });

    it('should throw conflict error if email already exists', async () => {
      mockUserRepo.userExistsByEmail.mockResolvedValue(true);

      await expect(authService.register(registerInput)).rejects.toThrow(AppError);
      await expect(authService.register(registerInput)).rejects.toMatchObject({
        statusCode: 409,
      });
    });
  });

  describe('login', () => {
    const loginInput = {
      email: 'john@example.com',
      password: 'Password123',
    };

    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        _id: { toString: () => 'user-id-123' },
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepo.findUserByEmailWithPassword.mockResolvedValue(mockUser as never);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockGenerateTokenPair.mockReturnValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });

      const result = await authService.login(loginInput);

      expect(result.user.email).toBe(loginInput.email);
      expect(result.accessToken).toBe('access-token');
    });

    it('should throw unauthorized if user not found', async () => {
      mockUserRepo.findUserByEmailWithPassword.mockResolvedValue(null);

      await expect(authService.login(loginInput)).rejects.toThrow(AppError);
      await expect(authService.login(loginInput)).rejects.toMatchObject({
        statusCode: 401,
      });
    });

    it('should throw unauthorized if password is incorrect', async () => {
      const mockUser = {
        _id: { toString: () => 'user-id-123' },
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashed-password',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepo.findUserByEmailWithPassword.mockResolvedValue(mockUser as never);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(loginInput)).rejects.toMatchObject({ statusCode: 401 });
    });
  });
});
