import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import {
  StatusRequestAdoption,
  StatusResultAdoption,
} from '../models/adoption.status.model';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsPeruvianDocument } from 'src/common/validators/is-document.validator';

export class FilterAdoptionDto extends PaginationDto {
  @IsPositive()
  @IsOptional()
  @ApiProperty({ description: 'Adopter Id that created request' })
  idAdopter: number;

  @IsEnum(StatusRequestAdoption)
  @IsOptional()
  @ApiProperty({ description: 'Adopter status request' })
  statusRequest: StatusRequestAdoption;

  @IsEnum(StatusResultAdoption)
  @IsOptional()
  @ApiProperty({ description: 'Adopter status result' })
  statusResult: StatusResultAdoption;
}
