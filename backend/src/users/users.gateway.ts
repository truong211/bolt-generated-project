import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
    import { Server } from 'socket.io';

    @WebSocketGateway({ cors: { origin: '*' } })
    export class UsersGateway {
      @WebSocketServer()
      server: Server;

      handleUserStatusUpdate(userId: number, isOnline: boolean) {
        this.server.emit('userStatusUpdate', { userId, isOnline });
      }
    }
