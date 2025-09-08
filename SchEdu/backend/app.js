const express = require('express');
require('dotenv').config();

const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const timetableRoutes = require('./routes/timetable');
const notificationRoutes = require('./routes/notification');
const leaveRoutes = require('./routes/leave');
const adminSetupRoutes = require('./routes/adminSetup');

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/admin/setup', adminSetupRoutes);

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced successfully.');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
};
const cors = require('cors');
app.use(cors());


startServer();
