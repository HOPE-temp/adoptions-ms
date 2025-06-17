import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
} from '@nestjs/common';
import { FollowupsService } from '../services/followups.service';
import { FilterFollowupDto } from '../dto/filter-followups.dto';
import { ApiOperation } from '@nestjs/swagger';
import {
  UpdateCheckupAdoption,
  UpdateRescheduleFollowup,
} from '../dto/update-followups.dto';
import { PayloadToken } from 'src/auth/models/token.model';
import { Request } from 'express';

@Controller('followups')
export class FollowupsController {
  constructor(private readonly followupService: FollowupsService) {}

  @Get()
  @ApiOperation({ summary: 'Register an adoption' })
  findAll(@Query() params: FilterFollowupDto) {
    return this.followupService.findAll(params);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Register an adoption' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.followupService.find(id);
  }

  @Patch(':id/reschedule')
  @ApiOperation({ summary: 'Register an adoption' })
  rescheduleFollowup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFollowDto: UpdateRescheduleFollowup,
  ) {
    return this.followupService.rescheduleFollowup(id, updateFollowDto);
  }

  @Patch(':id/checkupSchedule')
  @ApiOperation({ summary: 'Register an adoption' })
  checkupFollowup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFollowDto: UpdateCheckupAdoption,
  ) {
    return this.followupService.checkupFollowup(id, updateFollowDto);
  }

  @Patch(':id/checkupSchedule')
  @ApiOperation({ summary: 'Register an adoption' })
  validateSterelization(@Param('id', ParseUUIDPipe) id: string) {
    return this.followupService.validateSterelization(id);
  }

  @Patch(':id/start')
  @ApiOperation({ summary: 'Register an adoption' })
  initFollowup(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const { sub } = req.user as PayloadToken;
    return this.followupService.initFollowup(id, sub);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Register an adoption' })
  cancelledFollowup(@Param('id', ParseUUIDPipe) id: string) {
    return this.followupService.cancelledFollowup(id);
  }
}
