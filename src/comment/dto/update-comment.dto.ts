import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNotEmpty()
  @IsOptional()
  title: string;
  @IsNotEmpty()
  @IsOptional()
  description: string;
  @IsOptional()
  citizenId: string;
}
