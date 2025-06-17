import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StatusFollowupAdoptedAnimal } from '../models/followup.status.model';
import { Adoption } from './adoption.entity';

@Entity('adopted_animals')
export class AdoptedAnimal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'supervised_by_id',
    nullable: true
  })
  supervisor: number;

  @Column({
    name: 'animal_id',
    nullable: false
  })
  animals: number;

  @ManyToOne(() => Adoption, (adoption) => adoption.adoptedAnimals)
  @JoinColumn({ name: 'adoption_id' })
  adoptions: Adoption;

  @Column({
    name: 'status_followup',
    type: 'enum',
    enum: StatusFollowupAdoptedAnimal,
    default: StatusFollowupAdoptedAnimal.SCHEDULED_FOLLOUP,
    nullable: false,
  })
  statusFollowup: StatusFollowupAdoptedAnimal;

  @Column({
    name: 'is_returned',
    type: 'boolean',
    default: false,
  })
  isReturned: boolean;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt?: Date;
}
