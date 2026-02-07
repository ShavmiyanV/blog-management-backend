# Blog Management Backend

A RESTful API backend for a blog management system built with Node.js, Express, and MySQL. This application provides user authentication, role-based authorization, and full CRUD operations for managing blogs.

## Features

- User authentication with JWT
- Role-based access control (Admin/User)
- CRUD operations for blogs
- Automatic blog summary generation
- Pagination support
- Secure password hashing with bcrypt
- MySQL database integration

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn
- Docker & Docker Compose (optional, for containerized deployment)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd blog-management-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=blog_app
JWT_SECRET=your_jwt_secret_key
```

### 4. Set up the database

Run the following command to create the database and tables:

```bash
mysql -u root -p < src/schema.sql
```

Or manually execute the SQL commands:

```sql
CREATE DATABASE blog_app;
USE blog_app;

-- Run the commands from src/schema.sql
```

### 5. Start the server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
node src/server.js
```

The server will start on `http://localhost:5001`

##  Running with Docker

### Using Docker Compose (Recommended)

1. Make sure you have Docker and Docker Compose installed

2. Update the `docker-compose.yml` MySQL environment variables if needed

3. Run the application:

```bash
docker-compose up -d
```

This will start both the Node.js application and MySQL database in containers.

4. Access the API at `http://localhost:5001`

5. To stop the containers:

```bash
docker-compose down
```

### Using Docker only

1. Build the Docker image:

```bash
docker build -t blog-management-backend .
```

2. Run the container:

```bash
docker run -p 5001:5001 --env-file .env blog-management-backend
```

##  Database Schema

### Users Table

| Column     | Type                    | Description                          |
|------------|-------------------------|--------------------------------------|
| id         | INT (Primary Key)       | Auto-incrementing user ID            |
| name       | VARCHAR(100)            | User's full name                     |
| email      | VARCHAR(100) UNIQUE     | User's email address                 |
| password   | VARCHAR(255)            | Hashed password                      |
| role       | ENUM('ADMIN', 'USER')   | User role (default: 'USER')          |
| created_at | TIMESTAMP               | Account creation timestamp           |

### Blogs Table

| Column     | Type                    | Description                          |
|------------|-------------------------|--------------------------------------|
| id         | INT (Primary Key)       | Auto-incrementing blog ID            |
| title      | VARCHAR(255)            | Blog title                           |
| content    | TEXT                    | Full blog content                    |
| summary    | VARCHAR(300)            | Auto-generated summary               |
| author_id  | INT (Foreign Key)       | References users(id)                 |
| created_at | TIMESTAMP               | Blog creation timestamp              |
| updated_at | TIMESTAMP               | Last update timestamp                |

**Relationships:**
- `blogs.author_id` → `users.id` (CASCADE DELETE)

##  API Documentation

### Base URL
```
http://localhost:5001
```

### Authentication

All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

### Auth Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:** `201 Created`
```json
{
  "message": "User registered successfully"
}
```

---

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Blog Endpoints

#### Get All Blogs
```http
GET /blogs?page=1&limit=10
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "My First Blog",
    "content": "This is the full content...",
    "summary": "Auto-generated summary...",
    "author_id": 1,
    "created_at": "2026-02-07T10:00:00.000Z",
    "updated_at": "2026-02-07T10:00:00.000Z"
  }
]
```

---

#### Get Blog by ID
```http
GET /blogs/:id
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "My First Blog",
  "content": "This is the full content...",
  "summary": "Auto-generated summary...",
  "author_id": 1,
  "created_at": "2026-02-07T10:00:00.000Z",
  "updated_at": "2026-02-07T10:00:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Blog not found"
}
```

---

#### Create Blog
```http
POST /blogs
```

**🔒 Protected Route** - Requires authentication

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My Blog Title",
  "content": "This is the full content of my blog post..."
}
```

**Response:** `201 Created`
```json
{
  "message": "Blog created"
}
```

---

#### Update Blog
```http
PUT /blogs/:id
```

**🔒 Protected Route** - Requires authentication

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Blog Title",
  "content": "Updated content..."
}
```

**Response:** `200 OK`
```json
{
  "message": "Blog updated successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Blog not found"
}
```

---

#### Delete Blog
```http
DELETE /blogs/:id
```

**🔒 Protected Route** - Requires authentication

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "message": "Blog deleted successfully"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Blog not found"
}
```

---

### User Endpoints

#### Get User Profile
```http
GET /users/profile
```

**🔒 Protected Route** - Requires authentication

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "created_at": "2026-02-07T10:00:00.000Z"
}
```

---

#### Get All Users
```http
GET /users
```

**🔒 Protected Route** - Requires authentication + Admin role

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER",
    "created_at": "2026-02-07T10:00:00.000Z"
  }
]
```

**Error Response:** `403 Forbidden`
```json
{
  "message": "Access denied. Admin only."
}
```

---

#### Get User by ID
```http
GET /users/:id
```

**🔒 Protected Route** - Requires authentication

**Request Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "created_at": "2026-02-07T10:00:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "User not found"
}
```

---

## 🔐 Security Features

- **Password Hashing**: All passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Admin and User roles with different permissions
- **Input Validation**: Request validation on all endpoints
- **CORS Enabled**: Cross-Origin Resource Sharing configured

## 📁 Project Structure

```
blog-management-backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── auth.controller.js  # Authentication logic
│   │   ├── blog.controller.js  # Blog CRUD operations
│   │   └── user.controller.js  # User management
│   ├── middleware/
│   │   ├── auth.middleware.js  # JWT verification
│   │   ├── admin.middleware.js # Admin role check
│   │   └── role.middleware.js  # Generic role checker
│   ├── routes/
│   │   ├── auth.routes.js      # Auth endpoints
│   │   ├── blog.routes.js      # Blog endpoints
│   │   └── user.routes.js      # User endpoints
│   ├── utils/
│   │   └── summaryGenerator.js # Auto-summary generation
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   └── schema.sql              # Database schema
├── .env                        # Environment variables
├── .gitignore
├── docker-compose.yml          # Docker Compose config
├── Dockerfile                  # Docker image config
├── package.json
└── README.md
```

## 🧪 Testing with Postman

1. Import the API endpoints into Postman
2. Create an environment with:
   - `base_url`: `http://localhost:5001`
   - `token`: (will be set after login)
3. Register a user via `/auth/register`
4. Login via `/auth/login` and save the token
5. Use the token in the Authorization header for protected routes

##  Troubleshooting

### Server crashes on startup
- **Solution**: Make sure `admin.middleware.js` exists in the middleware folder

### Cannot connect to database
- **Solution**: Verify MySQL is running and credentials in `.env` are correct

### Port already in use
- **Solution**: Kill the process using the port:
```bash
lsof -ti:5001 | xargs kill -9
```

### Unauthorized errors
- **Solution**: Ensure you're sending the JWT token in the Authorization header as `Bearer <token>`

## 📝 License

ISC

## 👨‍💻 Author

Shavmiyan V.