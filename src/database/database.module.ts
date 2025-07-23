import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdoptedAnimal } from 'src/adoptions/entities/adoptedAnimal.entity';
import { Adoption } from 'src/adoptions/entities/adoption.entity';
import { SelectedAnimalTemp } from 'src/adoptions/entities/selectedAnimalTemp.entity';
import config from 'src/config/config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { username, host, port, password, database } =
          configService.mysql;
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [Adoption,  AdoptedAnimal, SelectedAnimalTemp],
          synchronize: false,
          timezone: '0:00',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
