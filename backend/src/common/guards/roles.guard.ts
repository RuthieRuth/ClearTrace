import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. get required roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    // 2. get user's role from req.user
    const { user } = context
      .switchToHttp()
      .getRequest<{ user: { role: string } }>();
    // 3. return true if user's role is in required roles
    return requiredRoles.includes(user.role);
  }
}
