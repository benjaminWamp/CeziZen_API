import { AuthGuard } from '@nestjs/passport';

export class ClerkJwtGuard extends AuthGuard('clerk-jwt') {}
