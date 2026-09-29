import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { Request } from 'express';

@Injectable()
/* export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const result = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });
      console.log('RAW VERIFY RESULT:', JSON.stringify(result, null, 2));
      const { data: payload, errors } = result as {
        data?: { sub: string; metadata?: { role?: string } };
        errors?: unknown[];
      };

      if (errors || !payload) {
        console.log('Clerk error:', errors);
        throw new UnauthorizedException();
      }

      const role = (payload.metadata as { role?: string })?.role;
      request['user'] = { id: payload.sub, role };
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException();
    }
  }
} */

// before line 19
/* const { data: payload, errors } = (await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      })) as {
        data?: { sub: string; metadata?: { role?: string } };
        errors?: unknown[];
      }; */
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException();

    try {
      const result: unknown = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const payload = result as { sub: string; metadata?: { role?: string } };

      if (!payload?.sub) {
        throw new UnauthorizedException();
      }

      const role = payload.metadata?.role;
      request['user'] = { id: payload.sub, role };
      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException();
    }
  }
}
