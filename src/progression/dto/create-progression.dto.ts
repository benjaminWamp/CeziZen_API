import { IsNotEmpty } from 'class-validator';

export class CreateProgressionDto {
  @IsNotEmpty()
  citizenId: string;

  @IsNotEmpty()
  ressourceId: string;
}
