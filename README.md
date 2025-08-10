# TestGenerator - AI-Powered Test Creation & Management Platform

![TestGenerator](https://img.shields.io/badge/TestGenerator-v1.0-blue.svg)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

## 🚀 Overview

**TestGenerator** is a comprehensive, AI-powered test creation and management platform built with the MERN stack. It enables educators to automatically generate tests from PDF documents and provides students with an intuitive interface to take tests and view results.

### ✨ Key Features

- **🤖 AI-Powered Test Generation** - Automatically extract questions from PDF documents
- **👨‍🎓 Role-Based Access Control** - Separate dashboards for administrators and students
- **📊 Real-Time Analytics** - Comprehensive test results and performance tracking
- **👤 Profile Management** - Complete user profiles with image upload
- **🔐 Secure Authentication** - JWT-based authentication system
- **📱 Responsive Design** - Works seamlessly on all devices
- **⚡ Real-Time Updates** - Instant feedback and live result updates

## 🛠️ Technology Stack

### Frontend
- **React.js** with Vite for fast development
- **Material-UI (MUI)** for modern, responsive components
- **Axios** for API communication
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for file uploads
- **PDF-Parse** for document processing
- **bcrypt** for password hashing

### Additional Tools
- **CORS** for cross-origin requests
- **dotenv** for environment configuration
- **Path** for file system operations

## 📁 Project Structure

```
TestGenerator/
├── backend/
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── adminAuth.js         # Admin authorization
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Test.js              # Test schema
│   │   └── Result.js            # Result schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── tests.js             # Test management routes
│   │   ├── results.js           # Result submission routes
│   │   ├── users.js             # User management routes
│   │   └── profile.js           # Profile management routes
│   ├── uploads/
│   │   ├── pdfs/                # Uploaded PDF files
│   │   └── profiles/            # Profile images
│   ├── server.js                # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── TestCreation.jsx
│   │   │   ├── TestTaking.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Developers.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── App.jsx              # Main app component
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TestGenerator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   MONGODB_URI=mongodb://localhost:27017/testgenerator
   JWT_SECRET=your_super_secret_jwt_key_here
   PORT=5000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register as a student or use admin credentials

## 👥 User Roles & Features

### 🎓 Student Features
- **Registration & Login** - Create account and secure login
- **Test Taking** - Interactive test interface with multiple question types
- **Results Viewing** - Detailed performance analytics
- **Profile Management** - Update personal info, upload profile picture
- **Dashboard** - View available tests and recent results

### 👨‍🏫 Administrator Features
- **Test Creation** - Upload PDFs and generate questions automatically
- **Question Management** - Edit, add, or remove questions
- **Student Management** - View all registered students
- **Analytics Dashboard** - Comprehensive test and student analytics
- **Test Publishing** - Control test availability
- **Profile Management** - Complete admin profile with specializations

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Tests
- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create new test (Admin)
- `GET /api/tests/:id` - Get specific test
- `PUT /api/tests/:id` - Update test (Admin)
- `DELETE /api/tests/:id` - Delete test (Admin)

### Results
- `POST /api/results` - Submit test results
- `GET /api/results` - Get user results
- `GET /api/results/test/:testId` - Get test results (Admin)

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/upload-image` - Upload profile image
- `DELETE /api/profile/delete-image` - Delete profile image

## 🎨 UI/UX Features

- **Modern Material Design** - Clean, intuitive interface
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark/Light Theme Support** - User preference-based theming
- **Real-time Feedback** - Instant validation and updates
- **Loading States** - Smooth user experience with loading indicators
- **Error Handling** - User-friendly error messages

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for secure password storage
- **Role-Based Access** - Separate permissions for students and admins
- **Input Validation** - Comprehensive data validation
- **File Upload Security** - Restricted file types and sizes
- **CORS Protection** - Configured cross-origin resource sharing

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/admin),
  profileImage: String,
  phone: String,
  address: Object,
  studentInfo: Object,
  adminInfo: Object,
  socialLinks: Object
}
```

### Test Model
```javascript
{
  title: String,
  description: String,
  questions: Array,
  totalPoints: Number,
  timeLimit: Number,
  isPublished: Boolean,
  createdBy: ObjectId,
  createdAt: Date
}
```

### Result Model
```javascript
{
  student: ObjectId,
  test: ObjectId,
  answers: Array,
  totalScore: Number,
  maxScore: Number,
  percentage: Number,
  timeSpent: Number,
  submittedAt: Date
}
```

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Ensure file upload directories are properly configured

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Netlify, Vercel, or GitHub Pages
3. Update API base URL for production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues & Solutions

- **Profile Picture Caching** - Resolved with timestamp-based cache busting
- **Test Submission Validation** - Fixed with comprehensive error handling
- **File Upload Paths** - Corrected directory structure and path consistency

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Developer

**Dheeraj Gaur**
- 🎓 BTech Computer Science Engineering
- 🏫 GLA University
- 🌐 Portfolio: [Your Portfolio Link]
- 📧 Email: [Your Email]
- 💼 LinkedIn: [Your LinkedIn]

## 🙏 Acknowledgments

- **Material-UI** for the excellent component library
- **MongoDB** for the robust database solution
- **React Team** for the amazing frontend framework
- **Node.js Community** for the powerful backend runtime

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](issues) section
2. Create a new issue with detailed description
3. Contact the developer directly

---

**⭐ If you found this project helpful, please give it a star!**

*Built with ❤️ using the MERN Stack*
