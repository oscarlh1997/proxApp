import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Exception');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();
      const raw = typeof response === 'string' ? response : (response as any).message;
      // ValidationPipe devuelve un array de mensajes: se unen para mostrarlos tal cual en la app
      message = Array.isArray(raw) ? raw.join('. ') : raw || message;
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    }

    res.status(status).json({ statusCode: status, message, timestamp: new Date().toISOString() });
  }
}
