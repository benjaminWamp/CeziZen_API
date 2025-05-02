import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateRessourceDto {
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsInt()
  maxParticipant: number;

  @IsOptional()
  @IsInt()
  nbParticipant: number;

  @IsOptional()
  @IsDateString()
  deadLine: Date;

  @IsOptional()
  @IsNotEmpty()
  typeRessourceId: string;

  @IsOptional()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  fileId: string;

  @IsOptional()
  bannerId: string;

  @IsOptional()
  @IsBoolean()
  isValidate: boolean;

  @IsOptional()
  @IsNotEmpty()
  status: string;
}
