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
  ParseIntPipe,
  Put,
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
  UpdateAdoptionRequestDto,
  UpdateAdoptionResultDto,
  UpdateCompleteRequestAdoption,
  UpdateLinkAnimalWithAdoption,
  UpdateLinkSupervisor,
  UpdateTemporalAdoptionrDto,
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
  @Get(':id/status')
  @ApiOperation({ summary: 'Get all adoption with filter' })
  findEstadoAdopcionOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionsService.findConsultStatusAdoption(id);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Put('/:id/update_status_result')
  actualizarEstadoEvaluación(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionDto: UpdateAdoptionResultDto,
  ) {
    return this.adoptionsService.updateResultAdoption(id, updateAdoptionDto);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Put('/:id/update_status_request')
  actualizarEstadoPeticion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionDto: UpdateAdoptionRequestDto,
  ) {
    return this.adoptionsService.updateRequestAdoption(id, updateAdoptionDto);
  }

  @Put(':id/temp-assign')
  registrarAnimalTemporal(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('animalId') animalId: number,
  ) {
    return this.adoptionsService.updateTeporal(id, animalId);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Put(':id/link_volunteer_supervisor')
  asociarVoluntarioSupervisor(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionDto: UpdateLinkSupervisor,
  ) {
    return this.adoptionsService.linkVolunteerSupervisor(id, updateAdoptionDto);
  }

  @Roles(RoleUser.ADMIN, RoleUser.VOLUNTEER)
  @Put(':id/register_animal_adoption')
  registrarAnimalAdopcion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('idAnimal', ParseIntPipe) idAnimal: number,
  ) {
    return this.adoptionsService.linkAnimalWithAdoption(id, idAnimal);
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
  @Patch(':id/complete_request_adoption')
  completeRequestAdoption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAdoptionDto: UpdateCompleteRequestAdoption,
  ) {
    return this.adoptionsService.completeRequestAdoption(id, updateAdoptionDto);
  }
}
