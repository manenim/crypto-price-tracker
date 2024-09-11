import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true
  }));

   const config = new DocumentBuilder()
     .setTitle('Crypt-prices-tracker')
     .setDescription('This API tracks the prices of different tokens')
     .setVersion('1.0')
     .addTag('Prices')
     .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('docs', app, document);
  const configService = app.get(ConfigService);


  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
