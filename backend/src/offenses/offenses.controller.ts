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

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.superadmin, Role.government)
@Controller('offenses')
export class OffensesController {
  constructor(private readonly offensesService: OffensesService) {}

  @Get()
  findAll(@Request() req: { user: User }) {
    return this.offensesService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offensesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateOffenseDto) {
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
