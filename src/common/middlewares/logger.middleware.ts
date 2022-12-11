import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const generateRequestLog = () => {
      const now = Date.now();
      return {
        userAgent: request.get('user-agent'),
        method: request.method,
        url: request.originalUrl,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        contentLength: response.get('content-length'),
        responseTime: Date.now() - now,
        contentType: request.get('content-type') || request.get('Content-type'),
        accept: request.get('accept'),
        ip: request.ip,
        timestamp: new Date().toISOString(),
      };
    };

    response.on('finish', () => {
      this.apiLog(generateRequestLog());
    });

    response.on('error', () => {
      this.apiError(generateRequestLog());
    });

    next();
  }

  private apiLog(message: object): void {
    const level = 'API_REQUEST';
    console.log(JSON.stringify({ level, ...message }));
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private apiError(message: object): void {
    const level = 'API_ERROR';
    console.error(JSON.stringify({ level, ...message }));
  }
}
