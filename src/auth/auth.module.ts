import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStartegy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
  ],
  providers: [JwtStartegy],
  controllers: [],
})
export class AuthModule {}
