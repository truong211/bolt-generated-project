import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { User } from './entities/user.entity';
    import { CreateUserDto } from './dto/create-user.dto';

    @Injectable()
    export class UsersService {
      constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
      ) {}

      async create(createUserDto: CreateUserDto): Promise<User> {
        const user = this.usersRepository.create(createUserDto);
        return await this.usersRepository.save(user);
      }

      async findOne(username: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { username } });
      }

      async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id } });
      }

      async markMessagesAsRead(receiverId: number, senderId: number): Promise<void> {
        const user = await this.usersRepository.findOne({ where: { id: receiverId } });
        if (user && user.unreadMessages && user.unreadMessages[senderId]) {
          user.unreadMessages[senderId] = 0;
          await this.usersRepository.save(user);
        }
      }
    }
