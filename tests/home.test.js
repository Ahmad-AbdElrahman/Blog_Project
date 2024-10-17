const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Import your Express app
const Post = require('../server/models/Post');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST, { useNewUrlParser: true });
});

afterAll(async () => {
  await Post.deleteMany({});
  await mongoose.connection.close();
});

describe('Home Page and Post Routes', () => {
  it('should display the home page with paginated posts', async () => {
    await Post.create([
      { title: 'Post 1', body: 'Content 1' },
      { title: 'Post 2', body: 'Content 2' },
    ]);

    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Thought Stream'); // Check if the title is rendered
    expect(res.text).toContain('Post 1'); // Check if sample posts are displayed
  });

  it('should display the about page', async () => {
    const res = await request(app).get('/about');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('About');
  });

  it('should display a specific post by ID', async () => {
    const post = await Post.create({ title: 'Test Post', body: 'Test Content' });

    const res = await request(app).get(`/post/${post._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Test Post'); // Check if the post is displayed
    expect(res.text).toContain('Test Content');
  });

  it('should search for posts by term', async () => {
    await Post.create({ title: 'Unique Post', body: 'Unique Content' });

    const res = await request(app)
      .post('/search')
      .send({ searchTerm: 'Unique' });

    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('Unique Post');
  });
});