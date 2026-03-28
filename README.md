# Career Connect

A modern job platform connecting university students with employers. Built with React, Node.js, Express, and MongoDB.

![Career Connect](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## Features

### For Students
- Browse and search job listings
- Smart job matching based on skills
- Save/bookmark jobs
- Track application status
- Career path suggestions
- Profile management with skills

### For Employers
- Post new job openings
- View and manage applicants
- Update application status (Pending → Reviewed → Interview → Accepted/Rejected)
- Company profile management

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Hot Toast
- React Router

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- JWT Authentication
- bcryptjs

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd unicareer
```

2. **Setup Backend**
```bash
cd backend
npm install
```

3. **Create .env file in backend**
```env
MONGODB_URI=mongodb://localhost:27017/unicareer
PORT=3000
CLIENT_URL=http://localhost:5173
```

4. **Start Backend**
```bash
node server.js
```

5. **Setup Frontend**
```bash
cd frontend
npm install
```

6. **Start Frontend**
```bash
npm run dev
```

7. **Access the app**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Test Credentials

### Students
| Email | Password | Skills |
|-------|----------|--------|
| john@student.edu | pass123 | JavaScript, React, Node.js |
| sarah@student.edu | pass123 | Python, ML, TensorFlow |
| mike@student.edu | pass123 | Java, Spring Boot, AWS |

### Employers
| Email | Password | Company |
|-------|----------|---------|
| hr@company.com | pass123 | Tech Corp |
| jane@company.com | pass123 | AI Solutions |
| tom@startup.com | pass123 | Startup Inc |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| POST | /api/auth/logout | User logout |
| GET | /api/auth/me | Get current user |

### Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/student/jobs | Get all jobs |
| GET | /api/student/jobs/recommended | Get recommended jobs |
| POST | /api/student/jobs/:id/apply | Apply for job |
| POST | /api/student/jobs/:id/bookmark | Bookmark job |
| DELETE | /api/student/jobs/:id/bookmark | Remove bookmark |
| GET | /api/student/applications | Get applications |
| GET | /api/student/career-path | Get career suggestions |

### Employee Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/employee/jobs | Get posted jobs |
| GET | /api/employee/jobs/:id/applicants | Get applicants for job |
| PATCH | /api/employee/applications/:id/status | Update application status |

### Profile Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/profile/student | Get student profile |
| PUT | /api/profile/student | Update student profile |
| POST | /api/profile/student/skills | Add skill |
| DELETE | /api/profile/student/skills | Remove skill |
| GET | /api/profile/employee | Get employee profile |
| PUT | /api/profile/employee | Update employee profile |

## Project Structure

```
├── backend/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── matchingController.js
│   │   ├── applicationController.js
│   │   ├── employeeController.js
│   │   └── profileController.js
│   ├── models/
│   │   ├── Student.js
│   │   ├── Employee.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   └── Bookmark.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── employeeRoutes.js
│   │   └── profileRoutes.js
│   ├── middlewares/
│   │   └── mockAuth.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── seedData.js
│   ├── server.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── EmployeeDashboard.jsx
│   │   │   ├── StudentProfile.jsx
│   │   │   └── EmployeeProfile.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Smart Matching

The app uses a skill-based matching algorithm:

```
Match Percentage = (Matched Skills / Required Skills) × 100
```

Jobs are recommended based on:
- Student's current skills
- Job requirements
- Career path suggestions

## Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/unicareer
PORT=3000
CLIENT_URL=http://localhost:5173
```

## License

This project is licensed under the MIT License.

## Author

Built for UNI Career Connect - Connecting talent with opportunity.