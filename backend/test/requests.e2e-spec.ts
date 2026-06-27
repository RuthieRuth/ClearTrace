import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { Test } from '@nestjs/testing/test';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PrismaService } from 'src/prisma.service';

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
  request: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  userAccessScope: {
    createMany: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
};

describe('Requests (e2e)', () => {
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

  //TEST 1 for get all requests
  it('should get all requests', async () => {
    // Arrange
    mockPrismaService.request.findMany.mockResolvedValue([]);

    // Act
    const response = await request(app.getHttpServer())
      .get('/requests')
      .expect(200);

    // Assert
    expect(response.status).toBe(200);
  });
});
