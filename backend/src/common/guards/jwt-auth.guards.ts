import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

// this checks if one is logged in
//works hand in hand with roles.guard to check if one is allowed to access a route
