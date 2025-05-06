import { IsInt, IsOptional, IsString, IsDateString } from 'class-validator';


export class CreateExerciseUserDto {
    @IsOptional()
    @IsString()
    notes?: string;
  
    @IsOptional()
    @IsDateString()
    endDate?: string;
  
    @IsInt()
    userId: number;
  
    @IsInt()
    exerciseId: number;
}
