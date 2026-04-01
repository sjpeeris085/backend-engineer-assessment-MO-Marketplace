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
        const err = error as Partial<
          Error & {
            response?: unknown;
            code?: string;
            detail?: string;
            query?: string;
            parameters?: unknown;
          }
        >;

        this.logger.error({
          message: 'Request Failed',
          method,
          url,
          responseTime: Date.now() - now,

          errorMessage: err.message ?? 'Unknown error',
          stack: err.stack,
          response: err.response,
          code: err.code,
          detail: err.detail,
        });
        return throwError(() => error);
      }),
    );
  }
}
