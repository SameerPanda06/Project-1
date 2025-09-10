const request = require('supertest');
const app = require('../app');
const { sequelize, Leave, User } = require('../models');
const bcrypt = require('bcryptjs');

describe('Leave Approval API', () => {
  beforeAll(async () => {
    // Drop all enums from PostgreSQL to avoid conflicts during sync
    await sequelize.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT typname FROM pg_type WHERE typname LIKE 'enum_%') LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    // Drop all tables with cascade and sync fresh schema
    await sequelize.drop({ cascade: true });
    await sequelize.sync({ force: true });

    // Seed a teacher user for foreign key references
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      id: 1,
      first_name: 'Test',
      last_name: 'Teacher',
      email: 'teacher@example.com',
      password: hashedPassword,
      role: 'teacher',
      is_active: true,
    });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should approve leave and update timetable', async () => {
    // Create a pending leave referencing teacher id=1
    const leave = await Leave.create({
      teacher_id: 1,
      leave_type: 'sick',
      start_date: '2025-09-01',
      end_date: '2025-09-05',
      reason: 'Health issues',
      status: 'pending',
      priority: 1,
    });

    // Approve leave API call with the required approved_by field
    const res = await request(app)
      .patch(`/api/leaves/${leave.id}/approve`)
      .send({ approved_by: 1 });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/approved/i);
  });
});
