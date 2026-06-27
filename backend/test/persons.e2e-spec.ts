import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { Test } from '@nestjs/testing';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import request from 'supertest';

// fake guard to bypass authentication and authorization by Clerk (ie users already exists)
class FakeAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = { id: 'fake-user-id', role: 'superadmin' }; // fake logged in user
    return true;
  }
}

// Mock the Clerk client to avoid making real API calls during tests
jest.mock('@clerk/backend', () => ({
  createClerkClient: jest.fn().mockReturnValue({
    users: {
      createUser: jest.fn().mockResolvedValue({ id: 'fake-clerk-id' }),
      deleteUser: jest.fn(),
    },
  }),
}));

const mockPrismaService = {
  person: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userAccessScope: {
    createMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('PersonsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      // Replace Prisma with fake
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    // Start app
    app = moduleFixture.createNestApplication();
    app.useGlobalGuards(new FakeAuthGuard());
    await app.init();
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  //TEST 1 for Post
  it('should create a new person', async () => {
    // Arrange
    const newPerson = {
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: '1990-01-01',
    };

    mockPrismaService.user.findUnique.mockResolvedValue({ id: 'fake-user-id' });

    mockPrismaService.person.create.mockResolvedValue({
      id: 'fake-person-id',
      ...newPerson,
    });

    // Act
    const response = await request(app.getHttpServer())
      .post('/persons')
      .send(newPerson);

    // Assert
    expect(response.status).toBe(201);
  });
});
