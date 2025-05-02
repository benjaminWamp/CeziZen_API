import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCitizenDto {
  @IsNotEmpty()
  @IsOptional()
  clerkId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  roleId: string;
}

export class CreateCitizenwithClerkDTo {
  @IsNotEmpty()
  clerkId: string;
}
