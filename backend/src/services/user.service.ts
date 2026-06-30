import bcrypt from 'bcryptjs';
import {
  findUserById,
  findUserByEmail,
  updateUser,
  findUserByIdWithPassword,
  updateUserPassword,
} from '../repositories/user.repository';
import { AppError } from '../middleware/error.middleware';
import { HTTP_STATUS } from '../constants/http.constants';
import { ERROR_MESSAGES, APP_CONSTANTS } from '../constants/app.constants';
import { UpdateProfileInput } from '../validators/user.validator';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const getProfile = async (userId: string): Promise<UserProfile> => {
  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const updateProfile = async (
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> => {
  if (input.email) {
    const existing = await findUserByEmail(input.email);
    if (existing && existing._id.toString() !== userId) {
      throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.DUPLICATE_EMAIL);
    }
  }

  const user = await updateUser(userId, input);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<void> => {
  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new AppError(HTTP_STATUS.BAD_REQUEST, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(newPassword, APP_CONSTANTS.BCRYPT_SALT_ROUNDS);
  await updateUserPassword(userId, hashedPassword);
};
