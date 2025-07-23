import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterFollowupDto } from '../dto/filter-followups.dto';
import { AdoptedAnimal } from '../entities/adoptedAnimal.entity';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import {
  UpdateCheckupAdoption,
  UpdateRescheduleFollowup,
  UpdateStatusFollowup,
} from '../dto/update-followups.dto';
import { validateStatusFlow } from 'src/common/utils/statusFlow.util';
import { followupStatusRequestFlow } from '../flows/followup.flow';
import { StatusFollowupAdoptedAnimal } from '../models/followup.status.model';

@Injectable()
export class FollowupsService {
  constructor(
    @InjectRepository(AdoptedAnimal)
    private readonly adoptedAnimalRepo: Repository<AdoptedAnimal>,
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
      relations: ['adoption'],
      where: { id },
    });

    if (!followup) {
      throw new NotFoundException(`Follow ${id} not exist`);
    }
    return followup;
  }
  async updateStatusFollwup(
    id: string,
    updateDtoFollowup: UpdateStatusFollowup,
  ) {
    const adoptedAnimal = await this.find(id);
    console.log('folloeasdasdas');
    this.updateStatusRequest(adoptedAnimal, updateDtoFollowup.statusFollowup);

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
    statusFollowup: StatusFollowupAdoptedAnimal,
  ) {
    console.log({ statusFollowup });
    if (
      !validateStatusFlow(
        adoptedAnimal.statusFollowup,
        statusFollowup,
        followupStatusRequestFlow,
      )
    ) {
      throw new ConflictException(
        `new status is not validate: ${adoptedAnimal.statusFollowup} -> ${statusFollowup}`,
      );
    }

    this.adoptedAnimalRepo.merge(adoptedAnimal, { statusFollowup });
    return adoptedAnimal;
  }
}
