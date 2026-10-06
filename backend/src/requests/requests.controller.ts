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
    const clerkUser = req['user'] as { id: string }; // shortcut for clerk user interface
    const extractUser = await this.prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
    });

    if (!extractUser) {
      throw new Error('User not found in database');
    }
    body.requested_by_id = extractUser.id;

    return this.requestsService.create(body);
  }

  // Company requests endpoints
  @Get('company')
  @Roles(Role.company)
  async findAllCompanyRequests(@Req() req: Request) {
    const clerkUser = req['user'] as { id: string };
    const extractCompanyID = await this.prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
    });

    if (!extractCompanyID?.company_id) {
      throw new Error('User not found. Therefore no company id');
    }

    return this.requestsService.findAllCompanyRequests(
      extractCompanyID.company_id,
    );
  }

  @Get('company/:id')
  @Roles(Role.company)
  async findOneCompanyRequest(@Req() req: Request, @Param('id') id: string) {
    const clerkUser = req['user'] as { id: string };
    const extractCompanyID = await this.prisma.user.findUnique({
      where: { clerk_id: clerkUser.id },
    });

    if (!extractCompanyID?.company_id) {
      throw new Error('User not found. Therefore no company id');
    }
    return this.requestsService.findOneCompanyRequest(
      id,
      extractCompanyID.company_id,
    );
  }

  // Superadmin and Data Officer endpoints
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
