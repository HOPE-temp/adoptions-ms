import 'reflect-metadata';

import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateAdoptionDto } from '../dto/create-adoption.dto';
import { Adoption } from '../entities/adoption.entity';
import {
  StatusRequestAdoption,
  StatusResultAdoption,
} from '../models/adoption.status.model';
import { validateStatusFlow } from 'src/common/utils/statusFlow.util';
import {
  adoptionStatusRequestFlow,
  adoptionStatusResultFlow,
} from '../flows/adoptions.flow';
import { FilterAdoptionDto } from '../dto/filter-adoption.dto';
import {
  UpdateAdoptionDto,
  UpdateAdoptionEvaluateDto,
  UpdateAdoptionRequestDto,
  UpdateAdoptionResultDto,
  UpdateCompleteRequestAdoption,
  UpdateLinkAnimalWithAdoption,
  UpdateLinkSupervisor,
  UpdateTemporalAdoptionrDto,
} from '../dto/update-adoption.dto';
import { AdoptedAnimal } from '../entities/adoptedAnimal.entity';
import { SelectedAnimalTemp } from '../entities/selectedAnimalTemp.entity';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption) private adoptionRepo: Repository<Adoption>,
    @InjectRepository(AdoptedAnimal)
    private adoptedAnimalRepo: Repository<AdoptedAnimal>,
    @InjectRepository(SelectedAnimalTemp)
    private selectedAnimalTempRepo: Repository<SelectedAnimalTemp>,
  ) {}

  async create({ adopter }: CreateAdoptionDto) {
    const fooAdoption: Adoption = this.adoptionRepo.create({ adopter });

    return await this.adoptionRepo.save(fooAdoption);
  }

  async registerAnimalSelected(adoption: Adoption, animalId: number) {
    const adopterAnimal = await this.adoptedAnimalRepo.findOne({
      where: { animal: animalId },
    });
    if (adopterAnimal && !adopterAnimal.isReturned) {
      throw new ConflictException('No disponible');
    }
    const selected = this.selectedAnimalTempRepo.create({
      adoption,
      animal: animalId,
    });
    this.selectedAnimalTempRepo.save(selected);
  }

  async registerAnimalAdopted(adoption: Adoption, animalId: number) {
    const adopterAnimal = await this.adoptedAnimalRepo.findOne({
      where: { animal: animalId },
    });
    if (adopterAnimal && !adopterAnimal.isReturned) {
      throw new ConflictException('No disponible');
    }
    const selected = this.adoptedAnimalRepo.create({
      adoption,
      animal: animalId,
    });
    this.adoptedAnimalRepo.save(selected);
  }

  async findAll(params?: FilterAdoptionDto) {
    const options: FindManyOptions<Adoption> = {
      take: 10,
      skip: 0,
    };

    if (params) {
      const where: FindOptionsWhere<Adoption> = {};
      const { idAdopter, statusRequest, statusResult } = params;
      const { limit, offset } = params;

      if (idAdopter) {
        where.adopter = idAdopter;
      }

      if (statusRequest) {
        where.statusRequest = statusRequest;
      }

      if (statusResult) {
        where.statusResult = statusResult;
      }

      options.take = limit || 10;
      options.skip = offset || 0;
      options.where = where;
    }

    const [items, total] = await this.adoptionRepo.findAndCount(options);

    return {
      items,
      total,
      limit: options.take,
      offset: options.skip,
    };
  }

  async findOne(id: string) {
    const adopter = await this.adoptionRepo.findOne({
      where: { id },
      relations: ['animalsTemp', 'adoptedAnimals'],
    });
    if (!adopter) {
      throw new NotFoundException(`Adoption #${id} not found`);
    }
    return adopter;
  }

  async findConsultStatusAdoption(id: string) {
    const adopter = await this.findOne(id);

    return {
      adoptionId: adopter.id,
      statusRequest: adopter.statusRequest,
    };
  }

  async evaluateRequestAdoption(
    id: string,
    evaluator: number,
    updateAdoptionDto: UpdateAdoptionEvaluateDto,
  ) {
    const adoption = await this.findOne(id);
    const { reviewRequestNotes, statusResult } = updateAdoptionDto;

    const statusRequest = this.validatedRequestForResult(statusResult);

    this.updateStatusRequest(adoption, statusRequest);
    this.updateStatusResult(adoption, statusResult);
    this.adoptionRepo.merge(adoption, {
      reviewRequestNotes,
      reviewRequestAt: new Date(),
      evaluator,
    });

    return this.adoptionRepo.save(adoption);
  }

  async linkAnimalWithAdoption(id: string, animalId: number) {
    const adoption = await this.findOne(id);

    return this.registerAnimalAdopted(adoption, animalId);
  }

  async linkVolunteerSupervisor(
    id: string,
    updateAdoptionDto: UpdateLinkSupervisor,
  ) {
    const adoption = await this.findOne(id);
    this.adoptionRepo.merge(adoption, {
      evaluator: updateAdoptionDto.userId,
    });

    return this.adoptionRepo.save(adoption);
  }

  async completeRequestAdoption(
    id: string,
    updateAdoptionDto: UpdateCompleteRequestAdoption,
  ) {
    const adoption = await this.findOne(id);

    this.updateStatusRequest(
      adoption,
      StatusRequestAdoption.ADOPTION_COMPLETED,
    );

    this.adoptionRepo.merge(adoption, updateAdoptionDto);

    return this.adoptionRepo.save(adoption);
  }

  async updateResultAdoption(
    id: string,
    updateAdoptionDto: UpdateAdoptionResultDto,
  ) {
    const adoption = await this.findOne(id);

    this.updateStatusResult(adoption, updateAdoptionDto.statusResult);

    this.adoptionRepo.merge(adoption, updateAdoptionDto);

    return this.adoptionRepo.save(adoption);
  }

  async updateRequestAdoption(
    id: string,
    updateAdoptionDto: UpdateAdoptionRequestDto,
  ) {
    const adoption = await this.findOne(id);

    this.updateStatusRequest(adoption, updateAdoptionDto.statusRequest);

    return this.adoptionRepo.save(adoption);
  }

  async updateTeporal(id: string, animalId: number) {
    const adoption = await this.findOne(id);

    return this.registerAnimalSelected(adoption, animalId);
  }

  //utils

  private updateStatusRequest(
    adoption: Adoption,
    statusRequest: StatusRequestAdoption,
  ) {
    if (
      !validateStatusFlow(
        adoption.statusRequest,
        statusRequest,
        adoptionStatusRequestFlow,
      )
    ) {
      throw new ConflictException(
        `new status is not validate: ${adoption.statusRequest} -> ${statusRequest}`,
      );
    }

    this.adoptionRepo.merge(adoption, { statusRequest });
    return adoption;
  }
  private updateStatusResult(
    adoption: Adoption,
    statusResult: StatusResultAdoption,
  ) {
    if (
      !validateStatusFlow(
        adoption.statusResult,
        statusResult,
        adoptionStatusResultFlow,
      )
    ) {
      throw new ConflictException(
        `new status is not validate: ${adoption.statusResult} -> ${statusResult}`,
      );
    }

    this.adoptionRepo.merge(adoption, { statusResult });
    return adoption;
  }

  validatedRequestForResult(
    statusResult: StatusResultAdoption,
  ): StatusRequestAdoption {
    let statusRequest = StatusRequestAdoption.CANCELLED;

    if (statusResult === StatusResultAdoption.APPROVED) {
      statusRequest = StatusRequestAdoption.SUITABLE;
    }

    return statusRequest;
  }
}
