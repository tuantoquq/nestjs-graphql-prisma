import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['debug', 'error', 'warn', 'log'],
  });
  const config = app.get(ConfigService);

  /* Pipe */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
      validationError: {
        target: false,
      },
    }),
  );
  /* Cors */
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
    methods: ['GET', 'PATCH', 'OPTIONS', 'POST', 'PUT', 'DELETE', 'HEAD'],
  });
  await app.listen(config.get('APP_PORT'));
}
bootstrap();
