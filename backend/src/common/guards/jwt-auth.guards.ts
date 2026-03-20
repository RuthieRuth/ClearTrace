import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      const role = (payload.metadata as { role?: string })?.role;
      request['user'] = { id: payload.sub, role };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
