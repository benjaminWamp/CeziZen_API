import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  citizenId: string;

  @IsNotEmpty()
  ressourceId: string;
}
