import { Module } from '@nestjs/common';
import { ReceptorModule } from './receptor/receptor.module';


@Module({
  imports: [ReceptorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
