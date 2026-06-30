import mongoose from 'mongoose';
import { config } from '../config/app.config';
import { logger } from '../logger/logger';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) {
    logger.info('Using existing database connection');
    return;
  }

  try {
    const connection = await mongoose.connect(config.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    logger.info({ host: connection.connection.host }, 'MongoDB connected successfully');

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      logger.error({ err }, 'MongoDB connection error');
    });

    mongoose.connection.on('reconnected', () => {
      isConnected = true;
      logger.info('MongoDB reconnected');
    });
  } catch (error) {
    logger.error({ error }, 'Failed to connect to MongoDB');
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  if (!isConnected) return;

  try {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected gracefully');
  } catch (error) {
    logger.error({ error }, 'Error disconnecting from MongoDB');
  }
};

export const getDatabaseStatus = (): 'connected' | 'disconnected' => {
  return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
};
