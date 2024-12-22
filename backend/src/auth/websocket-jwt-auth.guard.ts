import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
    import { JwtService } from '@nestjs/jwt';
    import { WsException } from '@nestjs/websockets';

    @Injectable()
    export class WsJwtAuthGuard implements CanActivate {
      constructor(private jwtService: JwtService) {}

      canActivate(context: ExecutionContext): boolean {
        const client = context.switchToWs().getClient();
        const authToken = client.handshake.headers.authorization?.split(' ')[1];

        if (!authToken) {
          throw new WsException('Unauthorized: No token provided');
        }

        try {
          const payload = this.jwtService.verify(authToken, { secret: 'your-secret-key' });
          client.handshake.user = payload;
          return true;
        } catch (error) {
          throw new WsException('Unauthorized: Invalid token');
        }
      }
    }
