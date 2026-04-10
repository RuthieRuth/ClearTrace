import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.superadmin, Role.data_officer, Role.agency_head, Role.agency_staff)
@Controller('persons')
export class PersonsController {
  constructor(
    private readonly personsService: PersonsService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  findAll() {
    return this.personsService.findAll();
  }

  @Get('search/:query')
  findMany(@Param('query') query: string, @Req() req: Request) {
    const clerkId = req['user'].id;
    return this.personsService.findMany(query, clerkId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.personsService.findOne(id);
  }

  @Post()
  async create(@Body() body: CreatePersonDto, @Req() req: Request) {
    const clerkUser = req['user'];
    const extractUser = await this.prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
    });
    if (!extractUser) {
      throw new Error('User not found in database');
    }
    body.created_by_id = extractUser.id;

    return this.personsService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdatePersonDto) {
    return this.personsService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.personsService.delete(id);
  }
}
