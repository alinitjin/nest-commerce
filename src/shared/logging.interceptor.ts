import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from 'rxjs/operators';
import { response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const req = context.switchToHttp().getRequest();
        const now = Date.now();

        const { method, url } = req;
        return next.handle()
        .pipe(
            tap(() => Logger.log(`${method} ${url} ${response} ${Date.now() - now}ms`, context.getClass().name,))
        )

    }
}