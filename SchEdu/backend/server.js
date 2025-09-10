const express = require('express');
require('dotenv').config();

const { sequelize, syncModels } = require('./models');

const app = express();

app.use(express.json());

syncModels()
  .then(() => {
    console.log('Database synchronized');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
    process.exit(1);
  });
