import 'reflect-metadata';

export { AuthenticationModule } from './authentication-module/authentication.module';
export { LoginUserDto } from './dto/login-user.dto';
export { CreateUserDto } from './dto/create-user.dto';
export { ChangePasswordDto } from './dto/change-password.dto';
export { JwtAuthGuard } from './guards/jwt-auth.guard';
export { JwtRefreshGuard } from './guards/jwt-refresh.guard';
export { LocalAuthGuard } from './guards/local-auth.guard';
export type { RequestWithTokenPayload } from './authentication-module/request-with-token-payload.interface';
export type { RequestWithUser } from './authentication-module/request-with-user.interface';

