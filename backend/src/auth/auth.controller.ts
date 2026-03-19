import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: { user: User }) {
    return this.authService.login(req.user);
  }
  @Post('logout')
  logout() {
    return { message: 'Logged out successfully' };
  }
}
