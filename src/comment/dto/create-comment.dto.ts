import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  description: string;
  citizenId: string;
  ressourceId: string;
}
