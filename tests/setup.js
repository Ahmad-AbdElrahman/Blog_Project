const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../server/config/db');
const app = require('../app');
connectDB();

let server;

beforeAll(async () => {
  server = app.listen(5001); // Use a different port for tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the connection after tests
  server.close(); // Ensure the server is closed after tests to free the port
});
