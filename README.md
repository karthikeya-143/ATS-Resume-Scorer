# ATS Resume Scorer

A full-stack web application designed to analyze resumes and evaluate their compatibility with Applicant Tracking Systems (ATS), providing insights and recommendations to improve job matching.

## Tech Stack

- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **UI Icons**: Lucide React

## Features

### Authentication System
- User registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes middleware

### Modern UI/UX
- Glassmorphism design with Tailwind CSS
- Gradient backgrounds and smooth animations
- Responsive design for all devices
- Hover effects and transitions

### Resume Upload
- Drag-and-drop file upload interface
- Support for PDF and DOCX files
- File validation and preview
- Ready for ML processing integration

## Project Structure

```
ats-resume-scorer/
├── backend/
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Upload.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── public/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions
- the Machine Learning Part is Under Process
### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB:
   - Create a MongoDB Atlas account at https://www.mongodb.com/atlas
   - Create a new cluster and database
   - Get your connection string from the Atlas dashboard
   - Replace `<db_password>` in the connection string with your actual password

4. Create a `.env` file in the backend directory and add your environment variables:
   ```
   PORT=5000
   MONGODB_URI=your_actual_mongodb_connection_string_here
   JWT_SECRET=your_super_secret_jwt_key_here_use_a_long_random_string
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user and return JWT token
- `GET /api/auth/profile` - Get user profile (protected route)

## Security Features

- Password hashing using bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS enabled for cross-origin requests
- Environment variables for sensitive data

## Future Enhancements

- ML-based resume scoring algorithm
- Detailed ATS compatibility analysis
- Resume optimization suggestions
- User dashboard with analysis history
- Admin panel for managing users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
