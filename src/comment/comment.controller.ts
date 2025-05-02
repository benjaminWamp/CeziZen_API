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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiReturns } from 'src/utils/types/ApiReturns.type';
import { CommentType } from 'src/utils/types/PrismaApiModel.type';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<ApiReturns<CommentType | null>> {
    return this.commentService.create(createCommentDto);
  }

  @Get()
  findAll(
    @Query('citizenId') citizenId: string | undefined,
  ): Promise<ApiReturns<CommentType[] | null>> {
    return this.commentService.findAll(citizenId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(id);
  }
}
