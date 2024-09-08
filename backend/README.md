# Backend for React NestJS Sequelize Authorization App

## Description

This is a backend application built using NestJS with Sequelize ORM for handling database operations. It supports user authentication using JWT (JSON Web Token) and local strategies through Passport. The app provides essential security features such as CSRF protection, cookie handling, and password hashing using argon2. The application uses MySQL as the database engine.

Features

	•	User Authentication (JWT + Passport strategies)
	•	Authorization using JWT for secure routes
	•	User Registration & Login
	•	Password hashing with Argon2
	•	Sequelize ORM for MySQL database integration
	•	Helmet for security headers
	•	Swagger API Documentation integrated
	•	Seamless error handling for authentication and token management
	•	Code Formatting with Prettier and ESLint

## Installation

To get started, clone this repository and install the dependencies:

```
git clone https://github.com/your-repo/backend-react-nestjs-sequelize-authorization-app.git
cd backend-react-nestjs-sequelize-authorization-app
npm install
```

Download MySQL image

```
docker pull mysql
```

Start docker container

```
docker run --name f-test-mysql -e MYSQL_ROOT_PASSWORD=<database password> -e MYSQL_DATABASE=<database name> -p 3306:3306 -d mysql:latest
```


## Environment Configuration

Create a .env file in the root directory to configure your environment variables:

```
API_PORT=3001
FRONTEND_URI=http://localhost:3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=<database name from this docker container env: MYSQL_DATABASE>
DB_USERNAME=root
DB_PASSWORD=<database password from this docker container env: MYSQL_ROOT_PASSWORD>

JWT_SECRET=jwtsecret
JWT_REFRESH_SECRET=jwtrefreshsecret
```

# Running the App

## Development

To start the app in development mode (with hot reloading):

```
yarn start:dev
```

## Production

To run the app in production mode:

```
yarn build
yarn start:prod
```
## Debug Mode

To run the app in debug mode:

```
yarn start:debug
```

## API Documentation

API documentation is generated automatically with Swagger. Once the application is running, you can access the Swagger UI at:
http://localhost:3001/docs

Linting & Formatting

To ensure the code adheres to formatting and linting standards:

## Linting

```
yarn lint
```

## Formatting

```
yarn format
```

## Technologies Used

	•	NestJS - A progressive Node.js framework
	•	Sequelize - A promise-based Node.js ORM
	•	Passport - Middleware for authentication
	•	JWT - JSON Web Token for authorization
	•	MySQL - Database engine
	•	Swagger - API documentation
	•	Argon2 - Password hashing algorithm

## License

This project is UNLICENSED.

## Author

Created by Roman Havrylko.
