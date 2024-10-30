const request = require('supertest');
const app = require('../app');
const User = require('../server/models/User');
const bcrypt = require('bcrypt');

// Clean up before each test
beforeEach(async () => {
  await User.deleteMany({});
});

describe('User Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123', // min length of 8
        email: 'testuser@example.com' // valid email format
      });
    expect(res.statusCode).toEqual(302); // Assuming redirect after successful registration
  });

  it('should not register a user with an existing username or email', async () => {
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      });

    const res = await request(app)
      .post('/register')
      .send({
        username: 'testuser', // duplicate username
        password: 'password123',
        email: 'testuser@example.com' // duplicate email
      });
    expect(res.statusCode).toEqual(409); // Conflict error for duplicate entries
    expect(res.body).toHaveProperty('message', 'User Already in use');
  });

  it('should login a registered user', async () => {
    // Register user first
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      });

    const res = await request(app)
      .post('/admin')
      .send({
        username: 'testuser',
        password: 'password123' // plain password for login
      });
    expect(res.statusCode).toEqual(302); // Redirect to dashboard after login
    expect(res.headers['set-cookie'][0]).toMatch(/token=/); // Check for token cookie
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
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123',
        email: 'testuser@example.com'
      });

    // Log in the user
    await request(app)
      .post('/admin')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const res = await request(app).get('/logout');
    expect(res.statusCode).toEqual(302); // Redirect to homepage
  });
});