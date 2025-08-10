# Todo Application - Docker Setup

This project consists of multiple services including two PostgreSQL databases, backend services for todos and users, a frontend Angular app, and pgAdmin for database management. All services are containerized using Docker and orchestrated with Docker Compose.

## Architecture Overview

The application consists of the following services:

- **Frontend**: Angular application (port 4200)

- **Todo Service**: Backend API for todo management (port 3000)

- **User Service**: Backend API for user management (port 3001)

- **Todo Database**: PostgreSQL database for todos (port 5432)

- **User Database**: PostgreSQL database for users (port 5433)

- **PgAdmin**: Database administration tool (port 5050)

## Project Structure

Make sure your project directory structure matches:

```

project-root/

├── docker-compose.yml

├── backend/

│ ├── todo-service/

│ │ └── Dockerfile

│ └── user-service/

│ └── Dockerfile

└── frontend/

└── Dockerfile

```

## Quick Start

### 1. Clone and Navigate

```bash

# Clone the repository
git clone https://github.com/abduIbari/backend-services.git

# Navigate to your project directory
cd  /path/to/your/project

```

### 2. Build and Run

```bash

# Build and start all services
docker-compose  up  --build

```

This command will:

- Build the Docker images for the services

- Create and start all containers

- Set up the network and volumes

- Initialize the databases

### 3. Access the Application

Once all services are running, you can access:

- **Frontend Application**: http://localhost:4200

- **Todo Service API**: http://localhost:3000

- **User Service API**: http://localhost:3001

- **PgAdmin**: http://localhost:5050

# API Documentation

The API documentation is available on Postman:

- Todo API Documentation:
  https://documenter.getpostman.com/view/39687923/2sB3BEnVMd

- User Auth API Documentation:
  https://documenter.getpostman.com/view/39687923/2sB3BEnVMe

## Database Access

### PgAdmin Web Interface

1. Open http://localhost:5050

2. Login with:

   - **Email**: admin@admin.com

   - **Password**: root

3. Add database connections:

**Todo Database:**

    - Host: tododb

    - Port: 5432

    - Database: tododb

    - Username: abdul

    - Password: password

**User Database:**

    - Host: userdb

    - Port: 5432

    - Database: userdb

    - Username: abdul

    - Password: password

### Stop Services

```bash

# Stop all services
docker-compose  down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose  down  -v

```

## Troubleshooting

### Common Issues

**Database Connection Issues**

1. Ensure databases are fully initialized before services start

2. Check database logs: `docker-compose logs tododb userdb`

3. Verify environment variables in docker-compose.yml

**Build Failures**

1. Ensure Dockerfile exists in each service directory

2. Check build context paths in docker-compose.yml

## Data Persistence

Database data is persisted using Docker volumes:

- `todo-db-data`: Stores todo database data

- `user-db-data`: Stores user database data

Data will persist between container restarts unless volumes are explicitly removed.
