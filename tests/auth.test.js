const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import your Express app
const User = require('../servers/models/User');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User Created');
  });

  it('should not register a duplicate user', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body).toHaveProperty('message', 'User Already in use');
  });

  it('should login a registered user', async () => {
    const res = await request(app)
      .post('/admin')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(302); // Redirect to dashboard
    expect(res.headers['set-cookie'][0]).toMatch(/token=/); // Check if token is set
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/admin')
      .send({
        username: 'wronguser',
        password: 'wrongpass'
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Invalid credentials');
  });

  it('should logout the user', async () => {
    const res = await request(app).get('/logout');
    expect(res.statusCode).toEqual(302); // Redirect to homepage
  });
});