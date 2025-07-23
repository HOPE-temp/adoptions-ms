import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdoptionsService } from './services/adoptions.service';

import { AdoptionsController } from './controllers/adoptions.controller';

import { Adoption } from './entities/adoption.entity';
import { AdoptedAnimal } from './entities/adoptedAnimal.entity';
import { FollowupsController } from './controllers/followups.controller';
import { FollowupsService } from './services/followups.service';
import { SelectedAnimalTemp } from './entities/selectedAnimalTemp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Adoption,  AdoptedAnimal, SelectedAnimalTemp]),
  ],
  controllers: [AdoptionsController, FollowupsController],
  providers: [AdoptionsService, FollowupsService],
})
export class AdoptionsModule {}
