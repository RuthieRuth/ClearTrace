import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { OffensesService } from './offenses.service';
import { CreateOffenseDto } from './dto/create-offense.dto';
import { UpdateOffenseDto } from './dto/update-offense.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.superadmin, Role.data_officer, Role.agency_head, Role.agency_staff)
@Controller('offenses')
export class OffensesController {
  constructor(
    private readonly offensesService: OffensesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.offensesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offensesService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreateOffenseDto, @Request() req: { user: User }) {
    const clerkUser = req['user'];
    const extractUser = await this.prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
    });
    if (!extractUser) {
      throw new Error('User not found in database');
    }
    body.added_by_id = extractUser.id;
    return this.offensesService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateOffenseDto) {
    return this.offensesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.offensesService.delete(id);
  }
}
