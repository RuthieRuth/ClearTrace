import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

const jwtDetails = {
  secret: process.env.JWT_SECRET as string,
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtDetails.secret,
    });
  }

  validate(payload: {
    sub: string;
    role: string;
    agency_type: string | null;
    company_id: string | null;
  }) {
    return {
      id: payload.sub,
      role: payload.role,
      agency_type: payload.agency_type,
      company_id: payload.company_id,
    };
  }
}

// jwtStrategy verify the token signature using the JWT_secret and rejects expired tokens.
// If valid, it extracts the user information from the token payload and attaches it to the request object for use in route handlers.
