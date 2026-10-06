import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { Role } from '@prisma/client';

jest.mock('@clerk/backend', () => ({
  createClerkClient: jest.fn().mockReturnValue({
    users: {
      createUser: jest.fn().mockResolvedValue({ id: 'fake-clerk-id' }),
      deleteUser: jest.fn(),
    },
  }),
}));

describe('UsersService', () => {
  let service: UsersService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    userAccessScope: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService }, //when UsersService requests PrismaService, use mockPrismaService instead
      ],
    }).compile();

    service = module.get(UsersService);
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  // TEST 1: Check if user is created successfully
  it('should create a user', async () => {
    //arrange
    const inputDetails = {
      username: 'fakeUser',
      password: 'fakepassword',
      role: Role.agency_staff,
      full_name: 'Fake User',
    };

    mockPrismaService.user.create.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: Role.agency_staff,
    });

    //act
    const result = await service.create(inputDetails);

    //assert
    expect(result).toBeDefined();
  });

  // TEST 2: Check if user is created with offense access
  it('should check if user is created with offense access', async () => {
    // arrange
    const inputDetails = {
      username: 'fakeUser',
      password: 'fakepassword',
      role: Role.agency_staff,
      full_name: 'Fake User',
      offense_access: ['theft', 'fraud'],
    };

    mockPrismaService.user.create.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: Role.agency_staff,
    });

    // act
    // const result = await service.create(inputDetails); IGNORED cos this variable is not needed
    await service.create(inputDetails);

    // assert
    expect(mockPrismaService.userAccessScope.createMany).toHaveBeenCalled();
  });

  // TEST 3: Check if user is created without offense access
  it('should check if user is created without offense access', async () => {
    // arrange
    const inputDetails = {
      username: 'fakeUser',
      password: 'fakepassword',
      role: Role.agency_staff,
      full_name: 'Fake User',
      offense_access: [], // no selection made
    };

    mockPrismaService.user.create.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: Role.agency_staff,
    });

    // act
    await service.create(inputDetails);

    // assert
    expect(mockPrismaService.userAccessScope.createMany).not.toHaveBeenCalled();
  });

  // TEST 4: Check if user is deleted from Clerk if saving to Postgres fails
  it('should delete the user from Clerk if saving to Postgres fails', async () => {
    // arrange
    const inputDetails = {
      username: 'fakeUser',
      password: 'fakepassword',
      role: Role.agency_staff,
      full_name: 'Fake User',
    };

    mockPrismaService.user.create.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: Role.agency_staff,
    });

    mockPrismaService.user.create.mockRejectedValue(new Error('DB error'));

    // act + assert
    await expect(service.create(inputDetails)).rejects.toThrow('DB error');
  });
});
