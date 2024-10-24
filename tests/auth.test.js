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
        password: 'password123'
      });
    expect(res.statusCode).toEqual(302); 
    // expect(res.body).toHaveProperty('message', 'User Created'); // Uncommented to validate response
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
    // Register the user first to ensure they exist
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    const res = await request(app)
      .post('/admin')
      .send({
        username: 'testuser',
        password: 'password123' // Use plain password for login
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
    await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    // Log in the user to set the cookie
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