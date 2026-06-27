import {
  CanActivate,
  INestApplication,
  ExecutionContext,
} from '@nestjs/common';
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guard';

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
  offense: {
    delete: jest.fn(),
  }
};

describe('Offenses (e2e)', () => {
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

  // TEST 1 for Delete
  it('should delete an offense', async () => {
    // Arrange
    mockPrismaService.offense.delete.mockResolvedValue({
      id: 'fake-offense-id',
      first_name: 'John',
      last_name: 'Doe',
      date_of_birth: '1990-01-01',
    });

    // Act
    const response = await request(app.getHttpServer()).delete(
      '/offenses/fake-offense-id',
    );

    // Assert
    expect(response.status).toBe(200);
  });
});
