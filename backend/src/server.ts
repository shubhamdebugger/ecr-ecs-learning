import app from './app';
import { config } from './config/app.config';
import { connectDatabase, disconnectDatabase } from './database/connection';
import { logger } from './logger/logger';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();

    const server = app.listen(config.PORT, () => {
      logger.info(
        {
          port: config.PORT,
          env: config.NODE_ENV,
          docs: `http://localhost:${config.PORT}/api/docs`,
        },
        'Server started successfully',
      );
    });

    const gracefulShutdown = (signal: string) => {
      logger.info({ signal }, 'Received shutdown signal');

      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        logger.info('Graceful shutdown completed');
        process.exit(0);
      });

      // Force shutdown after 10s
      setTimeout(() => {
        logger.error('Forced shutdown due to timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error({ reason }, 'Unhandled promise rejection');
      process.exit(1);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error({ error }, 'Uncaught exception');
      process.exit(1);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

void startServer();
