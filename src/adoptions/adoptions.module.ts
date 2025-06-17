import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdoptionsService } from './services/adoptions.service';

import { AdoptionsController } from './controllers/adoptions.controller';

import { Adopter } from 'src/adopters/entities/adopter.entity';
import { Animal } from 'src/animals/entities/animal.entity';
import { Adoption } from './entities/adoption.entity';
import { AdoptedAnimal } from './entities/adoptedAnimal.entity';
import { AdoptersModule } from 'src/adopters/adopters.module';
import { UsersModule } from 'src/users/users.module';
import { FollowupsController } from './controllers/followups.controller';
import { FollowupsService } from './services/followups.service';
import { ActivitiesModule } from 'src/activities/activities.module';
import { MedicalCheckupModule } from 'src/medical-checkups/medical-checkups.module';

@Module({
  imports: [
    AdoptersModule,
    ActivitiesModule,
    MedicalCheckupModule,
    UsersModule,
    TypeOrmModule.forFeature([Adoption, Adopter, AdoptedAnimal, Animal]),
  ],
  controllers: [AdoptionsController, FollowupsController],
  providers: [AdoptionsService, FollowupsService],
})
export class AdoptionsModule {}
