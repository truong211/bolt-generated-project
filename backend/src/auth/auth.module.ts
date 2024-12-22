import { Module } from '@nestjs/common';
    import { AuthService } from './auth.service';
    import { AuthController } from './auth.controller';
    import { UsersModule } from '../users/users.module';
    import { JwtModule } from '@nestjs/jwt';
    import { PassportModule } from '@nestjs/passport';
    import { JwtStrategy } from './jwt.strategy';
    import { WsJwtAuthGuard } from './websocket-jwt-auth.guard';

    @Module({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: 'your-secret-key', // Replace with a real secret key
          signOptions: { expiresIn: '60m' },
        }),
      ],
      providers: [AuthService, JwtStrategy, WsJwtAuthGuard],
      controllers: [AuthController],
      exports: [WsJwtAuthGuard],
    })
    export class AuthModule {}
