import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
  IsString,
} from 'class-validator';
import { StepType } from 'src/utils/types/PrismaApiModel.type';

export class CreateRessourceDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsInt()
  maxParticipant?: number;

  @IsOptional()
  @IsInt()
  nbParticipant?: number;

  @IsOptional()
  @IsDateString()
  deadLine?: Date;

  @IsNotEmpty()
  categoryId: string;

  @IsNotEmpty()
  typeRessourceId: string;

  @IsOptional()
  @IsBoolean()
  isValidate: boolean;

  @IsOptional()
  status: string;

  @IsOptional()
  @IsString()
  fileBytes?: string;

  @IsOptional()
  @IsString()
  bannerBytes?: string;

  @IsOptional()
  step?: Omit<StepType, 'ressourceId'>[];

  @IsOptional()
  citizenId?: string;
}
