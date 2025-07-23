import { PartialType, PickType } from '@nestjs/swagger';
import { CreateWithReviewAdoptionDto } from './create-adoption.dto';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  StatusRequestAdoption,
  StatusResultAdoption,
} from '../models/adoption.status.model';

export class UpdateAdoptionDto extends PartialType(
  CreateWithReviewAdoptionDto,
) {}

export class UpdateAdoptionEvaluateDto extends PickType(
  CreateWithReviewAdoptionDto,
  ['statusResult', 'reviewRequestNotes'],
) {}

export class UpdateAdoptionResultDto extends PickType(
  CreateWithReviewAdoptionDto,
  ['statusResult', 'reviewRequestNotes'],
) {}

export class UpdateAdoptionRequestDto {
  @IsEnum(StatusRequestAdoption)
  @IsNotEmpty()
  readonly statusRequest: StatusRequestAdoption;
}

export class UpdateTemporalAdoptionrDto {
  @IsPositive()
  @IsNotEmpty()
  animalId: number;

  @IsUUID()
  @IsNotEmpty()
  adoptionlId: string;
}

export class UpdateLinkSupervisor {
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}

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
