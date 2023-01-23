import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('ApiKeyGuard');
    return this.isPublicRoute(context) || this.hasApiKey(context);
  }

  private isPublicRoute(context: ExecutionContext): boolean {
    return this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
  }

  private hasApiKey(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();
    const authHeader = ctx.getRequest<Request>().header('Authorization');
    return authHeader === this.configService.get('API_KEY');
  }
}
