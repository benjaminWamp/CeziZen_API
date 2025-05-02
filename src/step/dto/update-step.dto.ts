import { PartialType } from '@nestjs/mapped-types';
import { CreateStepDto } from './create-step.dto';
import { IsOptional } from 'class-validator';

export class UpdateStepDto extends PartialType(CreateStepDto) {
  @IsOptional()
  id?: string;
}
