# 🧠 CollabBoard – Real-Time Collaborative Kanban Backend

**CollabBoard** is a real-time collaborative Kanban board (Trello-style) backend built with **Node.js**, **Express**, **MongoDB Atlas**, and **Socket.IO**. This backend powers features like authentication, real-time sync, smart task assignment, and conflict resolution.


## 🚀 Features

- 🔐 JWT authentication with secure cookies
- 📦 Real-time task updates using Socket.IO
- 🧠 Smart Assign: Assign tasks to the user with the fewest active tasks
- ⚔️ Conflict Detection: Handle simultaneous edits gracefully
- 📜 Activity Log: Tracks the last 20 user actions
- 📚 API documentation via Swagger (`/api-docs`)
- ✅ Modular, clean architecture
- 🐳 Production-ready Docker setup


## 🛠 Tech Stack

- **Backend**: Node.js, Express
- **Database**: MongoDB Atlas
- **WebSockets**: Socket.IO
- **Authentication**: JWT + Cookies
- **Documentation**: Swagger UI (OpenAPI 3)
- **Developer Tools**: Docker, Nodemon, Morgan


## 📁 Folder Structure

```
server/
├── controllers/      # Business logic
├── middleware/       # Auth middleware
├── models/           # MongoDB models
├── routes/           # API routes
├── utils/            # Smart assign, conflict logic
├── config/           # DB & Swagger config
├── socket/           # Socket.IO setup
├── .env              # Environment config
├── Dockerfile
├── docker-compose.yml
└── index.js         # Entry point
```


## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/collabboard-server.git
cd collabboard-server
```

### 2. Create a .env File

In the root of the `server/` folder, add:

```
NODE_ENV=
PORT=
MONGO_URI=
JWT_SECRET=
```

> 🔐 Do not commit this file. It's excluded by .gitignore.


## 🐳 Run with Docker

### Using Docker Compose

```bash
docker-compose up --build
```

### Or manually:

```bash
docker build -t collabboard-server .
docker run --env-file .env -p 5000:5000 collabboard-server
```


## 📘 API Documentation (Swagger)

To explore all API endpoints interactively:

1. Start the server
2. Open: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

You’ll find full docs for:

- Auth (/api/auth)
- Tasks (/api/tasks)
- Logs (/api/logs)

Use the "Authorize" button to enter your JWT token to test protected routes.


## 🔐 JWT Authentication

- JWTs are issued on login and stored in HTTP-only cookies.
- Protected routes require a valid token.
- Swagger UI supports auth testing with Bearer tokens.


## 📡 Socket.IO Events

| Event         | Description                                   |
|---------------|-----------------------------------------------|
| joinBoard     | Join a board-specific room                    |
| leaveBoard    | Leave the room                                |
| taskCreated    | Notify users a new task was added             |
| taskUpdated    | Broadcast task updates                         |
| taskDeleted    | Notify users when task is deleted             |


## 📘 API Endpoints

### 🔐 Auth

- **POST** /api/auth/register — Register a new user
- **POST** /api/auth/login — Login and receive JWT
- **GET** /api/auth/me — Get logged-in user info


### 📋 Tasks

- **GET** /api/tasks — Fetch all tasks
- **POST** /api/tasks — Create a task
- **PUT** /api/tasks/:id — Update a task
- **DELETE** /api/tasks/:id — Delete a task


### 📝 Logs

- **GET** /api/logs — Fetch last 20 user actions


## 📄 Logic_Document.md (included)

This file explains the custom logic for:

- ✅ Smart Assign: Find user with fewest active tasks
- ⚔️ Conflict Detection: Handle concurrent updates and let user resolve them


## 🔗 Related Repos & Links

- ✅ Frontend Repo (React + Tailwind)
- 📺 Demo Video (5–10 minute feature walkthrough)


## 🧑‍💻 Author

Chibuike Obiora  
[LinkedIn](https://www.linkedin.com/in/obiorachibuike)


## 📄 License

Licensed under the MIT License.


---

