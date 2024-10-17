const mongoose = require('mongoose');
const User = require('../servers/models/User'); // Adjust path as necessary

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB', { useNewUrlParser: true });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('User Model', () => {
  it('should create a user successfully', async () => {
    const user = new User({
      username: 'testuser',
      password: 'hashedpassword', // You may want to hash the password if your logic requires it
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
  });

  it('should not create a user without username', async () => {
    const user = new User({
      password: 'hashedpassword',
    });

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.username).toBeDefined();
  });

  it('should not create a user without password', async () => {
    const user = new User({
      username: 'testuser',
    });

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.password).toBeDefined();
  });
});