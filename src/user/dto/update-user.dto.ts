import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  clerkId: string;

  @IsNotEmpty()
  id: number;

  @IsOptional()
  firstname: string;

  @IsOptional()
  lastname: string;

  @IsOptional()
  email: string;

  @IsOptional()
  roleId: number;
}

export class UpdateUserCredentialsDto extends UpdateUserDto {
  @IsNotEmpty()
  password: string;
}
