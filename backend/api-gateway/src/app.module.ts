import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Auth Service (4001)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://localhost:4001', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl
      }))
      .forRoutes('/api/auth', '/api/auth/*');

    // 2. Employee Service (4002)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://localhost:4002', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl
      }))
      .forRoutes('/api/departments', '/api/departments/*', '/api/positions', '/api/positions/*', '/api/employees', '/api/employees/*');

    // 3. Attendance Service (4003)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://localhost:4003', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl
      }))
      .forRoutes('/api/attendance', '/api/attendance/*', '/api/leave-requests', '/api/leave-requests/*');

    // 4. Payroll Service (4004)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://localhost:4004', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl
      }))
      .forRoutes('/api/salary', '/api/salary/*', '/api/payroll-records', '/api/payroll-records/*');
  }
}

