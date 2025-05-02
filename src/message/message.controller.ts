import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { MessageType } from 'src/utils/types/PrismaApiModel.type';

@Controller('message')
export class MessageController {
  constructor(private readonly MessageService: MessageService) {}

  @Post()
  create(
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<ApiReturns<MessageType | null>> {
    return this.MessageService.create(createMessageDto);
  }

  @Get()
  findAll(
    @Query('citizenId') citizenId: string | undefined,
  ): Promise<ApiReturns<MessageType[] | null>> {
    return this.MessageService.findAll(citizenId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.MessageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMessageDto: UpdateMessageDto) {
    return this.MessageService.update(id, updateMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.MessageService.remove(id);
  }
}
