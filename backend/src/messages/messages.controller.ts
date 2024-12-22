import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      UseGuards,
      Request,
      UseInterceptors,
      UploadedFiles,
    } from '@nestjs/common';
    import { MessagesService } from './messages.service';
    import { CreateMessageDto } from './dto/create-message.dto';
    import { UpdateMessageDto } from './dto/update-message.dto';
    import { JwtAuthGuard } from '../auth/jwt-auth.guard';
    import { FilesInterceptor } from '@nestjs/platform-express';

    @Controller('messages')
    export class MessagesController {
      constructor(private readonly messagesService: MessagesService) {}

      @UseGuards(JwtAuthGuard)
      @Post()
      @UseInterceptors(FilesInterceptor('files', 5))
      async create(
        @Body() createMessageDto: CreateMessageDto,
        @Request() req,
        @UploadedFiles() files: Array<Express.Multer.File>,
      ) {
        const message = await this.messagesService.create(createMessageDto, req.user.userId);
        if (files) {
          const filePaths = files.map((file) => file.path);
          message.attachments = filePaths;
          await this.messagesService.update(message.id, { attachments: filePaths } as UpdateMessageDto);
        }
        return message;
      }

      @UseGuards(JwtAuthGuard)
      @Get()
      findAll() {
        return this.messagesService.findAll();
      }

      @UseGuards(JwtAuthGuard)
      @Get(':id')
      findOne(@Param('id') id: string) {
        return this.messagesService.findOne(+id);
      }

      @UseGuards(JwtAuthGuard)
      @Patch(':id')
      async update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto, @Request() req) {
        const message = await this.messagesService.findOne(+id);
        if (message.sender.id !== req.user.userId) {
          throw new UnauthorizedException('You can only update your own messages');
        }
        return this.messagesService.update(+id, updateMessageDto);
      }

      @UseGuards(JwtAuthGuard)
      @Delete(':id')
      async remove(@Param('id') id: string, @Request() req) {
        const message = await this.messagesService.findOne(+id);
        if (message.sender.id !== req.user.userId) {
          throw new UnauthorizedException('You can only delete your own messages');
        }
        return this.messagesService.remove(+id);
      }
    }
