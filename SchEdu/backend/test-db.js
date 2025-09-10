const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

async function test() {
  try {
    // Drop enums explicitly
    await sequelize.query(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT typname FROM pg_type WHERE typname LIKE 'enum_%') LOOP
          EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
        END LOOP;
      END $$;
    `);

    // Drop and sync DB
    await sequelize.drop({ cascade:true });
    await sequelize.sync({ force:true });

    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      id:1, first_name:'Test', last_name:'User', email:'test@example.com', password: hashedPassword, role:'teacher', is_active: true
    });

    console.log('DB sync and seed success.');
  } catch (err) {
    console.error('DB sync error:', err);
  } finally {
    await sequelize.close();
  }
}

test();
