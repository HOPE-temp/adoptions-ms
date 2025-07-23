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
import { PayloadToken } from 'src/auth/models/token.model';
import { Request } from 'express';
import { UpdateStatusFollowup } from '../dto/update-followups.dto';

@Controller('followups')
export class FollowupsController {
  constructor(private readonly followupService: FollowupsService) {}

  @Get()
  @ApiOperation({ summary: 'List adoptions' })
  findAll(@Query() params: FilterFollowupDto) {
    return this.followupService.findAll(params);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get a adoption' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.followupService.find(id);
  }

  @Patch(':id/update_status_followup')
  @ApiOperation({ summary: 'Register an adoption' })
  updateStatusFollowup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDtoFollowup: UpdateStatusFollowup,
  ) {
    console.log('nueava');
    return this.followupService.updateStatusFollwup(id, updateDtoFollowup);
  }

  @Patch(':id/checkup_schedule')
  @ApiOperation({ summary: 'Register an adoption' })
  validateSterelization(@Param('id', ParseUUIDPipe) id: string) {
    return this.followupService.validateSterelization(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Register an adoption' })
  cancelledFollowup(@Param('id', ParseUUIDPipe) id: string) {
    return this.followupService.cancelledFollowup(id);
  }
}
