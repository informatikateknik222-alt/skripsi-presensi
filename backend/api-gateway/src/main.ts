import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Mengizinkan semua Frontend (localhost:3000 dll) untuk mengakses Gateway tanpa halangan
  app.enableCors({
    origin: true, // Menggunakan true agar NestJS otomatis menyesuaikan origin (menghindari error CORS credentials)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
