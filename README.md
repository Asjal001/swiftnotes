# 📝 SwiftNotes — Full Stack Note-Taking Application

A full-stack note-taking web application built with a modular architecture, strict state management, comprehensive test suites, and continuous code quality analysis via SonarQube.

---

## 🚀 Features

- **Authentication & Security:** Secure JWT-based user authentication, password hashing with bcrypt, and protected routes.
- **Note Management:** Full CRUD capabilities (Create, Read, Update, Delete) with rich text formatting and instant state sync.
- **Modern User Interface:** Responsive, accessible UI built with Tailwind CSS, supporting modal dialogues with automatic focus management.
- **User Profile Management:** View account details, edit profiles, change passwords, and safely perform account deletion with confirmation modals.
- **Code Quality & Reliability:** Static code analysis via SonarQube with ReDoS-safe validation rules, structured error handling, and automated test coverage.

---

## 🛠 Tech Stack

### Frontend
- **Framework:** React.js (Vite)
- **Styling:** Tailwind CSS, Lucide React (Icons)
- **Routing:** React Router DOM
- **Rich Text:** Tiptap Editor
- **Testing:** Jest, React Testing Library, JSDOM

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JSON Web Tokens (JWT), bcryptjs
- **Logging:** Pino, pino-http
- **Testing & Quality:** Chai, SonarQube Scanner

---

## ✅ Prerequisites

Make sure you have the following installed before running the project:

- **Node.js** v24.20.0 or higher
- **PostgreSQL** (running locally or a hosted instance)
- **npm** (comes with Node.js)

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/swiftnotes
JWT_SECRET=your_jwt_secret_key
```

### Frontend — `frontend/.env`

```env
VITE_SWIFT_NOTES_URL=http://localhost:5000/api
```

---

## 🖥️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/10pshine-cohort-9/cohort-9-mern-9049-asjal.git
cd cohort-9-mern-9049-asjal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and fill in the variables shown above.

Run Prisma migrations to set up the database:

```bash
npx prisma migrate deploy
```

Start the backend server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory and fill in the variables shown above.

Start the frontend dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173`

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

To generate a coverage report:

```bash
npm run test:coverage
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |

### Notes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Get all notes for the logged-in user |
| GET | `/api/notes/:id` | Get a single note |
| POST | `/api/notes` | Create a new note |
| PATCH | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user/profile` | Get user profile |
| PATCH | `/api/user/profile` | Update name and bio |
| PATCH | `/api/user/password` | Change password |
| DELETE | `/api/user` | Delete account |

> All `/api/notes` and `/api/user` endpoints require an `Authorization: Bearer <token>` header.

---

## 📁 Project Structure

```text
├── backend/
│   ├── config/             # Database connection and environment config
│   ├── controllers/        # Request handlers & route logic
│   ├── middlewares/        # Auth verification and error handling
│   ├── prisma/             # Prisma schema and migrations
│   ├── routes/             # Express API endpoints
│   ├── services/           # Business logic layer
│   ├── utils/              # Shared utilities (AppError, helpers)
│   └── tests/
│       ├── controllers/    # Controller test suites
│       └── services/       # Service unit test suites
│
├── frontend/
│   ├── __mocks__/          # Module mocks for Jest
│   └── src/
│       ├── api/            # Axios instance and API config
│       ├── assets/         # Static assets
│       ├── components/
│       │   ├── dashboard/  # NoteCard, NoteGrid, WelcomeBanner, AddNoteButton
│       │   └── notes/      # NoteEditor, EditorToolbar
│       ├── context/        # React Context (AuthContext)
│       ├── hooks/          # Custom hooks (useAuth)
│       ├── pages/          # Dashboard, NotePage, ProfilePage, Login, SignUp, Landing
│       └── __tests__/      # Component and page test suites
│
├── sonarqube/              # SonarQube analysis reports & artifacts
├── sonar-project.properties # SonarQube scanner configuration
└── README.md
```

---
