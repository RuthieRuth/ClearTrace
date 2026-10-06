import { Test } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { PrismaService } from 'src/prisma.service';

describe('RequestsService', () => {
  let service: RequestsService;

  const mockPrismaService = {
    person: {
      findUnique: jest.fn(),
    },
    request: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RequestsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get(RequestsService);
    jest.clearAllMocks();
  });

  // TEST 1
  it('should create a request when person exists', async () => {
    //arrange
    const searchByNationalId = {
      national_id_no: '1234567890',
      company_id: 'company1',
      requested_by_id: 'user1',
      purpose: 'Request for person record',
    };

    mockPrismaService.person.findUnique.mockResolvedValue({
      id: 'fake-person-id',
      national_id_no: '1234567890',
    });
    mockPrismaService.request.create.mockResolvedValue({
      id: 'fake-request-id',
    });

    //act
    const result = await service.create(searchByNationalId);

    //assert
    expect(result).toBeDefined();
  });

  // TEST 2
  it('should throw an error when person does not exist', async () => {
    //arrange
    const searchByNationalId = {
      national_id_no: '1234567890',
      company_id: 'company1',
      requested_by_id: 'user1',
      purpose: 'Request for person record',
    };

    mockPrismaService.person.findUnique.mockResolvedValue(null);

    // act + assert
    await expect(service.create(searchByNationalId)).rejects.toThrow(
      'Person not found',
    );
  });
});
