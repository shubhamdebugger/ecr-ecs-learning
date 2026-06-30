import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';

let mongoServer: MongoMemoryServer;
let accessToken: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const registerRes = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'Password123',
  });
  accessToken = registerRes.body.data.accessToken as string;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const { Url, Click } = mongoose.connection.collections;
  await Promise.all([Url?.deleteMany({}), Click?.deleteMany({})]);
});

describe('URL API Integration Tests', () => {
  describe('POST /api/urls', () => {
    it('should create a short URL', async () => {
      const response = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ originalUrl: 'https://www.example.com', title: 'Example' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.shortCode).toBeDefined();
      expect(response.body.data.originalUrl).toBe('https://www.example.com');
    });

    it('should create a URL with custom alias', async () => {
      const response = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ originalUrl: 'https://www.example.com', customAlias: 'my-custom' });

      expect(response.status).toBe(201);
      expect(response.body.data.customAlias).toBe('my-custom');
    });

    it('should return 409 for duplicate custom alias', async () => {
      await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ originalUrl: 'https://www.example.com', customAlias: 'duplicate' });

      const response = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ originalUrl: 'https://www.google.com', customAlias: 'duplicate' });

      expect(response.status).toBe(409);
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/urls')
        .send({ originalUrl: 'https://www.example.com' });

      expect(response.status).toBe(401);
    });

    it('should return 422 for invalid URL', async () => {
      const response = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ originalUrl: 'not-a-url' });

      expect(response.status).toBe(422);
    });
  });

  describe('GET /api/urls', () => {
    beforeEach(async () => {
      await Promise.all([
        request(app)
          .post('/api/urls')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ originalUrl: 'https://www.example1.com' }),
        request(app)
          .post('/api/urls')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ originalUrl: 'https://www.example2.com' }),
      ]);
    });

    it('should return paginated URLs', async () => {
      const response = await request(app)
        .get('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .query({ page: 1, limit: 10 });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.meta.total).toBe(2);
    });
  });

  describe('DELETE /api/urls/:id', () => {
    it('should delete a URL', async () => {
      const createRes = await request(app)
        .post('/api/urls')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ originalUrl: 'https://www.example.com' });

      const urlId = createRes.body.data.id as string;

      const deleteRes = await request(app)
        .delete(`/api/urls/${urlId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(deleteRes.status).toBe(200);
    });
  });
});
