import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateCitizenDto {
  @IsNotEmpty()
  clerkId: string;

  @IsNotEmpty()
  id: string;

  @IsOptional()
  name: string;

  @IsOptional()
  surname: string;

  @IsOptional()
  email: string;

  @IsOptional()
  roleId: string;
}

export class UpdateCitizenCredentialsDto extends UpdateCitizenDto {
  @IsNotEmpty()
  password: string;
}
