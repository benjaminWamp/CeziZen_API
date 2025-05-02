import { IsNotEmpty } from 'class-validator';

export class CreateStepDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  order: number;

  @IsNotEmpty()
  ressourceId: string;
}
