import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
    import { Message } from '../../messages/entities/message.entity';

    @Entity()
    export class User {
      @PrimaryGeneratedColumn()
      id: number;

      @Column({ unique: true })
      username: string;

      @Column()
      password: string;

      @OneToMany(() => Message, (message) => message.sender)
      messages: Message[];

      @Column('jsonb', { nullable: true, default: {} })
      unreadMessages: Record<number, number>; // { [senderId]: unreadCount }
    }
