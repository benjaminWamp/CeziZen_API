import { PartialType } from '@nestjs/mapped-types';
import { CreateProgressionDto } from './create-progression.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateProgressionDto extends PartialType(CreateProgressionDto) {
  @IsNotEmpty()
  @IsOptional()
  completed: boolean;

  @IsNotEmpty()
  @IsOptional()
  dateCompleted: boolean;
}
