import { PrismaService } from 'src/prisma.service';
import { PersonsService } from './persons.service';
import { Test } from '@nestjs/testing';

describe('PersonsService', () => {
  let service: PersonsService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
    },
    userAccessScope: {
      findMany: jest.fn(),
    },
    person: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PersonsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get(PersonsService);
    jest.clearAllMocks();
  });

  // TEST 1
  it('should the user not found', async () => {
    // A
    const query = 'John';
    const clerkId = 'fake-clerk-id';

    mockPrismaService.user.findUnique.mockResolvedValue(null);

    // A + A cos of the expected error
    await expect(service.findMany(query, clerkId)).rejects.toThrow(
      'User not found',
    );
  });

  // TEST 2
  it('should the searcher be superadmin', async () => {
    // A (3 mocks)
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'fake-user-id',
      role: 'superadmin',
    });

    const query = 'John';
    const clerkId = 'fake-clerk-id';
    mockPrismaService.userAccessScope.findMany.mockResolvedValue([]);

    mockPrismaService.person.findMany.mockResolvedValue([
      { id: 'person1', full_name: 'John Doe', national_id_no: '1234567890' },
    ]);

    // A
    const result = await service.findMany(query, clerkId);

    // A
    expect(result).toBeDefined();
  });

  // TEST 3
  it('should the searcher not be superadmin', async () => {
    // A
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'fake-user-id',
      role: 'agency_staff',
    });

    const query = 'John';
    const clerkId = 'fake-clerk-id';
    mockPrismaService.userAccessScope.findMany.mockResolvedValue([
      { category: 'theft' },
    ]);

    mockPrismaService.person.findMany.mockResolvedValue([
      { id: 'person1', full_name: 'John Doe', national_id_no: '1234567890' },
    ]);

    // A
    const result = await service.findMany(query, clerkId);

    // A
    expect(result).toBeDefined();
  });
});
