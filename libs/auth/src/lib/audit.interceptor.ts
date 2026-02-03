import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { user, method, url } = request;

    return next.handle().pipe(
      tap(() => {
        // Simple console logging (or save to DB)
        console.log(`[AUDIT] User ${user?.userId} - ${method} ${url} at ${new Date().toISOString()}`);
      }),
    );
  }
}
