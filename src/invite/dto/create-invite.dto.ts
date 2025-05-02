import { IsNotEmpty } from 'class-validator';

export class CreateInviteDto {
  @IsNotEmpty()
  senderId: string;
  @IsNotEmpty()
  receverEmail: string;
  @IsNotEmpty()
  ressourceId: string;
}
