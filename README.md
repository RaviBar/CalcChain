# Number Communication Application

A full-stack TypeScript application where users communicate through numerical calculations in tree structures, similar to social media posts and comments.

## Features

- **Authentication**: User registration and login with JWT tokens
- **Number Communication**: Users can start calculation chains with numbers
- **Tree Structure**: Operations build upon previous calculations creating discussion trees
- **Real-time Display**: View all calculation trees and participate in discussions
- **Component-based UI**: Modern React components with TypeScript
- **Comprehensive Testing**: Unit and integration tests with coverage reporting

## Tech Stack

- **Backend**: Node.js + Express + TypeScript + PostgreSQL
- **Frontend**: React + TypeScript + Vite
- **Authentication**: JWT with localStorage
- **Containerization**: Docker Compose
- **Testing**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env` and update values if needed
3. Run with Docker Compose:

```bash
docker-compose up --build
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

5. (Optional) Seed the database with sample data:
```bash
cd server
npm run seed
```

## Development

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if running locally without Docker)

### Backend Development

```bash
cd server
npm install
npm run dev
```

The server will start on http://localhost:3001

### Frontend Development

```bash
cd client
npm install
npm run dev
```

The client will start on http://localhost:3000

### Database Setup

The PostgreSQL database will be automatically created and initialized when running with Docker Compose.

For local development without Docker:
1. Create a PostgreSQL database named `number_communication`
2. Update the `DATABASE_URL` in your `.env` file
3. Run the server to initialize the schema

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Calculations
- `GET /api/calculations` - Get all calculation trees
- `POST /api/calculations` - Create starting number or operation
- `GET /api/calculations/:id/children` - Get children of a calculation

### Health Check
- `GET /health` - Server health status

## Testing

### Backend Tests
```bash
cd server
npm test              # Run tests once
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### Frontend Tests
```bash
cd client
npm test              # Run tests once
npm run test:ui       # Run tests with UI
npm run test:coverage # Run tests with coverage report
```

## Sample Data

The application includes a seeding script that creates sample users and calculations:

```bash
cd server
npm run seed
```

This creates:
- Users: alice, bob, charlie (password: password123)
- Sample calculation trees demonstrating the functionality

## Project Structure

```
/
├── docker-compose.yml          # Docker services configuration
├── .env.example               # Environment variables template
├── README.md                  # This file
├── server/                    # Backend application
│   ├── src/
│   │   ├── index.ts          # Server entry point
│   │   ├── db.ts             # Database connection
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   ├── models/           # Database models
│   │   ├── utils/            # Utility functions
│   │   └── seed.ts           # Database seeding
│   ├── tests/                # Backend tests
│   └── package.json
├── client/                    # Frontend application
│   ├── src/
│   │   ├── main.tsx          # React entry point
│   │   ├── App.tsx           # Main app component
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API services
│   │   ├── types/            # TypeScript types
│   │   └── test/             # Test setup
│   └── package.json
```

## Business Logic

### Calculation Trees
- Users can start "discussions" with a starting number
- Other users can respond by performing operations on existing numbers
- Operations: addition (+), subtraction (-), multiplication (×), division (÷)
- Each operation creates a new result that can be operated upon
- Forms a tree structure similar to social media comment threads

### Example
1. Alice starts with number 10
2. Bob adds 5: 10 + 5 = 15
3. Charlie multiplies by 2: 10 × 2 = 20
4. Alice adds 3 to Bob's result: 15 + 3 = 18
5. And so on...

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 24-hour expiry
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Helmet.js security headers

## Deployment

This application is configured for deployment on Railway, Render, or similar platforms with Docker Compose support.

### Environment Variables

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)
- `VITE_API_URL` - Backend API URL for frontend

## Live Demo

https://calc-chain.vercel.app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is created for assessment purposes.
