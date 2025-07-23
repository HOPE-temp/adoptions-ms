import 'reflect-metadata';

import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Adoption } from './adoption.entity';

@Entity('selected_animals_temp')
export class SelectedAnimalTemp {
  @ManyToOne(() => Adoption, (animal) => animal.animalsTemp)
  @JoinColumn({ name: 'adoptionsId' })
  adoption: Adoption;

  @PrimaryColumn({ name: 'animalsId' })
  animal: number;
}
