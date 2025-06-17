import {
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { StatusFollowupAdoptedAnimal } from '../models/followup.status.model';

export class FilterFollowupDto extends PaginationDto {
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Follow-up has activities finished' })
  activitiesFinished: boolean;

  @IsOptional()
  @IsEnum(StatusFollowupAdoptedAnimal)
  @ApiProperty({ description: 'Status follow-ups' })
  statusFolloup: StatusFollowupAdoptedAnimal;
}
