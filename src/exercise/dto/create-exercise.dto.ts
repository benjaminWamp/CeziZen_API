import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  @MaxLength(100)
  label: string;

  @IsOptional()
  @IsString()
  times?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  inspiration?: number;

  @IsOptional()
  @IsInt()
  expiration?: number;

  @IsOptional()
  @IsInt()
  apnea?: number;
}
