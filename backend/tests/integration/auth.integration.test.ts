import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((c) => c.deleteMany({})));
});

describe('Auth API Integration Tests', () => {
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 422 for invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: 'not-an-email' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it('should return 422 for weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, password: 'weak' });

      expect(response.status).toBe(422);
    });

    it('should return 409 for duplicate email', async () => {
      await request(app).post('/api/auth/register').send(testUser);
      const response = await request(app).post('/api/auth/register').send(testUser);

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(testUser);
    });

    it('should login successfully', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should return 401 for wrong password', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword123',
      });

      expect(response.status).toBe(401);
    });

    it('should return 401 for non-existent email', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@example.com',
        password: testUser.password,
      });

      expect(response.status).toBe(401);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.database.status).toBe('connected');
    });
  });
});
