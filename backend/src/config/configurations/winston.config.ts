import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

const logDir = path.join(process.cwd(), 'logs');

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Winston'),
      ),
    }),

    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, `%DATE%-error.log`),
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),

    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, `%DATE%-combined.log`),
      level: 'info',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxFiles: '30d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  ],
};
