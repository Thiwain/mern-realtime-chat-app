
# Real-Time Chat Application with Enhanced Security

This project is a real-time chat application built with the MERN stack and WebSocket integration for efficient messaging. The application is designed with a robust security structure, enabling secure communication, authentication, and user data protection.

## Features

### Core Functionalities
- **Real-Time Chat with WebSockets**: Enables users to communicate in real time within chat rooms, providing an interactive and responsive user experience.
- **User Authentication and Authorization**: JWT-based authentication is implemented with automatic token validation and renewal. Cookies are used to manage session persistence without exposing token endpoints.
- **Push Notifications**: Notifications alert users to new messages, enhancing engagement, even when the application is minimized or in the background.

### Security Features

- **Helmet**: Protects against common vulnerabilities by setting various HTTP headers, including XSS protection, content security policy, and frameguards.
- **Rate Limiting**: Configured rate limits on authentication (authLimiter) and global (globalLimiter) routes to prevent brute-force and DDoS attacks.
- **CORS Configuration**: Strict CORS policy enforces client-origin restrictions and limits allowed headers to ensure secure API interactions.
- **Cookie Management**: HttpOnly cookies store JWT tokens, preventing client-side scripts from accessing them. This helps protect against XSS attacks.
- **Input Validation**: User inputs are validated and sanitized across routes to prevent injection attacks and ensure data integrity.

### Backend Middleware and Utilities
- **Morgan**: HTTP request logger for development mode, helping monitor and debug requests.
- **User Agent Analysis**: Logs user agent data for enhanced session management and security auditing.
- **Graceful Shutdown**: Implements a shutdown handler to close WebSocket and database connections gracefully, ensuring data consistency and a smooth restart.

## Project Structure and Setup
- **Database**: MongoDB with `connectDB()` for seamless connection management.
- **Routes**: Modular routes with `AuthRoutes` for authentication and `MessageRoutes` for chat functionality, secured with authentication and rate limiting.
- **WebSocket Server**: Configured to handle upgrades and manage connections for real-time chat.

To set up the project locally:
1. Clone the repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file with necessary environment variables (e.g., `PORT`, `CLIENT_HOST`).
4. Run `npm start` to launch the application on the specified port.

