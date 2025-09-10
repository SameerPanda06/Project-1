const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  const testUser = {
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'student',
  };

  afterAll(async () => {
    // Cleanup: delete test user if exists
    await request(app).delete(`/api/users/email/${testUser.email}`);
  });

  test('POST /api/auth/register - success', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('userId');
  });

  test('POST /api/auth/register - duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    expect(res.statusCode).toBe(409);
  });

  test('POST /api/auth/login - success', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('role', testUser.role);
  });

  test('POST /api/auth/login - wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/auth/login - non-existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'password123' });
    expect(res.statusCode).toBe(401);
  });
});
