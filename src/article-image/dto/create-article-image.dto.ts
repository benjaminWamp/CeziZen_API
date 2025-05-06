import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class CreateArticleImageDto {
  @IsString()
  path: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  articleIds?: number[];
}