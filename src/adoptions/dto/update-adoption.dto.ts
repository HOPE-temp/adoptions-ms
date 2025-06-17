import { PartialType, PickType } from '@nestjs/swagger';
import { CreateWithReviewAdoptionDto } from './create-adoption.dto';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateAdoptionDto extends PartialType(
  CreateWithReviewAdoptionDto,
) {}

export class UpdateAdoptionEvaluateDto extends PickType(
  CreateWithReviewAdoptionDto,
  ['statusResult', 'reviewRequestNotes'],
) {}

export class UpdateLinkAnimalWithAdoption {
  @IsArray()
  @IsNotEmpty()
  animalsIds: string[];

  @IsString()
  @MaxLength(500)
  @IsOptional()
  reviewRequestNotes: string;
}

export class UpdateCompleteRequestAdoption {
  @IsString()
  @MaxLength(500)
  @IsOptional()
  adoptionHistory: string;

  @IsBoolean()
  @IsOptional()
  isWebVisible: boolean;
}
