import { IsEnum, IsOptional, IsPositive } from 'class-validator';
import {
  StatusRequestApotion,
  StatusResultApotion,
} from '../models/adoption.status.model';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IsPeruvianDocument } from 'src/common/validators/is-document.validator';

export class FilterAdoptionDto extends PaginationDto {
  @IsPositive()
  @IsOptional()
  @ApiProperty({ description: 'Adopter Id that created request' })
  idAdopter: number;

  @IsEnum(StatusRequestApotion)
  @IsOptional()
  @ApiProperty({ description: 'Adopter status request' })
  statusRequest: StatusRequestApotion;

  @IsEnum(StatusResultApotion)
  @IsOptional()
  @ApiProperty({ description: 'Adopter status result' })
  statusResult: StatusResultApotion;

  @IsOptional()
  @IsPeruvianDocument()
  @ApiProperty({ description: 'Adopter DNI' })
  documentNumber: string;
}
