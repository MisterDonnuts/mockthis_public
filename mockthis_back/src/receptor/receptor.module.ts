import { Module } from '@nestjs/common';
import { ReceptorService } from './receptor.service';
import { ReceptorController } from './receptor.controller';

@Module({
  providers: [ReceptorService],
  controllers: [ReceptorController]
})
export class ReceptorModule {}
