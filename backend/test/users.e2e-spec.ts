import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import request from 'supertest';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guards';

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
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  userAccessScope: {
    createMany: jest.fn(),
  },
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Build whole app
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

  //TEST 1
  it('should get the current user logged in', async () => {
    // Arrange
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: 'superadmin',
    });

    // Act
    const response = await request(app.getHttpServer()).get('/users/me');

    // Assert
    expect(response.status).toBe(200);
  });

  //TEST 2
  it('should get all users', async () => {
    // Arrange
    mockPrismaService.user.findMany.mockResolvedValue([
      {
        id: 'fake-user-id',
        username: 'fakeUser',
        full_name: 'Fake User',
        role: 'superadmin',
      },
    ]);

    // Act
    const response = await request(app.getHttpServer()).get('/users');

    // Assert
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    await app.close();
  });

  //TEST 3
  it('should get a user by ID', async () => {
    // Arrange
    mockPrismaService.user.findUnique.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: 'superadmin',
    });

    // Act
    const response = await request(app.getHttpServer()).get(
      '/users/fake-user-id',
    );

    // Assert
    expect(response.status).toBe(200);
  });

  //TEST 4
  it('should create a new user', async () => {
    // Arrange
    const newUser = {
      username: 'newUser',
      full_name: 'New User',
      role: 'user',
      password: 'password123',
    };
    mockPrismaService.user.create.mockResolvedValue({
      id: 'new-user-id',
      ...newUser,
    });

    //Act
    const response = await request(app.getHttpServer())
      .post('/users')
      .send(newUser);

    // Assert
    expect(response.status).toBe(201);
  });

  //TEST 5
  it('should update a user by ID', async () => {
    // Arrange
    const updatedUser = {
      full_name: 'Updated User',
    };
    mockPrismaService.user.update.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Updated User',
      role: 'superadmin',
    });

    // Act
    const response = await request(app.getHttpServer())
      .patch('/users/fake-user-id')
      .send(updatedUser);

    // Assert
    expect(response.status).toBe(200);
  });

  //TEST 6
  it('should delete a user by ID', async () => {
    // Arrange
    mockPrismaService.user.delete.mockResolvedValue({
      id: 'fake-user-id',
      username: 'fakeUser',
      full_name: 'Fake User',
      role: 'superadmin',
    });

    //Act
    const response = await request(app.getHttpServer()).delete(
      '/users/fake-user-id',
    );

    // Assert
    expect(response.status).toBe(200);
  });
});
