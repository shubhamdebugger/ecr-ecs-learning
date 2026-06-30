process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.JWT_SECRET = 'test-jwt-secret-that-is-at-least-32-chars-long!!';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-characters-long!';
process.env.PORT = '5001';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.BASE_URL = 'http://localhost:5001';
