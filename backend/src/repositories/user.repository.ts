import mongoose from 'mongoose';
import { IUser, User } from '../models/user.model';

export async function createUser(data: Pick<IUser, 'name' | 'email' | 'password'>): Promise<IUser> {
  const user = new User(data);
  return user.save();
}

export async function findUserById(id: string): Promise<IUser | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findById(id).exec();
}

export async function findUserByIdWithPassword(id: string): Promise<IUser | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findById(id).select('+password').exec();
}

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() }).exec();
}

export async function findUserByEmailWithPassword(email: string): Promise<IUser | null> {
  return User.findOne({ email: email.toLowerCase() }).select('+password').exec();
}

export async function updateUser(
  id: string,
  data: Partial<Pick<IUser, 'name' | 'email'>>,
): Promise<IUser | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
}

export async function updateUserPassword(id: string, hashedPassword: string): Promise<boolean> {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  const result = await User.findByIdAndUpdate(id, { $set: { password: hashedPassword } }).exec();
  return result !== null;
}

export async function userExistsByEmail(email: string): Promise<boolean> {
  const count = await User.countDocuments({ email: email.toLowerCase() }).exec();
  return count > 0;
}
