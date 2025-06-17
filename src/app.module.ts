import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { environments } from './config/environments';
import { validationSchema } from './config/validationEnv';
import configEnv from './config/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV || 'dev'],
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      load: [configEnv],
      validationSchema,
      isGlobal: true,
    }),
    DatabaseModule,
  ],
})
export class AppModule {}
