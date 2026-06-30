import bcrypt from 'bcryptjs';
import {
  userExistsByEmail,
  createUser,
  findUserByEmailWithPassword,
  findUserById,
} from '../repositories/user.repository';
import { generateTokenPair, verifyRefreshToken } from '../utilities/token.util';
import { AppError } from '../middleware/error.middleware';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, APP_CONSTANTS } from '../constants/app.constants';
import { AuthResponse, RegisterInput, LoginInput } from '../types/auth.types';

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const exists = await userExistsByEmail(input.email);
  if (exists) {
    throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.DUPLICATE_EMAIL);
  }

  const hashedPassword = await bcrypt.hash(input.password, APP_CONSTANTS.BCRYPT_SALT_ROUNDS);

  const user = await createUser({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    ...tokens,
  };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const user = await findUserByEmailWithPassword(input.email);
  if (!user) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);
  if (!isPasswordValid) {
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const tokens = generateTokenPair({
    userId: user._id.toString(),
    email: user.email,
  });

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    ...tokens,
  };
};

export const refreshToken = async (
  token: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const payload = verifyRefreshToken(token);
    const user = await findUserById(payload.userId);

    if (!user) {
      throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
    }

    return generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.INVALID_TOKEN);
  }
};

export { SUCCESS_MESSAGES };
