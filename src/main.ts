import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { join } from 'path';
const express = require('express');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.use('/upload/', express.static(join(__dirname, '..', '/upload')));
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory: (errors) => {
      const formattedErrors = errors.map(error => ({
        field: error.property,
        errors: Object.values(error.constraints),
      }));
      return new BadRequestException(formattedErrors);
    }
  }));
  app.enableCors({
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization',
      'Accept-Encoding',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
    ],
    credentials: true,
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    origin: ['http://localhost:4200'],
  });
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('The Task Management API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('task_management')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  app.use(express.static('open-certs/issuers'));
  await app.listen(config.get('port'));
  console.log(`Application is running on: ${config.get('port')}`);
}
bootstrap();
