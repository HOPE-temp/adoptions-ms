import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFollowupDto } from '../dto/filter-followups.dto';
import { AdoptedAnimal } from '../entities/adoptedAnimal.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ActivitiesService } from 'src/activities/services/activities.service';
import {
  UpdateCheckupAdoption,
  UpdateRescheduleFollowup,
} from '../dto/update-followups.dto';
import { validateStatusFlow } from 'src/common/utils/statusFlow.util';
import { followupStatusRequestFlow } from '../flows/followup.flow';
import { StatusFollowupAdoptedAnimal } from '../models/followup.status.model';
import { MedicalCheckupService } from 'src/medical-checkups/services/medical-checkups.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class FollowupsService {
  constructor(
    @InjectRepository(AdoptedAnimal)
    private readonly adoptedAnimalRepo: Repository<AdoptedAnimal>,
    private userService: UsersService,
    private readonly activitiesService: ActivitiesService,
    private readonly medicalCheckupService: MedicalCheckupService,
  ) {}

  findAll(params?: FilterFollowupDto) {
    const options: FindManyOptions<AdoptedAnimal> = {
      loadRelationIds: true,
      relations: [],
      take: 10,
      skip: 0,
    };

    if (params) {
      const where: FindOptionsWhere<AdoptedAnimal> = {};
      const { activitiesFinished, statusFolloup } = params;
      const { limit, offset } = params;

      // if (activitiesFinished) {
      //   where.activities = { finished: activitiesFinished };
      // }

      if (statusFolloup) {
        where.statusFollowup = statusFolloup;
      }

      options.take = limit || 10;
      options.skip = offset || 0;
      options.where = where;
    }

    return this.adoptedAnimalRepo.find(options);
  }

  async find(id: string) {
    const followup = await this.adoptedAnimalRepo.findOne({
      relations: ['activities', 'supervisor', 'adoption'],
      where: { id },
    });

    if (!followup) {
      throw new NotFoundException(`Follow ${id} not exist`);
    }
    return followup;
  }

  async rescheduleFollowup(
    id: string,
    updateFollowDto: UpdateRescheduleFollowup,
  ) {
    const adoptedAnimal = await this.find(id);

    const activity = {
      title: `Seguimineto Post-adoption ${updateFollowDto.animalName}`,
      resourceUrl: updateFollowDto.resourceUrl,
      scheduleStartAt: updateFollowDto.scheduleStartAt,
    };

    this.activitiesService.create(activity, adoptedAnimal);

    this.updateStatusRequest(
      adoptedAnimal,
      StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP,
    );
    return this.adoptedAnimalRepo.save(adoptedAnimal);
  }

  async checkupFollowup(id: string, updateFollowDto: UpdateCheckupAdoption) {
    const adoptedAnimal = await this.find(id);

    this.medicalCheckupService.create({
      ...updateFollowDto,
      animalId: adoptedAnimal.animals.id,
    });

    this.updateStatusRequest(
      adoptedAnimal,
      StatusFollowupAdoptedAnimal.SCHEDULED_STERILIZATION,
    );

    return this.adoptedAnimalRepo.save(adoptedAnimal);
  }

  async validateSterelization(id: string) {
    const adoptedAnimal = await this.find(id);

    this.updateStatusRequest(
      adoptedAnimal,
      StatusFollowupAdoptedAnimal.VERIFIED,
    );

    return this.adoptedAnimalRepo.save(adoptedAnimal);
  }

  async initFollowup(id: string, idSupervisor: number) {
    const adoptedAnimal = await this.find(id);
    const supervisor = await this.userService.findOne(idSupervisor);

    this.updateStatusRequest(
      adoptedAnimal,
      StatusFollowupAdoptedAnimal.IN_FOLLOWUP,
    );

    this.adoptedAnimalRepo.merge(adoptedAnimal, { supervisor });

    return this.adoptedAnimalRepo.save(adoptedAnimal);
  }

  async cancelledFollowup(id: string) {
    const adoptedAnimal = await this.find(id);

    this.updateStatusRequest(
      adoptedAnimal,
      StatusFollowupAdoptedAnimal.CANCELLED,
    );

    return this.adoptedAnimalRepo.save(adoptedAnimal);
  }

  private updateStatusRequest(
    adoptedAnimal: AdoptedAnimal,
    statusRequest: StatusFollowupAdoptedAnimal,
  ) {
    if (
      !validateStatusFlow(
        adoptedAnimal.statusFollowup,
        statusRequest,
        followupStatusRequestFlow,
      )
    ) {
      throw new ConflictException(
        `new status is not validate: ${adoptedAnimal.statusFollowup} -> ${statusRequest}`,
      );
    }
  }
}
