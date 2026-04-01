/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;

    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse = isHttpException ? exception.getResponse() : null;

    // 🔥 FULL LOG (Cloud Run will capture this)
    this.logger.error({
      message: 'Unhandled Exception',
      path: request.url,
      method: request.method,
      statusCode: status,

      // useful debug fields
      errorMessage: exception instanceof Error ? exception.message : exception,
      stack: exception instanceof Error ? exception.stack : null,
      response: exceptionResponse,

      // DB-specific (TypeORM/Postgres)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      code: (exception as any)?.code,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      detail: (exception as any)?.detail,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      query: (exception as any)?.query,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      parameters: (exception as any)?.parameters,
    });

    // SAFE RESPONSE TO CLIENT
    response.status(status).json({
      statusCode: status,
      message:
        status === 500
          ? 'Internal server error'
          : this.extractMessage(exceptionResponse),
    });
  }

  private extractMessage(response: any): string {
    if (!response) return 'Error';

    if (typeof response === 'string') return response;

    if (Array.isArray(response.message)) {
      return response.message.join(', ');
    }

    return response.message || 'Error';
  }
}
