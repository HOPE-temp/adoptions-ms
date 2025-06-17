import {
  IsDate,
  IsString,
  IsUrl,
  MaxLength,
  MinDate,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsAfter } from 'src/common/validators/is-after.validator';

export class UpdateRescheduleFollowup {
  @IsString()
  @MaxLength(25)
  animalName: string;

  @IsUrl()
  resourceUrl: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  scheduleStartAt: Date;
}

export class UpdateCheckupAdoption {
  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  scheduleStartAt: Date;

  @Type(() => Date)
  @IsDate()
  @ValidateIf((item) => item.scheduleStartAt, {
    message: 'Should exist scheduleStartAt',
  })
  @IsAfter('scheduleStartAt')
  scheduleEndAt: Date;
}
