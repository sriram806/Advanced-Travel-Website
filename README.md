# Flyobo - Travel & Tourism Platform

A full-stack travel and tourism platform built with Next.js, React, Express.js, and MongoDB.

## 🚀 Features

- **User Authentication**: Registration, login, and logout functionality
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Communication**: Socket.IO integration
- **Email Notifications**: Welcome emails and OTP verification
- **Travel Packages**: Browse and book travel packages
- **User Management**: User profiles and preferences
- **Responsive Design**: Mobile-first approach

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **React 19** - UI library
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zustand** - State management
- **React Icons** - Icon library
- **Date-fns** - Date utilities

### Backend
- **Express.js** - Node.js framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Socket.IO** - Real-time communication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Final/
├── client/                 # Next.js frontend
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   └── globals.css    # Global styles
│   ├── public/            # Static assets
│   └── package.json
└── server/                # Express.js backend
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middleware/       # Custom middleware
    ├── config/          # Configuration files
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Final
   ```

2. **Install dependencies**

   **Frontend:**
   ```bash
   cd client
   npm install
   ```

   **Backend:**
   ```bash
   cd server
   npm install
   ```

3. **Environment Setup**

   **Frontend (.env.local):**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

   **Backend (.env.development.local):**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/flyobo
   JWT_SECRET=your_jwt_secret_here
   JWT_EXPIRES_IN=7d
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   SENDER_EMAIL=your_email@gmail.com
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**

   **Backend:**
   ```bash
   cd server
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### Users
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile

### Places
- `GET /api/v1/places` - Get all places
- `POST /api/v1/places` - Create new place
- `GET /api/v1/places/:id` - Get place by ID
- `PUT /api/v1/places/:id` - Update place
- `DELETE /api/v1/places/:id` - Delete place

### Packages
- `GET /api/v1/package` - Get all packages
- `POST /api/v1/package` - Create new package
- `GET /api/v1/package/:id` - Get package by ID

### Bookings
- `GET /api/v1/bookings` - Get user bookings
- `POST /api/v1/bookings` - Create new booking
- `GET /api/v1/bookings/:id` - Get booking by ID

## 🎨 Components

### Modal Components
- `RegisterModal` - User registration form
- `LoginModal` - User login form
- `Modal` - Base modal component

### Navigation
- `Navbar` - Main navigation bar
- `Logo` - Application logo
- `Search` - Search functionality
- `UserMenu` - User menu dropdown

### UI Components
- `Button` - Reusable button component
- `Avatar` - User avatar component
- `Container` - Layout container
- `Heading` - Typography component
- `EmptyState` - Empty state display

## 🔐 Authentication Flow

1. **Registration**: User fills out registration form
2. **Validation**: Form validation on both client and server
3. **Password Hashing**: Bcrypt hashes the password
4. **User Creation**: User is saved to MongoDB
5. **JWT Token**: JWT token is generated and set as cookie
6. **Welcome Email**: Welcome email is sent to user
7. **Login**: User can now login with credentials
8. **Session Management**: JWT token manages user sessions

## 🎯 Key Features

### Form Validation
- Client-side validation with React Hook Form
- Server-side validation with Mongoose schemas
- Real-time error feedback
- Password confirmation validation

### Error Handling
- Comprehensive error handling on both frontend and backend
- User-friendly error messages
- Proper HTTP status codes
- Error logging for debugging

### Security
- Password hashing with bcrypt
- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input sanitization

### User Experience
- Responsive design
- Loading states
- Form reset on success
- Modal transitions
- Toast notifications (to be implemented)

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Configure build command: `npm install`
4. Configure start command: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@flyobo.com or create an issue in the repository.

---

**Flyobo: Fly Off, Break Out** ✈️ 