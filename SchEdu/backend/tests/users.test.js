const request = require('supertest');
const app = require('../app');

describe('Users API', () => {
  let createdUserId;

  // Generate unique email per test run to avoid conflicts
  const uniqueEmail = `testuser+${Date.now()}@example.com`;

  const userData = {
    email: uniqueEmail,
    password: 'password123',
    first_name: 'Test',
    last_name: 'User',
    role: 'teacher',
  };

  // Cleanup any existing user with this email before tests
  beforeAll(async () => {
    try {
      await request(app).delete(`/api/users/email/${encodeURIComponent(uniqueEmail)}`);
    } catch (_) {}
  });

  // Clean up created user after tests
  afterAll(async () => {
    if (createdUserId) {
      await request(app).delete(`/api/users/${createdUserId}`).catch(() => {});
    }
  });

  // Logging helper
  function logOnFail(res, expectedStatus) {
    if (res.statusCode !== expectedStatus) {
      console.error('Test failed:', {
        statusCode: res.statusCode,
        body: res.body,
      });
    }
  }

  test('Create user', async () => {
    const res = await request(app).post('/api/users').send(userData);
    logOnFail(res, 201);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdUserId = res.body.id;
  });

  test('Get all users', async () => {
    const res = await request(app).get('/api/users');
    logOnFail(res, 200);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Get user by id', async () => {
    expect(createdUserId).toBeDefined();
    const res = await request(app).get(`/api/users/${createdUserId}`);
    logOnFail(res, 200);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', uniqueEmail);
  });

  test('Update user', async () => {
    expect(createdUserId).toBeDefined();
    const res = await request(app).put(`/api/users/${createdUserId}`).send({ first_name: 'UpdatedName' });
    logOnFail(res, 200);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('first_name', 'UpdatedName');
  });

  test('Delete user', async () => {
    expect(createdUserId).toBeDefined();
    const res = await request(app).delete(`/api/users/${createdUserId}`);
    logOnFail(res, 204);
    expect(res.statusCode).toBe(204);
  });

  test('Get deleted user returns 404', async () => {
    expect(createdUserId).toBeDefined();
    const res = await request(app).get(`/api/users/${createdUserId}`);
    logOnFail(res, 404);
    expect(res.statusCode).toBe(404);
  });
});
