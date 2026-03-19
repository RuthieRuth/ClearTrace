import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<User | undefined> {
    const userSigningIn = await this.prisma.user.findUnique({
      where: { username },
    });
    if (
      userSigningIn &&
      (await bcrypt.compare(password, userSigningIn.password))
    ) {
      return userSigningIn;
    }
    return undefined;
  }

  login(user: User) {
    const payload = {
      sub: user.id,
      role: user.role,
      agency_type: user.agency_type,
      company_id: user.company_id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

// --- IGNORE ---
// validateUser checks if the provided username and password match a user in the database. If they do, it returns the user object; otherwise, it returns undefined.

//THEN

// login generates a JWT token for the authenticated user, including their id, role, agency type, and company id in the token payload. The token is signed using the JwtService.
