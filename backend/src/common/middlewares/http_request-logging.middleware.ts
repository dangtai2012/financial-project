import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from '@shared/logger/logger.service';

@Injectable()
export class HttpRequestLoggingMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) {
    loggerService.setContext('HTTP');
  }

  use(req: any, res: any, next: () => void) {
    const startAt = process.hrtime();
    const { ip, method, originalUrl } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const diff = process.hrtime(startAt);
      const responseTime = diff[0] * 1e3 + diff[1] * 1e-6;
      this.loggerService.log('', {
        url: {
          ip,
          method,
          originalUrl,
          statusCode,
          responseTime: `${responseTime.toFixed(2)}ms`,
        },
      });
    });

    next();
  }
}
