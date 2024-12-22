import {
      WebSocketGateway,
      SubscribeMessage,
      MessageBody,
      WebSocketServer,
      ConnectedSocket,
    } from '@nestjs/websockets';
    import { Server, Socket } from 'socket.io';
    import { MessagesService } from './messages.service';
    import { CreateMessageDto } from './dto/create-message.dto';
    import { UpdateMessageDto } from './dto/update-message.dto';
    import { JwtService } from '@nestjs/jwt';
    import { UnauthorizedException } from '@nestjs/common';
    import { UsersService } from '../users/users.service';

    @WebSocketGateway({ cors: { origin: '*' } })
    export class MessagesGateway {
      @WebSocketServer()
      server: Server;

      constructor(
        private readonly messagesService: MessagesService,
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
      ) {}

      async handleConnection(client: Socket) {
        try {
          const token = client.handshake.headers.authorization.split(' ')[1];
          const decoded = this.jwtService.verify(token, { secret: 'your-secret-key' });
          client.data.user = { userId: decoded.sub, username: decoded.username };
        } catch (error) {
          client.disconnect();
        }
      }

      @SubscribeMessage('createMessage')
      async create(
        @MessageBody() createMessageDto: CreateMessageDto,
        @ConnectedSocket() client: Socket,
      ) {
        if (!client.data.user) {
          throw new UnauthorizedException('Invalid user');
        }
        const message = await this.messagesService.create(
          createMessageDto,
          client.data.user.userId,
        );

        if (message.receiver) {
          // Increment unread message count for the receiver
          const receiver = await this.usersService.findById(message.receiver.id);
          if (receiver) {
            receiver.unreadMessages = receiver.unreadMessages || {};
            receiver.unreadMessages[client.data.user.userId] =
              (receiver.unreadMessages[client.data.user.userId] || 0) + 1;
            await this.usersService.create(receiver); // Save the updated unreadMessages
          }

          // Emit only to sender and receiver
          this.server.to(client.id).emit('message', message);
          this.server.to(message.receiver.id.toString()).emit('message', message);
        } else {
          // Emit to everyone
          this.server.emit('message', message);
        }
        return message;
      }

      @SubscribeMessage('updateMessage')
      async update(
        @MessageBody() updateMessageDto: UpdateMessageDto,
        @ConnectedSocket() client: Socket,
      ) {
        if (!client.data.user) {
          throw new UnauthorizedException('Invalid user');
        }
        const message = await this.messagesService.findOne(updateMessageDto.id);
        if (message.sender.id !== client.data.user.userId) {
          throw new UnauthorizedException('You can only update your own messages');
        }
        const updatedMessage = await this.messagesService.update(
          updateMessageDto.id,
          updateMessageDto,
        );
        this.server.emit('messageUpdated', updatedMessage);
        return updatedMessage;
      }

      @SubscribeMessage('deleteMessage')
      async delete(@MessageBody() id: number, @ConnectedSocket() client: Socket) {
        if (!client.data.user) {
          throw new UnauthorizedException('Invalid user');
        }
        const message = await this.messagesService.findOne(id);
        if (message.sender.id !== client.data.user.userId) {
          throw new UnauthorizedException('You can only delete your own messages');
        }
        await this.messagesService.remove(id);
        this.server.emit('messageDeleted', id);
        return id;
      }

      @SubscribeMessage('findAllMessages')
      async findAll(@ConnectedSocket() client: Socket) {
        if (!client.data.user) {
          throw new UnauthorizedException('Invalid user');
        }
        const messages = await this.messagesService.findAll(client.data.user.userId);
        client.emit('allMessages', messages);
        return messages;
      }

      @SubscribeMessage('markAsRead')
      async markAsRead(@MessageBody() senderId: number, @ConnectedSocket() client: Socket) {
        if (!client.data.user) {
          throw new UnauthorizedException('Invalid user');
        }
        await this.usersService.markMessagesAsRead(client.data.user.userId, senderId);
        // Emit an event to update the unread message count
        this.server.to(client.id).emit('messagesMarkedAsRead', senderId);
      }
    }
