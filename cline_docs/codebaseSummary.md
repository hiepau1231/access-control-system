# Codebase Summary

## Key Components and Their Interactions

### User Management Module
- UserManagement.tsx: Main component for user management interface
- User table with CRUD operations
- New password viewing functionality

### Data Flow
1. Backend encrypts passwords using secret key
2. Frontend displays encrypted passwords in table
3. User clicks eye icon to view password
4. Modal prompts for decryption key
5. Client-side decryption attempts to decrypt password
6. Result displayed to user

### Recent Changes Needed
1. Backend:
   - User model: Add encryptedPassword field
   - UserController: Add encryption logic
   - Routes: Update to handle password encryption

2. Frontend:
   - UserManagement component: Add password column
   - New PasswordViewModal component
   - Decryption utility functions

### External Dependencies
- CryptoJS for frontend decryption
- Node.js crypto module for backend encryption

## User Feedback Integration
- Password viewing should be intuitive
- Clear error messages for incorrect keys
- Smooth modal interaction 