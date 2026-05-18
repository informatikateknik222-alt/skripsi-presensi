import { NestFactory } from '@nestjs/core';
import { AttendanceModule } from './attendance.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AttendanceModule);
  
  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Attendance Service API')
    .setDescription('The API documentation for Attendance Service')
    .setVersion('1.0')
    .addTag('attendance')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.ATTENDANCE_PORT || 4002;
  await app.listen(port);
  console.log(`Attendance service is running on: http://localhost:${port}/api`);
}
bootstrap();
