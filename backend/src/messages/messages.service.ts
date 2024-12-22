import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { Message } from './entities/message.entity';
    import { CreateMessageDto } from './dto/create-message.dto';
    import { UpdateMessageDto } from './dto/update-message.dto';
    import { UsersService } from '../users/users.service';

    @Injectable()
    export class MessagesService {
      constructor(
        @InjectRepository(Message)
        private messagesRepository: Repository<Message>,
        private usersService: UsersService,
      ) {}

      async create(createMessageDto: CreateMessageDto, senderId: number): Promise<Message> {
        const sender = await this.usersService.findById(senderId);
        if (!sender) {
          throw new NotFoundException('Sender not found');
        }

        let receiver = null;
        if (createMessageDto.receiverId) {
          receiver = await this.usersService.findById(createMessageDto.receiverId);
          if (!receiver) {
            throw new NotFoundException('Receiver not found');
          }
        }

        const message = this.messagesRepository.create({
          ...createMessageDto,
          sender,
          receiver,
        });
        return await this.messagesRepository.save(message);
      }

      async findAll(userId: number): Promise<Message[]> {
        const messages = await this.messagesRepository
          .createQueryBuilder('message')
          .leftJoinAndSelect('message.sender', 'sender')
          .leftJoinAndSelect('message.receiver', 'receiver')
          .where('message.receiver IS NULL')
          .orWhere('message.sender.id = :userId', { userId })
          .orWhere('message.receiver.id = :userId', { userId })
          .orderBy('message.createdAt', 'ASC')
          .getMany();

        return messages;
      }

      async findOne(id: number): Promise<Message> {
        const message = await this.messagesRepository.findOne({
          where: { id },
          relations: ['sender', 'receiver'],
        });
        if (!message) {
          throw new NotFoundException(`Message with ID ${id} not found`);
        }
        return message;
      }

      async update(id: number, updateMessageDto: UpdateMessageDto): Promise<Message> {
        const message = await this.findOne(id);
        this.messagesRepository.merge(message, updateMessageDto);
        return await this.messagesRepository.save(message);
      }

      async remove(id: number): Promise<void> {
        const result = await this.messagesRepository.delete(id);
        if (result.affected === 0) {
          throw new NotFoundException(`Message with ID ${id} not found`);
        }
      }
    }
