# 🏨 Reservario Channel Manager

A comprehensive **Channel Manager** for hotel and property management that integrates with multiple OTA platforms (Airbnb, Booking.com, Expedia, Agoda, Vrbo). Built with modern technologies and designed for scalability, security, and real-time operations.

## 🚀 Features

### 🎯 Core Functionality
- **Multi-OTA Integration**: Seamless integration with major booking platforms
- **Real-time Synchronization**: Live updates across all channels
- **Inventory Management**: Centralized room availability and pricing
- **Booking Management**: Unified booking system with real-time updates
- **Rate Management**: Dynamic pricing across all channels
- **Analytics & Reporting**: Comprehensive business intelligence

### 👥 Role-Based Access Control
- **Superadmin**: Full system access and user management
- **Admin**: Property and team management
- **Supervisor**: Oversight and monitoring capabilities
- **Client**: Booking and reservation access

### 🌐 Multi-Language Support
- **English** (EN)
- **Spanish** (ES) 
- **German** (DE)
- Dynamic language switching with persistent preferences

### 📱 Mobile-First Design
- Responsive design for all screen sizes
- Touch-optimized interface
- Progressive Web App (PWA) capabilities

## 🛠️ Technology Stack

### Backend
- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** ODM
- **JWT** authentication with refresh tokens
- **Socket.IO** for real-time communication
- **Winston** for comprehensive logging
- **Swagger** for API documentation

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router v6** for navigation
- **Zustand** for state management
- **React Hook Form** with **Zod** validation
- **i18next** for internationalization
- **Axios** for API communication

### Development Tools
- **ESLint** and **Prettier** for code quality
- **Jest** for testing
- **Nodemon** for development
- **Docker** support (optional)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (v5 or higher)
- **npm** or **yarn**

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Reservario
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup
```bash
# Copy environment files
cp backend/env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit the environment files with your configuration
```

### 4. Database Setup
```bash
# Start MongoDB (if not already running)
mongod

# Seed the database with initial data
cd backend
npm run seed:dev-data
```

### 5. Start Development Servers
```bash
# Terminal 1: Start backend server
cd backend
npm run dev

# Terminal 2: Start frontend server
cd frontend
npm run dev
```

### 6. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health

## 🔐 Default Credentials

### Superadmin
- **Email**: `superadmin@reservario.com`
- **Password**: `Superadmin@123`

### Admin
- **Email**: `admin@reservario.com`
- **Password**: `Admin@123`

### Supervisor
- **Email**: `supervisor1@reservario.com`
- **Password**: `Supervisor@123`

## 📁 Project Structure

```
Reservario/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── scripts/            # Database scripts
│   └── tests/              # Backend tests
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── api/            # API client
│   │   ├── auth/           # Authentication
│   │   ├── i18n/           # Internationalization
│   │   └── utils/          # Utility functions
│   └── public/             # Static assets
├── mock-ota-server/        # Mock OTA server for testing
└── docs/                   # Documentation
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Tests
```bash
cd frontend
npm test
npm run test:coverage
```

## 📊 Available Scripts

### Backend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run seed:dev-data # Seed development data
npm run seed:bookings # Seed booking data
npm run seed:room-availability # Seed room availability
```

### Frontend Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/reservario
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
```

## 🌐 API Documentation

The API documentation is available at `http://localhost:3000/api-docs` when the backend server is running. It includes:

- **Authentication endpoints**
- **User management**
- **Property management**
- **Booking management**
- **Inventory management**
- **Analytics endpoints**
- **Real-time WebSocket events**

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based access control** (RBAC)
- **Rate limiting** and request throttling
- **Input validation** and sanitization
- **CORS** configuration
- **Audit logging** for all actions
- **Password hashing** with bcrypt

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🌍 Internationalization

Supports multiple languages with:
- **English** (EN) - Default
- **Spanish** (ES)
- **German** (DE)

Language preferences are stored in localStorage and persist across sessions.

## 🚀 Deployment

### Production Build
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the logs in the backend console

## 🎯 Roadmap

- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Additional OTA integrations
- [ ] Automated pricing optimization
- [ ] Multi-currency support
- [ ] Advanced reporting features

---

**Reservario Channel Manager** - Streamlining hotel operations with modern technology 🏨✨
