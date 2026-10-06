import { PrismaService } from 'src/prisma.service';
import { OffensesService } from './offenses.service';
import { Test } from '@nestjs/testing';

describe('OffensesService', () => {
  let service: OffensesService;

  const mockPrismaService = {
    offense: {
      findMany: jest.fn(),
    },
    userAccessScope: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OffensesService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get(OffensesService);
    jest.clearAllMocks();
  });

  // TEST 1
  it('should the user be superadmin', async () => {
    // A
    const fakeUser = { id: 'fake-user-id', role: 'superadmin' };

    mockPrismaService.offense.findMany.mockResolvedValue([
      { id: 'offense1', category: 'theft' },
      { id: 'offense2', category: 'fraud' },
    ]);

    // A
    const result = await service.findAll(fakeUser as any);

    // A
    expect(result).toBeDefined();
  });

  // TEST 2
  it('should the user be an data officer', async () => {
    // A
    const fakeUser = { id: 'fake-user-id', role: 'data_officer' };

    mockPrismaService.offense.findMany.mockResolvedValue([
      { id: 'offense1', category: 'theft' },
      { id: 'offense2', category: 'fraud' },
    ]);

    // A
    const result = await service.findAll(fakeUser as any);

    // A
    expect(result).toBeDefined();
  });

  // TEST 3
  it('should the user be an agency user', async () => {
    // A
    const fakeUser = { id: 'fake-user-id', role: 'agency_staff' };

    mockPrismaService.userAccessScope.findMany.mockResolvedValue([
      { category: 'theft' },
    ]);

    mockPrismaService.offense.findMany.mockResolvedValue([
      { id: 'offense1', category: 'theft' },
      { id: 'offense2', category: 'fraud' },
    ]);

    // A
    const result = await service.findAll(fakeUser as any);

    // A
    expect(result).toBeDefined();
  });
});
