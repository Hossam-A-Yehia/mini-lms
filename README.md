# Mini LMS Dashboard

A **Mini Learning Management System** built with **Next.js (App Router)**, **Firebase Firestore**, and **Docker**.  
Supports **Firebase Authentication**, **role-based access control**, and **CRUD** operations for courses and lessons.

---

## Features

- **Firebase Authentication**
  - Email/password authentication with Firebase Auth
  - User registration and login functionality
  - Auth state persistence with Firebase
  - Role-based access: `admin` (full CRUD) / `user` (view only)
  - Real-time authentication state management

- **Course Management (CRUD)**
  - Create, edit, delete, and view courses
  - Show lesson count per course

- **Lesson Management (CRUD)**
  - Create, edit, delete, and view lessons
  - Markdown content support (optional)

- **Dashboard**
  - Responsive layout with navigation (Courses, Logout)
  - Displays logged-in user's name and role

- **Data Handling**
  - Uses **React Query** for fetching/mutations
  - Proper loading & error states
  - Optional optimistic updates

- **Tech & Tooling**
  - Firebase Firestore for storage
  - **Tailwind CSS** + MUI for styling
  - **Zod** for form validation
  - **Jest + React Testing Library** for unit tests
  - **Docker** for containerized setup

---

## Technologies

- [Next.js 13+ (App Router)]
- [React 19]
- [Firebase Firestore]
- [Tailwind CSS]
- [MUI]
- [React Query]
- [Zod]
- [Jest]
- [Docker]

---

## Project Structure

```
src/
 ├── app/              # Next.js App Router pages & layouts
 ├── components/       # Reusable UI components
 ├── hooks/            # Custom React hooks
 ├── lib/              # Firebase & utilities
 ├── models/           # TypeScript models
 └── tests/            # Unit tests
```

---

## Setup Instructions

### 1️- Clone the repository
```bash
git clone https://github.com/Hossam-A-Yehia/mini-lms.git
cd mini-lms
```

### 2️- Install dependencies
```bash
npm install
```

### 3️- Run locally
```bash
npm run dev
```
App will be available at: **http://localhost:3000**

---

##  Running with Docker

Build and run using Docker Compose:
```bash
docker-compose up --build
```
Then visit: **http://localhost:3000**

---

##  Running Tests
```bash
npm run test
```

---

##  User Roles

| Role   | Permissions |
|--------|-------------|
| Admin  | Create, edit, delete, view courses & lessons |
| User   | View courses & lessons only |

---

##  Authentication & Testing

### Firebase Auth Setup
The application uses Firebase Authentication for secure user management. Users can:
- **Register** new accounts with email/password
- **Login** with existing credentials
- **Logout** securely

### Role Assignment
User roles are automatically determined based on email:
- **Admin Role** → Emails containing `admin` (e.g., `admin@example.com`)
- **User Role** → All other email addresses

### Testing Authentication
1. **Create Admin Account**: Register with an email containing "admin" (e.g., `admin@test.com`)
2. **Create User Account**: Register with any other email (e.g., `user@test.com`)
3. **Login/Logout**: Use the authentication form to test login/logout functionality

**Note**: When you register a new account, Firebase automatically logs you in immediately after account creation. This is standard Firebase behavior and provides a seamless user experience - no need to manually login after registration.

---


##  Task Requirements Coverage   
✅ Next.js App Router  
✅ Firebase authentication & role-based access   
✅ Firebase Firestore CRUD (except for the update functionality)      
✅ Protected routes  
✅ React Query for data handling   
✅ Responsive UI with Tailwind & MUI  
✅ Dockerized environment  
✅ Unit tests with Jest  (Just one file)   
✅ Zod form validation 

---
