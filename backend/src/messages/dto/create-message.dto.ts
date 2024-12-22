import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

    export class CreateMessageDto {
      @IsNotEmpty()
      @IsString()
      content: string;

      @IsOptional()
      attachments?: string[];

      @IsOptional()
      @IsNumber()
      receiverId?: number;
    }
