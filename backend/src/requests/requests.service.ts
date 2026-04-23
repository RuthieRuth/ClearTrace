import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  // create a request to ask for a persons record by finding n using National Id
  async create(createRequestDto: CreateRequestDto) {
    const person = await this.prisma.person.findUnique({
      where: { national_id_no: createRequestDto.national_id_no },
    });

    if (!person) {
      throw new Error('Person not found');
    }

    return this.prisma.request.create({
      data: {
        person: { connect: { id: person.id } },
        company: { connect: { id: createRequestDto.company_id } },
        requested_by: { connect: { id: createRequestDto.requested_by_id } },
        purpose: createRequestDto.purpose,
      },
    });
  }

  // get all requests
  findAll() {
    return this.prisma.request.findMany({
      include: {
        person: true,
        company: true,
        requested_by: true,
      },
    });
  }

  // get a specific request by id
  findOne(id: string) {
    return this.prisma.request.findUnique({ where: { id } });
  }

  // get all requests made by a specific company
  findAllCompanyRequests(company_id: string) {
    return this.prisma.request.findMany({
      where: { company_id },
      include: {
        person: true,
        company: true,
        requested_by: true,
      },
    });
  }

  findOneCompanyRequest(id: string, company_id: string) {
    return this.prisma.request.findFirst({
      where: { id, company_id },
      include: {
        person: true,
        company: true,
        requested_by: true,
      },
    });
  }

  // update the status of a request (approved, rejected)
  update(id: string, data: UpdateRequestDto) {
    return this.prisma.request.update({ where: { id }, data });
  }

  // delete a request
  remove(id: string) {
    return this.prisma.request.delete({ where: { id } });
  }
}
