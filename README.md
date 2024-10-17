
# Thought Stream

This blog platform allows users to create, edit, and delete blog posts. This platform supports authentication.

## Tech Stack

- **Backend**: Node.js (with Express)
- **Database**: MongoDB (using Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Frontend**: EJS for templating

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/Ahmad-AbdElrahman/Blog_Project.git
   cd blog-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and add your MongoDB URI and JWT secret:
   ```bash
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

   The application will be running at `http://localhost:5000`.

## Usage Guidelines

- **Authentication**: Register and log in to create and manage your blog posts.
- **Creating Posts**: Once logged in, navigate to the "Create Post" page to add a new blog post.
- **Editing/Deleting Posts**: From your profile or the post page, you can edit or delete posts you have authored.

## Project Architecture

```
├── servers
│   ├── config         
│   │   └── db.js           # Configures the database connection (MongoDB)
│   ├── helpers         
│   │   └── routeHelpers.js # Contains utility functions for route handling
│   ├── models         
│   │   └── User.js         # Defines the User schema for authentication and profile management
│   │   └── Post.js         # Defines the Post schema for storing blog posts
│   ├── routes
│   │   └── admin.js        # Handles authentication, post CRUD operations, and JWT verification
│   │   └── main.js         # Manages routes for public-facing pages (e.g., homepage, blog posts)
├── views                   # Templates for rendering UI using EJS
│   ├── admin               # Admin-specific EJS templates (e.g., dashboard, post management)
│   ├── layouts             # Layout templates for consistent page structure (e.g., header, footer)
│   ├── partials            # Partial templates (e.g., reusable components like navigation bars)
├── public
│   ├── css                 # Stylesheets for styling the platform
│   ├── images              # Static images used throughout the platform
│   ├── javascript          # Client-side JavaScript files (for interactivity)
├── tests
│   ├── auth.test.js        # Tests for user authentication (registration, login, logout)
│   ├── home.test.js        # Tests for home page, about page, individual post, and search routes
│   ├── post.test.js        # Tests for Post model creation and validation
│   └── user.test.js        # Tests for User model creation and validation
└── app.js                  # Main entry point for starting the server and initializing routes
```