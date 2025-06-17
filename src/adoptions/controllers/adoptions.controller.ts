import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { AdoptionsService } from '../services/adoptions.service';

import { FilterAdoptionDto } from '../dto/filter-adoption.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleUser } from 'src/auth/models/roles.model';
import { PayloadToken } from 'src/auth/models/token.model';
import {
  CreateAdoptionDto,
  CreateWithReviewAdoptionDto,
} from '../dto/create-adoption.dto';
import {
  UpdateAdoptionEvaluateDto,
  UpdateCompleteRequestAdoption,
  UpdateLinkAnimalWithAdoption,
} from '../dto/update-adoption.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('adoptions')
export class AdoptionsController {
  constructor(private readonly adoptionsService: AdoptionsService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Register an adoption' })
  create(@Body() createAdoptionDto: CreateAdoptionDto) {
    return this.adoptionsService.create(createAdoptionDto);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Post('/with_result')
  @ApiOperation({
    summary: 'Register an adoption with a review - statusResult',
  })
  createWithResult(
    @Body() createAdoptionDto: CreateWithReviewAdoptionDto,
    @Req() req: Request,
  ) {
    const { sub } = req.user as PayloadToken;

    return this.adoptionsService.createWithResult(sub, createAdoptionDto);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Get()
  @ApiOperation({ summary: 'Get all adoption with filter' })
  findAll(@Query() params?: FilterAdoptionDto) {
    return this.adoptionsService.findAll(params);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Get(':id')
  @ApiOperation({ summary: 'Get all adoption with filter' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionsService.findOne(id);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Patch(':id/evaluate_request_adoption')
  evaluateRequestAdoption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionEvaluateDto: UpdateAdoptionEvaluateDto,
    @Req() req: Request,
  ) {
    const { sub } = req.user as PayloadToken;
    return this.adoptionsService.evaluateRequestAdoption(
      id,
      sub,
      updateAdoptionEvaluateDto,
    );
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Patch(':id/linked_animal_with_adoption')
  linkAnimalWithAdoption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionDto: UpdateLinkAnimalWithAdoption,
  ) {
    return this.adoptionsService.linkAnimalWithAdoption(id, updateAdoptionDto);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Patch(':id/complete_request_adoption')
  completeRequestAdoption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionDto: UpdateCompleteRequestAdoption,
  ) {
    return this.adoptionsService.completeRequestAdoption(id, updateAdoptionDto);
  }
}
