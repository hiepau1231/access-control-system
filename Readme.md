# Access Control and Data Security Management System

This project is a web-based system that provides role-based access control (RBAC) and data security management using encryption methods with Secret Keys. It is designed for small and medium-sized enterprises (SMEs) to ensure secure access control and data protection.

## Technologies Used

- Frontend:
  - React (TypeScript)
  - Ant Design (AntD)
  - TailwindCSS
  - React Router
- Backend:
  - Node.js
  - Express.js
- Database: SQLite
- ORM: Sequelize
- Authentication: JSON Web Tokens (JWT)
- State Management: React Context API
- Styling: Combination of Ant Design components and custom TailwindCSS

## Features

- Role-based access control (RBAC)
- User management
- Role management
- Permission management
- Dark mode support
- Responsive design
- Secure authentication using JWT
- Data encryption for sensitive information

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14 or later)
- npm (v6 or later)

## Getting Started

To get this project up and running, follow these steps:

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory and add the following:
   ```
   PORT=3001
   JWT_SECRET=your_jwt_secret_here
   ```

4. Initialize the database:
   ```
   npm run db:init
   ```

5. Start the backend server:
   ```
   npm run dev
   ```

The backend server should now be running on `http://localhost:3001`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory and add the following:
   ```
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Start the frontend development server:
   ```
   npm start
   ```

The frontend application should now be running on `http://localhost:3000`.

## Usage

1. Open your web browser and go to `http://localhost:3000`
2. You can log in with the default admin account:
   - Username: admin
   - Password: admin123
3. Explore the different sections: Dashboard, User Management, Role Management, and Permission Management
4. Try out the dark mode feature in the Settings page

## Running Tests

### Backend Tests

In the backend directory, run:
```
npm test
```

### Frontend Tests

In the frontend directory, run:
```
npm test
```

## Building for Production

### Backend

In the backend directory, run:
```
npm run build
```

### Frontend

In the frontend directory, run:
```
npm run build
```

This will create optimized production builds for both the backend and frontend.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
