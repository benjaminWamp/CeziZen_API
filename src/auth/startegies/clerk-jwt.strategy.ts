
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as jwksRsa from 'jwks-rsa';
export class ClerkJwtStrategy extends PassportStrategy(Strategy, 'clerk-jwt') {
    constructor() {
      super({
        secretOrKeyProvider: jwksRsa.passportJwtSecret({
          cache: true,
          rateLimit: true,
          jwksUri: 'https://suited-shrew-64.clerk.accounts.dev/.well-known/jwks.json',
        }),
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        audience: 'http://localhost:5173',
        issuer: 'https://suited-shrew-64.clerk.accounts.dev',
        algorithms: ['RS256'],
      });
    }
  
    async validate(payload: any) {
      return payload; 
    }
  }