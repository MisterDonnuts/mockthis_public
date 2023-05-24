import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { environment } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({origin:true});
  app.useGlobalPipes(new ValidationPipe({transform:true}));
  await app.listen(environment.httpPort);
}
bootstrap();
