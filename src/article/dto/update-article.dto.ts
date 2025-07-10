import {
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateArticleDto {
  @IsOptional()
  @IsNotEmpty()
  label: string;

  @IsOptional()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  @IsNotEmpty()
  categoryId: number;
}
