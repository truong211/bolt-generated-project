import {
      Entity,
      PrimaryGeneratedColumn,
      Column,
      ManyToOne,
      CreateDateColumn,
      UpdateDateColumn,
    } from 'typeorm';
    import { User } from '../../users/entities/user.entity';

    @Entity()
    export class Message {
      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      content: string;

      @Column('text', { array: true, nullable: true })
      attachments: string[];

      @ManyToOne(() => User, (user) => user.messages)
      sender: User;

      @ManyToOne(() => User, { nullable: true })
      receiver: User;

      @CreateDateColumn()
      createdAt: Date;

      @UpdateDateColumn()
      updatedAt: Date;
    }
