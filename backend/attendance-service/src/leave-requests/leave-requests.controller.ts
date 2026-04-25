import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LeaveRequestsService } from './leave-requests.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('leave-requests')
export class LeaveRequestsController {
  constructor(private readonly leaveRequestsService: LeaveRequestsService) {}

  @Post()
  create(@Body() createLeaveRequestDto: Prisma.LeaveRequestCreateInput) {
    return this.leaveRequestsService.create(createLeaveRequestDto);
  }

  @Get()
  findAll() {
    return this.leaveRequestsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.leaveRequestsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLeaveRequestDto: Prisma.LeaveRequestUpdateInput) {
    return this.leaveRequestsService.update(id, updateLeaveRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.leaveRequestsService.remove(id);
  }
}
