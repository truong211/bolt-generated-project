import { Module } from '@nestjs/common';
    import { MessagesService } from './messages.service';
    import { MessagesController } from './messages.controller';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { Message } from './entities/message.entity';
    import { UsersModule } from '../users/users.module';
    import { MulterModule } from '@nestjs/platform-express';
    import { MessagesGateway } from './messages.gateway';

    @Module({
      imports: [
        TypeOrmModule.forFeature([Message]),
        UsersModule,
        MulterModule.register({
          dest: './uploads',
        }),
      ],
      providers: [MessagesService, MessagesGateway],
      controllers: [MessagesController],
    })
    export class MessagesModule {}
