# Joe Ride - Ride Sharing Application

A full-stack ride-sharing application built with React + TypeScript frontend and NestJS backend with PostgreSQL database.

## Project Structure

```
joe_ride/
├── api-joe/          # NestJS Backend API
├── frontend/         # React + TypeScript Frontend
├── README.md         # This file
└── database.sql      # Database schema and initial data
```

## Tech Stack

### Backend (api-joe)
- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT with Passport
- **Password Hashing**: bcrypt

### Frontend (frontend)
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Prerequisites

Before running this application, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) (version 12 or higher)
- [Git](https://git-scm.com/)

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd joe_ride
```

### 2. Database Setup

#### Install PostgreSQL
1. Download and install PostgreSQL from [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
2. During installation, remember the password you set for the `postgres` user
3. Make sure PostgreSQL service is running

#### Create Database
1. Open PostgreSQL command line (psql) or pgAdmin
2. Connect as the `postgres` user
3. Create a new database:

```sql
CREATE DATABASE demo;
```

#### Import Database Schema
1. Navigate to the project root directory
2. Import the database schema:

```bash
# Using psql command line
psql -U postgres -d demo -f database.sql

# Or using pgAdmin
# 1. Right-click on the 'demo' database
# 2. Select 'Query Tool'
# 3. Open the database.sql file and execute it
```

### 3. Backend Setup (api-joe)

#### Navigate to backend directory
```bash
cd api-joe
```

#### Install dependencies
```bash
npm install
```

#### Environment Configuration
1. Create the `.env` file with these values:
```env
DB_HOST=localhost              # Database host
DB_PORT=5432                  # Database port
DB_USERNAME=postgres          # Database username
DB_PASSWORD=your_password     # Database password
DB_DATABASE=demo              # Database name
JWT_SECRET=your_jwt_secret    # JWT secret key
```

2. **Update the `.env` file** with your actual database credentials:
   - Change `DB_PASSWORD` to match your PostgreSQL password
   - Modify other database settings if needed

#### Build and Start the Backend
```bash
# Development mode (with hot reload)
npm run start:dev

# Or production mode
npm run build
npm run start:prod
```

The backend API will be available at: `http://localhost:8000`

### 4. Frontend Setup

#### Open a new terminal and navigate to frontend directory
```bash
cd frontend
```

#### Install dependencies
```bash
npm install
```

#### Start the Development Server
```bash
npm run dev
```

The frontend application will be available at: `http://localhost:5173`

## Running the Application

### Development Mode

1. **Start the database**: Ensure PostgreSQL is running
2. **Start the backend**: 
   ```bash
   cd api-joe
   npm run start:dev
   ```
3. **Start the frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

### Production Mode

1. **Build the frontend**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Build and start the backend**:
   ```bash
   cd api-joe
   npm run build
   npm run start:prod
   ```

## API Endpoints

The backend provides the following main endpoints:

- **Authentication**: `POST /auth/login`, `POST /auth/register`
- **Users**: `GET /users`, `POST /users`, `PUT /users/:id`
- **Ride Offers**: `GET /ride-offers`, `POST /ride-offers`, `PUT /ride-offers/:id`

## Available Scripts

### Backend (api-joe)
- `npm run start:dev` - Start development server with hot reload
- `npm run start:prod` - Start production server
- `npm run build` - Build the application
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run ESLint

### Frontend (frontend)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)
```env
DB_HOST=localhost              # Database host
DB_PORT=5432                  # Database port
DB_USERNAME=postgres          # Database username
DB_PASSWORD=your_password     # Database password
DB_DATABASE=demo              # Database name
JWT_SECRET=your_jwt_secret    # JWT secret key
```

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env` file
   - Ensure the database `demo` exists

2. **Port Already in Use**
   - Backend (8000): Change the port in `api-joe/src/main.ts`
   - Frontend (5173): Vite will automatically use the next available port

3. **CORS Issues**
   - The backend is configured to accept requests from the frontend
   - If you change the frontend port, update CORS settings in `api-joe/src/main.ts`

4. **Dependencies Issues**
   - Delete `node_modules` and `package-lock.json`
   - Run `npm install` again

### Database Reset
If you need to reset the database:

```sql
DROP DATABASE demo;
CREATE DATABASE demo;
-- Then re-import database.sql
```

## Features

- User registration and authentication
- Ride offer creation and management
- Ride booking system
- User profiles with vehicle information
- Real-time ride availability
- Voucher system for ride payments

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `npm run test`
4. Submit a pull request

## License

This project is private and unlicensed.
