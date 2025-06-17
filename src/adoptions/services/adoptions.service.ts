import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AdoptersService } from 'src/adopters/services/adopters.service';
import {
  CreateAdoptionDto,
  CreateWithReviewAdoptionDto,
} from '../dto/create-adoption.dto';
import { Adoption } from '../entities/adoption.entity';
import { Animal } from 'src/animals/entities/animal.entity';
import {
  StatusRequestApotion,
  StatusResultApotion,
} from '../models/adoption.status.model';
import { validateStatusFlow } from 'src/common/utils/statusFlow.util';
import {
  adoptionStatusRequestFlow,
  adoptionStatusResultFlow,
} from '../flows/adoptions.flow';
import { FilterAdoptionDto } from '../dto/filter-adoption.dto';
import { UsersService } from 'src/users/services/users.service';
import { limitTimeForNextAccion } from 'src/common/utils/nextAccion.util';
import {
  UpdateAdoptionDto,
  UpdateAdoptionEvaluateDto,
  UpdateCompleteRequestAdoption,
  UpdateLinkAnimalWithAdoption,
} from '../dto/update-adoption.dto';

@Injectable()
export class AdoptionsService {
  constructor(
    @InjectRepository(Adoption) private adoptionRepo: Repository<Adoption>,
    @InjectRepository(Animal) private animalRepo: Repository<Animal>,
    private userService: UsersService,
    private adoptersService: AdoptersService,
  ) {}

  async create(createAdoptionDto: CreateAdoptionDto) {
    const { adopterId } = createAdoptionDto;

    const lastAdoption = await this.adoptionRepo.findOne({
      where: { adopter: { id: createAdoptionDto.adopterId } },
      order: { createdAt: { direction: 'DESC' } },
    });

    if (lastAdoption?.createdAt) {
      limitTimeForNextAccion(new Date(lastAdoption.createdAt), {
        typeTime: 'day',
      });
    }
    //validation adopterId is exist
    const adopter = await this.adoptersService.findOne(adopterId);

    if (!adopter.evaluations) {
      throw new BadRequestException('Adopter not have evaluations');
    }

    const adoption: Adoption = this.adoptionRepo.create({ adopter: adopter });

    if (createAdoptionDto.animalsIds) {
      const animalsTemp = await this.animalRepo.findBy({
        id: In(createAdoptionDto.animalsIds),
      });
      adoption.animalsTemp = animalsTemp;
    }
    return this.adoptionRepo.save(adoption);
  }

  async createWithResult(
    evaluatorId: number,
    createAdoptionDto: CreateWithReviewAdoptionDto,
  ) {
    const { adopterId } = createAdoptionDto;

    const evaluator = await this.userService.findOne(evaluatorId);
    const adopter = await this.adoptersService.findOne(adopterId);

    const statusRequest = this.validatedRequestForResult(
      createAdoptionDto.statusResult,
    );

    const adoption = this.adoptionRepo.create({
      ...createAdoptionDto,
      reviewRequestAt: new Date(),
      statusRequest,
      adopter,
      evaluator,
    });

    if (createAdoptionDto.animalsIds) {
      const animalsTemp = await this.animalRepo.findBy({
        id: In(createAdoptionDto.animalsIds),
      });
      adoption.animalsTemp = animalsTemp;
    }

    return this.adoptionRepo.save(adoption);
  }

  findAll(params?: FilterAdoptionDto) {
    const options: FindManyOptions<Adoption> = {
      loadRelationIds: true,
      relations: [],
      take: 10,
      skip: 0,
    };

    if (params) {
      const where: FindOptionsWhere<Adoption> = {};
      const { idAdopter, documentNumber, statusRequest, statusResult } = params;
      const { limit, offset } = params;

      if (idAdopter) {
        where.adopter = { id: idAdopter };
      }

      if (documentNumber) {
        where.adopter = { documentNumber };
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

    return this.adoptionRepo.find(options);
  }

  async findOne(id: string) {
    const adopter = await this.adoptionRepo.findOne({
      where: { id },
      relations: ['adopter', 'animalsTemp'],
    });
    if (!adopter) {
      throw new NotFoundException(`Adoption #${id} not found`);
    }
    return adopter;
  }

  async update(adoptionId: string, updateAdoptionDto: UpdateAdoptionDto) {
    const adoption = await this.findOne(adoptionId);
    this.adoptionRepo.merge(adoption, {
      ...updateAdoptionDto,
      reviewRequestAt: new Date(),
    });

    return this.adoptionRepo.save(adoption);
  }

  async evaluateRequestAdoption(
    id: string,
    evaluatorId: number,
    updateAdoptionDto: UpdateAdoptionEvaluateDto,
  ) {
    const evaluator = await this.userService.findOne(evaluatorId);
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

  async linkAnimalWithAdoption(
    id: string,
    updateAdoptionDto: UpdateLinkAnimalWithAdoption,
  ) {
    const adoption = await this.findOne(id);

    this.updateStatusRequest(adoption, StatusRequestApotion.SELECTED_ANIMAL);

    this.adoptionRepo.merge(adoption, {
      ...updateAdoptionDto,
      selectedAnimalAt: new Date(),
    });

    return this.adoptionRepo.save(adoption);
  }

  async completeRequestAdoption(
    id: string,
    updateAdoptionDto: UpdateCompleteRequestAdoption,
  ) {
    const adoption = await this.findOne(id);

    this.updateStatusRequest(adoption, StatusRequestApotion.ADOPTION_COMPLETED);

    this.adoptionRepo.merge(adoption, updateAdoptionDto);

    return this.adoptionRepo.save(adoption);
  }

  //utils

  private updateStatusRequest(
    adoption: Adoption,
    statusRequest: StatusRequestApotion,
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
    statusResult: StatusResultApotion,
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
    statusResult: StatusResultApotion,
  ): StatusRequestApotion {
    let statusRequest = StatusRequestApotion.CANCELLED;

    if (statusResult === StatusResultApotion.APPROVED) {
      statusRequest = StatusRequestApotion.SUITABLE;
    }

    return statusRequest;
  }
}
