const mongoose = require('mongoose');
const Post = require('../server/models/Post');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true });
});

afterAll(async () => {
  await Post.deleteMany({});
  await mongoose.connection.close();
});

describe('Post Model', () => {
  it('should create a post successfully', async () => {
    const post = new Post({
      title: 'Test Title',
      body: 'Test Body Content',
    });

    const savedPost = await post.save();
    expect(savedPost._id).toBeDefined();
    expect(savedPost.title).toBe('Test Title');
    expect(savedPost.body).toBe('Test Body Content');
    expect(savedPost.createdAt).toBeDefined();
  });

  it('should not create a post without title', async () => {
    const post = new Post({
      body: 'Test Body Content',
    });

    let err;
    try {
      await post.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
  });

  it('should not create a post without body', async () => {
    const post = new Post({
      title: 'Test Title',
    });

    let err;
    try {
      await post.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeDefined();
    expect(err.errors.body).toBeDefined();
  });
});