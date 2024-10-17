
# ThoughtStream



**ThoughtStream** is a simple blog platform created with Node.js, Express, and MongoDB. It allows users to create, read, update, and delete blog posts, as well as manage user authentication.



## Table of Contents



- [Features](#features)

- [Technologies](#technologies)

- [Project Structure](#project-structure)

- [Installation](#installation)

- [Usage](#usage)

- [Testing](#testing)

- [Contributing](#contributing)

- [License](#license)



## Features


- User registration and authentication

- Create, edit, and delete blog posts

- Pagination for blog posts

- Search functionality for posts

- Admin dashboard for managing content



## Technologies



- **Backend:** Node.js, Express

- **Database:** MongoDB with Mongoose

- **Authentication:** JWT (JSON Web Tokens) and bcrypt for password hashing

- **View Engine:** EJS (Embedded JavaScript)

- **Styling:** CSS

- **Testing:** Jest and Supertest for unit and integration tests



## Project Structure

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

## Testing

To run the tests, use the following command:
    ```bash
    npm test
    ```

The tests cover user authentication, post management, and the home page functionality.

## Usage Guidelines

- **Authentication**: Register and log in to create and manage your blog posts.
- **Creating Posts**: Once logged in, navigate to the "Create Post" page to add a new blog post.
- **Editing/Deleting Posts**: From your profile or the post page, you can edit or delete posts you have authored.

## Contributing

If you'd like to contribute to ThoughtStream, feel free to open a pull request or submit issues for any bugs or feature requests.

## License

This project is licensed under the MIT License.