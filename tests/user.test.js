const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../server/models/User'); // Adjust the path as necessary


describe('User Model', () => {
  const username = `testuser_${Date.now()}`; // Unique username for each test

  beforeEach(async () => {
    // Clean up any existing users with the same username before each test
    await User.deleteMany({ username });
  });

  it('should create a user successfully', async () => {
    const hashedPassword = await bcrypt.hash('hashedpassword', 10);
    
    const user = new User({
      username,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(username);
  });

  it('should not create a user without a username', async () => {
    const user = new User({
      password: await bcrypt.hash('hashedpassword', 10),
    });

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
  });

  it('should not create a user without a password', async () => {
    const user = new User({
      username,
    });

    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.name).toBe('ValidationError');
  });

  it('should not create a user with a duplicate username', async () => {
    const hashedPassword = await bcrypt.hash('hashedpassword', 10);

    // Create the first user
    const user1 = new User({
      username,
      password: hashedPassword,
    });
    await user1.save();

    // Attempt to create a second user with the same username
    const user2 = new User({
      username,
      password: await bcrypt.hash('anotherpassword', 10),
    });

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });
});