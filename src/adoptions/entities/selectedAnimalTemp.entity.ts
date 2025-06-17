import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Adoption } from "./adoption.entity";

@Entity('selected_animals_temp')
export class SelectedAnimalTemp {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Adoption, (animal) => animal.animalsTemp)
  @JoinColumn({name: 'adoption_id'})
  adoptionId: Adoption;

  @Column()
  animalId: number;
}
