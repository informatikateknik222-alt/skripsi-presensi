import { NestFactory } from '@nestjs/core';
import { EmployeeModule } from './employee.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(EmployeeModule);
  
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Employee Service API')
    .setDescription('The API documentation for Employee Service')
    .setVersion('1.0')
    .addTag('employees')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.EMPLOYEE_PORT || 4001;
  await app.listen(port);
  console.log(`Employee service is running on: http://localhost:${port}/api`);
}
bootstrap();
