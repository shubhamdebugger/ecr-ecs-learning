import pinoHttp from 'pino-http';
import { logger } from '../logger/logger';

export const requestLogger = pinoHttp({
  logger,
  customLogLevel: (_req, res) => {
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },
  customErrorMessage: (req, _res, err) => {
    return `${req.method} ${req.url} - ${err.message}`;
  },
  serializers: {
    req: (req: { method: string; url: string; remoteAddress: string }) => ({
      method: req.method,
      url: req.url,
      remoteAddress: req.remoteAddress,
    }),
    res: (res: { statusCode: number }) => ({
      statusCode: res.statusCode,
    }),
  },
});
