const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../server/models/User'); // Adjust the path as necessary


describe('User Model', () => {
  const uniqueUsername = `testuser_${Date.now()}`; // Unique username for each test
  const uniqueEmail = `testemail_${Date.now()}@example.com`; // Unique email for each test

  beforeEach(async () => {
    // Clean up any existing users with the same username or email before each test
    await User.deleteMany({ username: uniqueUsername });
    await User.deleteMany({ email: uniqueEmail });
  });

  it('should create a user successfully', async () => {
    const hashedPassword = await bcrypt.hash('hashedpassword', 10);
    
    const user = new User({
      username: uniqueUsername,
      password: hashedPassword,
      email: uniqueEmail,
      profile: {
        firstName: "Test",
        lastName: "User",
        bio: "This is a test bio",
      }
    });

    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(uniqueUsername);
    expect(savedUser.email).toBe(uniqueEmail);
    expect(savedUser.profile.firstName).toBe("Test");
  });

  it('should not create a user without a username', async () => {
    const user = new User({
      password: await bcrypt.hash('hashedpassword', 10),
      email: uniqueEmail
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

  it('should not create a user without an email', async () => {
    const user = new User({
      username: uniqueUsername,
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
      username: uniqueUsername,
      email: uniqueEmail,
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
      username: uniqueUsername,
      password: hashedPassword,
      email: uniqueEmail,
    });
    await user1.save();

    // Attempt to create a second user with the same username but a different email
    const user2 = new User({
      username: uniqueUsername,
      password: await bcrypt.hash('anotherpassword', 10),
      email: `different_${uniqueEmail}`,
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

  it('should not create a user with a duplicate email', async () => {
    const hashedPassword = await bcrypt.hash('hashedpassword', 10);

    // Create the first user
    const user1 = new User({
      username: uniqueUsername,
      password: hashedPassword,
      email: uniqueEmail,
    });
    await user1.save();

    // Attempt to create a second user with the same email but a different username
    const user2 = new User({
      username: `different_${uniqueUsername}`,
      password: await bcrypt.hash('anotherpassword', 10),
      email: uniqueEmail,
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