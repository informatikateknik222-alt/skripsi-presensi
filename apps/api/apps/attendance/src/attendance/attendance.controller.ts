import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Prisma } from '../../prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FingerspotWebhookDto } from './dto/fingerspot-webhook.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  // FINGERSPOT WEBHOOK (Public endpoint, karena mesin fingerspot biasanya tidak bisa kirim Bearer Token)
  @Post('fingerspot/webhook')
  handleFingerspotWebhook(@Body() payload: FingerspotWebhookDto | FingerspotWebhookDto[]) {
    return this.attendanceService.processFingerspotWebhook(payload);
  }

  // REKAPITULASI (Butuh Login)
  @UseGuards(JwtAuthGuard)
  @Get('rekap/harian')
  getRekapHarian(@Query('date') date?: string) {
    return this.attendanceService.getRekapHarian(date);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rekap/mingguan')
  getRekapMingguan(@Query('start') start?: string) {
    return this.attendanceService.getRekapMingguan(start);
  }

  @UseGuards(JwtAuthGuard)
  @Get('rekap/bulanan')
  getRekapBulanan(@Query('month') month?: string, @Query('year') year?: string) {
    return this.attendanceService.getRekapBulanan(month, year);
  }

  // CRUD STANDARD
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAttendanceDto: Prisma.AttendanceCreateInput) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendanceDto: Prisma.AttendanceUpdateInput) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
