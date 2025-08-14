# Mini LMS Dashboard

A **Mini Learning Management System** built with **Next.js (App Router)**, **Firebase Firestore**, and **Docker**.  
Supports **mock authentication**, **role-based access control**, and **CRUD** operations for courses and lessons.

---

## Features

- **Mock Authentication**
  - Email/username-based login (no backend)
  - Auth state persistence using cookies/localStorage
  - Role-based access: `admin` (full CRUD) / `user` (view only)

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

##  Task Requirements Coverage
✅ Next.js App Router  
✅ Mock authentication & role-based access  
✅ Firebase Firestore CRUD (except for the update functionality)
✅ Protected routes  
✅ React Query for data handling  
✅ Responsive UI with Tailwind & MUI  
✅ Dockerized environment  
✅ Unit tests with Jest  (Just one file)
✅ Zod form validation

---