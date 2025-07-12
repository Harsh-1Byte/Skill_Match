### SkillSwap - Peer-to-Peer Learning Platform



 ## Overview

SkillSwap is a comprehensive MERN stack web platform designed to facilitate collaborative learning and skill development through peer-to-peer guidance. The platform emphasizes reciprocal knowledge exchange, industrial-grade security features, and user-friendly interfaces to create a dynamic learning environment where users can connect, learn from each other, and grow together.

 ## Motivation

In today's fast-paced world, the acquisition of new skills is essential for personal and professional growth. However, traditional learning methods often lack interaction and dynamism. SkillSwap was created to address this gap by providing a platform where users can:

- **Connect** with skilled professionals across various domains
- **Learn** through direct mentorship and guidance
- **Share** their expertise with others
- **Build** meaningful professional relationships
- **Grow** together in a supportive community

  ## Concept Tree
  <img width="1920" height="1080" alt="Concept Tree" src="https://github.com/user-attachments/assets/b9a59868-8666-421f-92ec-165147bd5884" />

 ## Key Features

 Authentication & Security
- **Google OAuth 2.0 Integration**: Secure login with Google accounts
- **JWT Token Authentication**: Stateless authentication with JSON Web Tokens
- **Role-based Access Control**: User and admin roles with different permissions
- **Session Management**: Secure cookie-based session handling
- **Password Protection**: App password for email notifications

 User Management
- **User Registration & Login**: Multiple authentication methods
- **Profile Management**: Comprehensive user profiles with skills, education, and projects
- **Profile Customization**: Edit profile information, skills, and portfolio links
- **User Rating System**: Community-driven rating and feedback system
- **Account Moderation**: Admin tools for user management and banning

 Discovery & Connection
- **Smart User Discovery**: Browse and discover users based on skills and interests
- **Featured Profiles**: Curated selection of top-rated users on the home page
- **Skill-based Filtering**: Find users by specific skills or learning goals
- **Connection Requests**: Send and manage connection requests
- **Email Notifications**: Automated email alerts for connection requests

 Real-time Communication
- **Live Chat System**: Real-time messaging using Socket.io
- **Connection Management**: Accept/reject connection requests
- **Chat History**: Persistent message storage and retrieval
- **Online Status**: Real-time user presence indicators
- **Message Notifications**: Instant message delivery

 Rating & Feedback System
- **User Ratings**: Rate other users based on learning experiences
- **Feedback Collection**: Detailed feedback and reviews
- **Rating Display**: Public rating display on user profiles
- **Quality Assurance**: Maintain platform quality through ratings

 Safety & Moderation
- **User Reporting**: Report inappropriate behavior or content
- **Admin Dashboard**: Comprehensive moderation tools
- **Content Moderation**: Review and manage reported content
- **User Banning**: Temporary or permanent user restrictions
- **Safety Features**: Protect users from harassment

 User Experience
- **Responsive Design**: Optimized for all devices and screen sizes
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Loading States**: User-friendly loading indicators
- **Error Handling**: Comprehensive error messages and fallbacks
- **Toast Notifications**: Real-time feedback for user actions

 Analytics & Insights
- **User Analytics**: Track user engagement and platform usage
- **Performance Metrics**: Monitor system performance
- **Admin Dashboard**: Comprehensive analytics for administrators
- **Data Visualization**: Charts and graphs for insights

 ### Architecture

### Frontend Architecture
```
Frontend/
├── src/
│   ├── Components/          # Reusable UI components
│   ├── Pages/              # Main application pages
│   │   ├── LandingPage/    # Home page with featured profiles
│   │   ├── Discover/       # User discovery and browsing
│   │   ├── Login/          # Authentication pages
│   │   ├── Register/       # User registration
│   │   ├── Profile/        # User profile viewing
│   │   ├── EditProfile/    # Profile editing
│   │   ├── Chats/          # Real-time messaging
│   │   ├── Rating/         # Rating and feedback system
│   │   ├── Report/         # User reporting
│   │   ├── Admin/          # Admin dashboard and tools
│   │   ├── AboutUs/        # About page
│   │   └── NotFound/       # 404 error page
│   ├── util/               # Utility functions and hooks
│   └── App.jsx            # Main application component
```

### Backend Architecture
```
Backend/
├── src/
│   ├── controllers/        # Business logic handlers
│   ├── models/            # Database schemas
│   │   ├── user.model.js           # User data model
│   │   ├── chat.model.js           # Chat room model
│   │   ├── message.model.js        # Message model
│   │   ├── request.model.js        # Connection request model
│   │   ├── rating.model.js         # Rating model
│   │   ├── report.model.js         # Report model
│   │   └── unRegisteredUser.model.js # Guest user model
│   ├── routes/            # API route definitions
│   ├── middlewares/       # Custom middleware functions
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   └── app.js            # Express application setup
```

### Database Schema

### User Model
- **Basic Info**: username, name, email, picture
- **Role Management**: user/admin roles with permissions
- **Skills**: skillsProficientAt, skillsToLearn arrays
- **Education**: institution, degree, dates, scores
- **Projects**: title, description, tech stack, links
- **Social Links**: LinkedIn, GitHub, portfolio
- **Rating System**: community rating and feedback
- **Moderation**: ban status, reasons, timestamps

### Chat & Messaging
- **Chat Rooms**: User-to-user chat sessions
- **Messages**: Real-time message storage and delivery
- **Connection Requests**: Pending, accepted, rejected states

### Rating & Reporting
- **Ratings**: User-to-user rating system
- **Reports**: Content and behavior reporting
- **Moderation**: Admin review and action system

 Core Functionality

### 1. User Authentication & Authorization
- **Google OAuth Integration**: Secure third-party authentication
- **JWT Token Management**: Stateless session handling
- **Role-based Access**: Different permissions for users and admins
- **Session Security**: Secure cookie management

### 2. User Discovery & Connection
- **Smart Matching**: Algorithm-based user recommendations
- **Skill-based Search**: Find users by specific skills
- **Connection Requests**: Send and manage connection requests
- **Email Notifications**: Automated request notifications

### 3. Real-time Communication
- **Socket.io Integration**: Real-time bidirectional communication
- **Live Chat**: Instant messaging between connected users
- **Message Persistence**: Database storage for chat history
- **Online Status**: Real-time presence indicators

### 4. Profile Management
- **Comprehensive Profiles**: Skills, education, projects, social links
- **Profile Editing**: Update personal information and skills
- **Portfolio Showcase**: Display projects and achievements
- **Rating Display**: Public rating and feedback visibility

### 5. Rating & Feedback System
- **User Ratings**: Rate other users based on interactions
- **Feedback Collection**: Detailed review system
- **Quality Metrics**: Maintain platform quality through ratings
- **Rating Display**: Public rating visibility

### 6. Safety & Moderation
- **User Reporting**: Report inappropriate behavior
- **Admin Tools**: Comprehensive moderation dashboard
- **Content Review**: Review and manage reported content
- **User Management**: Ban/unban users with reasons

### 7. Admin Dashboard
- **User Management**: View, edit, and ban users
- **Content Moderation**: Review and manage reports
- **Analytics**: Platform usage and performance metrics
- **System Settings**: Configure platform parameters

## 🛠️ Technologies Used

### Frontend Stack
- **React.js 18.2.0**: Modern UI library with hooks
- **React Router**: Client-side routing and navigation
- **React Bootstrap**: UI component library
- **Axios**: HTTP client for API communication
- **Socket.io-client**: Real-time communication
- **React Toastify**: Toast notifications
- **Context API**: State management

### Backend Stack
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Socket.io**: Real-time bidirectional communication
- **Passport.js**: Authentication middleware
- **JWT**: JSON Web Token authentication
- **Nodemailer**: Email service integration

### Development & Deployment
- **Docker**: Containerization for consistent deployment
- **Docker Compose**: Multi-container orchestration
- **Google Cloud Console**: OAuth 2.0 configuration
- **MongoDB Atlas**: Cloud database hosting
- **Cloudinary**: Image and file storage

### Development Tools
- **VS Code**: Integrated development environment
- **Git & GitHub**: Version control and collaboration
- **Postman**: API testing and documentation
- **MongoDB Compass**: Database management tool

##  Pages & Features

### Public Pages
1. **Landing Page** (`/`)
   - Featured user profiles
   - Platform introduction
   - Call-to-action buttons
   - Responsive hero section

2. **Discover Page** (`/discover`)
   - User browsing and discovery
   - Skill-based filtering
   - Side panel navigation
   - Profile cards with actions


3. **Login/Register** (`/login`, `/register`)
   - Google OAuth integration
   - Form-based registration
   - Password recovery

### Authenticated Pages
1. **Profile Pages** (`/profile/:username`)
   - Comprehensive user profiles
   - Skills and education display
   - Project portfolio
   - Rating and feedback

2. **Edit Profile** (`/edit_profile`)
   - Profile information editing
   - Skills management
   - Education and project updates
   - Social links configuration

3. **Chats** (`/chats`)
   - Real-time messaging interface
   - Connection request management
   - Chat history
   - Online status indicators

4. **Rating System** (`/rating/:username`)
   - Rate other users
   - Provide feedback
   - Review system

5. **Reporting** (`/report/:username`)
   - Report inappropriate behavior
   - Content moderation
   - Safety features

### Admin Pages
1. **Admin Dashboard** (`/admin/dashboard`)
   - Platform overview
   - Key metrics
   - Quick actions

2. **User Management** (`/admin/users`)
   - User listing and search
   - Ban/unban functionality
   - User details management

3. **Reports Management** (`/admin/reports`)
   - Review reported content
   - Take moderation actions
   - Report history

4. **Analytics** (`/admin/analytics`)
   - Platform usage metrics
   - User engagement data
   - Performance insights

5. **Settings** (`/admin/settings`)
   - Platform configuration
   - System parameters
   - Feature toggles

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Google Cloud Console account (for OAuth)
- Email service (Gmail with app password)
- Cloudinary account (for image storage)

### Local Development Setup

1. **Clone the Repository**
```bash
git clone https://github.com/Harsh-1Byte/Skill_Match.git
cd SkillSwap
```

2. **Frontend Setup**
```bash
   cd Frontend
   npm install
```

   Create `.env` file:
```env
VITE_LOCALHOST = http://localhost:8000
   VITE_SERVER_URL = <your-deployment-link>
```

   Start frontend:
```bash
npm run dev
```

3. **Backend Setup**
```bash
   cd ../Backend
   npm install
```

   Create `.env` file:
```env
PORT = 8000
CORS_ORIGIN = *
   MONGODB_URI = mongodb+srv://<username>:<password>@cluster0.<project>.mongodb.net

CLOUDINARY_CLOUD_NAME = <your-cloudinary-cloud-name>
CLOUDINARY_API_KEY = <your-cloudinary-api-key>
   CLOUDINARY_API_SECRET = <your-cloudinary-api-secret>

GOOGLE_CLIENT_ID = <your-google-client-id> 
GOOGLE_CLIENT_SECRET = <your-google-client-secret>
   GOOGLE_CALLBACK_URL = http://localhost:8000/auth/google/callback

JWT_SECRET = <your-jwt-secret>

EMAIL_ID = <your-email-id>
APP_PASSWORD = <your-app-password>
```

   Start backend:
```bash
npm run dev
```

### Docker Deployment

1. **Create docker-compose.yml**
   ```yaml
version: '3'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
      args:
        PORT: 8000
        CORS_ORIGIN: "*"
           MONGODB_URI: "mongodb+srv://<username>:<password>@cluster0.<project>.mongodb.net"
        CLOUDINARY_CLOUD_NAME: "<your-cloudinary-cloud-name>"
        CLOUDINARY_API_KEY: "<your-cloudinary-api-key>"
           CLOUDINARY_API_SECRET: "<your-cloudinary-api-secret>"
        GOOGLE_CLIENT_ID: "<your-google-client-id>"
        GOOGLE_CLIENT_SECRET: "<your-google-client-secret>"
        GOOGLE_CALLBACK_URL: "http://localhost:8000/auth/google/callback"
        JWT_SECRET: "<your-jwt-secret>"
    ports:
      - "8000:8000"

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
      args:
        VITE_LOCALHOST: "http://localhost:8000"
           VITE_SERVER_URL: "<your-deployment-link>"
    ports:
      - "5173:5173"
```

2. **Run with Docker**
```bash
sudo docker-compose up
```

3. **Clean up**
```bash
sudo docker-compose down --rmi all
```

## 🔑 Environment Variables

### Frontend (.env)
- `VITE_LOCALHOST`: Local backend URL
- `VITE_SERVER_URL`: Production backend URL

### Backend (.env)
- `PORT`: Server port (default: 8000)
- `CORS_ORIGIN`: CORS configuration
- `MONGODB_URI`: MongoDB connection string
- `CLOUDINARY_*`: Cloudinary configuration for image storage
- `GOOGLE_*`: Google OAuth 2.0 credentials
- `JWT_SECRET`: JWT signing secret
- `EMAIL_ID`: Email service account
- `APP_PASSWORD`: Email app password

##  API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/google` - Google OAuth login
- `GET /auth/logout` - User logout

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/updateProfile` - Update user profile
- `GET /user/featured` - Get featured users
- `GET /user/discover` - Discover users
- `GET /user/:username` - Get specific user profile

### Chat & Messaging
- `GET /chat` - Get user chats
- `POST /message/sendMessage` - Send message
- `GET /message/getMessages/:chatId` - Get chat messages

### Connection Requests
- `POST /request/create` - Create connection request
- `GET /request/getRequests` - Get pending requests
- `POST /request/acceptRequest` - Accept request
- `POST /request/rejectRequest` - Reject request

### Rating & Feedback
- `POST /rating/createRating` - Create user rating
- `GET /rating/getRatings/:username` - Get user ratings

### Reporting
- `POST /report/createReport` - Create user report
- `GET /report/getReports` - Get reports (admin)

### Admin
- `GET /admin/dashboard` - Admin dashboard
- `GET /admin/users` - Get all users
- `PUT /admin/banUser` - Ban user
- `GET /admin/analytics` - Platform analytics

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Pink (#EF7C8E), Mint (#B6E2D3), Cream (#FAE8E0)
- **Typography**: Modern, readable fonts with proper hierarchy
- **Spacing**: Consistent spacing system using Bootstrap utilities
- **Shadows**: Subtle shadows for depth and elevation

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Responsive layouts for tablets
- **Desktop Experience**: Enhanced features for larger screens
- **Touch Friendly**: Optimized for touch interactions

### User Experience
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Toast notifications for actions
- **Navigation**: Intuitive navigation with breadcrumbs
- **Accessibility**: WCAG compliant design elements

## 🔒 Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Google OAuth**: Third-party authentication with Google
- **Password Security**: Secure password handling
- **Session Management**: Secure session handling

### Data Protection
- **Input Validation**: Server-side input validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Cross-site scripting prevention
- **CSRF Protection**: Cross-site request forgery protection

### API Security
- **Rate Limiting**: Prevent API abuse
- **CORS Configuration**: Proper cross-origin resource sharing
- **Request Validation**: Validate all incoming requests
- **Error Handling**: Secure error messages

##  Performance Optimization

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo for performance
- **Bundle Optimization**: Optimized build process
- **Image Optimization**: Compressed images and lazy loading

### Backend Optimization
- **Database Indexing**: Optimized database queries
- **Caching**: Redis caching for frequently accessed data
- **Connection Pooling**: Efficient database connections
- **Compression**: Gzip compression for responses

### Real-time Optimization
- **Socket.io Optimization**: Efficient real-time communication
- **Message Batching**: Batch message processing
- **Connection Management**: Efficient socket connections

## Testing

### Frontend Testing
- **Unit Tests**: Component testing with Jest
- **Integration Tests**: API integration testing
- **E2E Tests**: End-to-end testing with Cypress

### Backend Testing
- **API Tests**: REST API testing
- **Unit Tests**: Controller and service testing
- **Integration Tests**: Database integration testing

##  Monitoring & Analytics

### Performance Monitoring
- **Response Times**: API response time tracking
- **Error Rates**: Error monitoring and alerting
- **User Metrics**: User engagement tracking
- **System Health**: Server and database monitoring


### Development Workflow
1. **Fork the Repository**: Create your own fork
2. **Create Feature Branch**: `git checkout -b feature/amazing-feature`
3. **Make Changes**: Implement your feature
4. **Test Thoroughly**: Ensure all tests pass
5. **Submit Pull Request**: Create a detailed PR

### Code Standards
- **ESLint**: Follow JavaScript coding standards
- **Prettier**: Consistent code formatting
- **Commit Messages**: Conventional commit format
- **Documentation**: Update documentation for changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team


- **Manish Dangi** - Backend Developer
- **Harshwardhan** - Frontend Developer

##  Acknowledgments

- **Google OAuth**: For secure authentication
- **MongoDB Atlas**: For cloud database hosting
- **Cloudinary**: For image and file storage
- **Socket.io**: For real-time communication
- **React Bootstrap**: For UI components
- **Open Source Community**: For various libraries and tools



