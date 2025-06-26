/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

const GLOBAL_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription('The User API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`);
  Logger.log(`📚 Swagger documentation is available at: http://localhost:${port}/api/docs`);
}

bootstrap();
