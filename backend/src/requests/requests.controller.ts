import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PrismaService } from 'src/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(Role.company)
  async create(@Body() body: CreateRequestDto, @Req() req: Request) {
    const clerkUser = req['user'];
    const extractUser = await this.prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
    });

    if (!extractUser) {
      throw new Error('User not found in database');
    }
    body.requested_by_id = extractUser.id;

    return this.requestsService.create(body);
  }

  @Get(':id')
  @Roles(Role.superadmin, Role.data_officer)
  findOne(@Param('id') id: string) {
    return this.requestsService.findOne(id);
  }

  @Get()
  @Roles(Role.superadmin, Role.data_officer)
  findAll() {
    return this.requestsService.findAll();
  }

  @Patch(':id')
  @Roles(Role.superadmin, Role.data_officer)
  update(@Param('id') id: string, @Body() body: UpdateRequestDto) {
    return this.requestsService.update(id, body);
  }
}
