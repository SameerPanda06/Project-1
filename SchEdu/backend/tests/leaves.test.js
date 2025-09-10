const request = require('supertest');
const app = require('../app');

describe('Leaves API', () => {
  let createdLeaveId;

  const leaveData = {
    teacher_id: 1, // use a valid teacher user ID from your DB for tests
    leave_type: 'sick',
    start_date: '2025-10-01',
    end_date: '2025-10-05',
    reason: 'Feeling unwell',
    status: 'pending',
    priority: 3,
  };

  test('POST /api/leaves - create leave', async () => {
    const res = await request(app)
      .post('/api/leaves')
      .send(leaveData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdLeaveId = res.body.id;
  });

  test('GET /api/leaves - get all leaves', async () => {
    const res = await request(app).get('/api/leaves');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /api/leaves/:id - get leave by id', async () => {
    const res = await request(app).get(`/api/leaves/${createdLeaveId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', createdLeaveId);
  });

  test('PUT /api/leaves/:id - update leave', async () => {
    const res = await request(app)
      .put(`/api/leaves/${createdLeaveId}`)
      .send({ reason: 'Updated reason' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('reason', 'Updated reason');
  });

  test('PATCH /api/leaves/:id/approve - approve leave', async () => {
    const res = await request(app)
      .patch(`/api/leaves/${createdLeaveId}/approve`)
      .send({ approved_by: 1 }); // example approver ID
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('PATCH /api/leaves/:id/reject - reject leave', async () => {
    // To test rejection, recreate the leave or mock as appropriate
    const res = await request(app)
      .patch(`/api/leaves/${createdLeaveId}/reject`)
      .send({ rejected_by: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'rejected');
  });
});
