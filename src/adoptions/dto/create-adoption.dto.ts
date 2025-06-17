import {
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { StatusResultApotion } from '../models/adoption.status.model';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdoptionDto {
  @IsInt()
  @IsNotEmpty()
  readonly adopterId: number;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ description: 'Id of animal selected' })
  readonly animalsIds: string[];
}

export class CreateWithReviewAdoptionDto extends CreateAdoptionDto {
  @IsIn([
    StatusResultApotion.APPROVED,
    StatusResultApotion.BANNED,
    StatusResultApotion.REJECTED,
  ])
  @IsNotEmpty()
  @ApiProperty({ description: 'Status result of review request adoption' })
  readonly statusResult: StatusResultApotion;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @ApiProperty({ description: 'Notes of review request adoption' })
  readonly reviewRequestNotes: string;
}
