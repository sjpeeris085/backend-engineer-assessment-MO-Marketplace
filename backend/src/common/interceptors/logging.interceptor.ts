import {
  type LoggerService,
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method;
    const url = request.url;
    const body = request.body as Record<string, unknown>;

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;

        this.logger.log({
          message: 'HTTP Request',
          method,
          url,
          body,
          responseTime: `${responseTime}ms`,
        });
      }),
      catchError((error: unknown) => {
        this.logger.error({
          message: 'Request Failed',
          method,
          url,
          responseTime: Date.now() - now,
          error: error instanceof Error ? error.message : 'Unknown error',
        });

        return throwError(() => error);
      }),
    );
  }
}
