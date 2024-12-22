import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { AppController } from './app.controller';
    import { AppService } from './app.service';
    import { AuthModule } from './auth/auth.module';
    import { UsersModule } from './users/users.module';
    import { MessagesModule } from './messages/messages.module';
    import { User } from './users/entities/user.entity';
    import { Message } from './messages/entities/message.entity';

    @Module({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'postgres',
          port: 5432,
          username: 'user',
          password: 'password',
          database: 'messengerdb',
          entities: [User, Message],
          synchronize: true,
        }),
        AuthModule,
        UsersModule,
        MessagesModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    })
    export class AppModule {}
