import { NestFactory } from '@nestjs/core';
import { PayrollModule } from './payroll.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PayrollModule);
  
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Payroll Service API')
    .setDescription('The API documentation for Payroll Service')
    .setVersion('1.0')
    .addTag('payroll')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PAYROLL_PORT || 4003;
  await app.listen(port);
  console.log(`Payroll service is running on: http://localhost:${port}/api`);
}
bootstrap();
