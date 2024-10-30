# Tech Stack Documentation

## Frontend Technologies

### Core
- **React 18**: Framework UI chính
- **TypeScript 5.0+**: Ngôn ngữ lập trình với type safety
- **Vite**: Build tool và development server

### UI/Styling
- **Ant Design (AntD) 5.0+**: UI component library
  - Form handling
  - Data display components
  - Layout components
  - Navigation components
- **TailwindCSS 3**: Utility-first CSS framework
  - Custom styling
  - Responsive design
  - Dark mode support

### State Management & Data Fetching
- **React Context**: Global state management
- **Axios**: HTTP client
  - API calls
  - Request/Response interceptors
  - Error handling

### Authentication
- **JWT**: Token-based authentication
- **HTTP-only cookies**: Token storage
- **Role-based access control (RBAC)**

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Husky**: Git hooks
- **Jest**: Unit testing
- **React Testing Library**: Component testing

## Backend Technologies

### Core
- **Node.js 18+**: Runtime environment
- **TypeScript**: Type-safe development
- **Express.js**: Web framework
  - Routing
  - Middleware
  - Error handling

### Database
- **SQLite**: Lightweight SQL database
- **TypeORM**: ORM for database operations
  - Entity management
  - Migration support
  - Relationship handling

### Authentication & Security
- **jsonwebtoken**: JWT implementation
- **bcrypt**: Password hashing
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting

### Validation & Types
- **zod**: Runtime type validation
- **TypeScript**: Static type checking
- **express-validator**: Request validation

### Development Tools
- **nodemon**: Development server
- **ts-node**: TypeScript execution
- **Jest**: Unit testing
- **Supertest**: API testing

## Development & Deployment

### Version Control
- **Git**: Source control
- **GitHub**: Repository hosting

### Code Quality
- **ESLint**: Linting
- **Prettier**: Formatting
- **TypeScript**: Type checking
- **Husky**: Pre-commit hooks

### Testing
- **Jest**: Testing framework
- **React Testing Library**: Frontend testing
- **Supertest**: Backend API testing

### Documentation
- **TSDoc**: TypeScript documentation
- **Swagger/OpenAPI**: API documentation
- **Markdown**: Project documentation

### Planned Additions
1. **Security**
   - Data encryption
   - Two-factor authentication
   - Advanced rate limiting

2. **Performance**
   - Redis caching
   - API response optimization
   - Bundle size optimization

3. **Monitoring**
   - Error tracking
   - Performance monitoring
   - User analytics

## Development Environment Requirements

### Required Software
- Node.js 18+
- npm 8+ or yarn 1.22+
- Git 2.3+
- VS Code (recommended)

### VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens
- Error Lens

### Environment Variables
```env
# Frontend
VITE_API_URL=http://localhost:3000
VITE_JWT_SECRET=your-jwt-secret

# Backend
PORT=3000
NODE_ENV=development
JWT_SECRET=your-jwt-secret
DATABASE_URL=./data/database.sqlite
```

## Performance Considerations

### Frontend
- Code splitting
- Lazy loading
- Memoization
- Virtual scrolling for large lists
- Image optimization

### Backend
- Response caching
- Database query optimization
- Connection pooling
- Rate limiting
- Compression

## Security Measures

### Implemented
- JWT authentication
- Password hashing
- CORS configuration
- Input validation
- RBAC

### Planned
- Data encryption
- Two-factor authentication
- Security headers
- Rate limiting
- Audit logging 