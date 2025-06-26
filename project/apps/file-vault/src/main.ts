/**Add commentMore actions
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app/app.module';

const GLOBAL_PREFIX = 'api';
const DEFAULT_PORT = 3003;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('File Vault API')
    .setDescription('The File Vault API description')
    .setVersion('1.0')
    .addTag('files')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || DEFAULT_PORT;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
  Logger.log(`📚 Swagger documentation is available at: http://localhost:${port}/api/docs`);
}

bootstrap();