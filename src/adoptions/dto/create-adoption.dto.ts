import { IsIn, IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { StatusResultAdoption } from '../models/adoption.status.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdoptionDto {
  @IsInt()
  @IsNotEmpty()
  readonly adopter: number;
}

export class CreateWithReviewAdoptionDto extends CreateAdoptionDto {
  @IsIn([
    StatusResultAdoption.APPROVED,
    StatusResultAdoption.BANNED,
    StatusResultAdoption.REJECTED,
  ])
  @IsNotEmpty()
  @ApiProperty({ description: 'Status result of review request adoption' })
  readonly statusResult: StatusResultAdoption;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ description: 'Notes of review request adoption' })
  readonly reviewRequestNotes: string;
}
