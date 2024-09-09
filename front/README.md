# Frontend for React NestJS Sequelize Authorization App

This project is a frontend application built using React, designed to work with a NestJS backend that uses Sequelize for database management. It implements user authorization features such as registration, login, and token management.

# Project Structure

This React application interacts with the backend API for managing user authorization and authentication using Axios. Form validation is handled via React Hook Form and Zod. The app uses TailwindCSS for styling and React Toastify for notifications.

# Main Features

	•	User Authorization: Registration, login, and token refresh.
	•	Form Validation: Using React Hook Form with Zod.
	•	Routing: Via React Router.
	•	Responsive UI: Powered by TailwindCSS.
	•	Notifications: Via React Toastify.

# Tech Stack

# Frontend

	•	React (v18)
	•	React Router DOM (v6)
	•	React Hook Form (v7) for form management
	•	Axios for making HTTP requests
	•	TailwindCSS for styling
	•	Zod for schema validation
	•	React Toastify for notifications

# Development Tools

	•	TypeScript for static type checking
	•	CRACO for custom configuration overrides in Create React App
	•	Prettier and ESLint for code formatting and linting

# Installation

# Prerequisites

Ensure you have the following installed:

	•	Node.js (20.10.0)
	•	yarn

# Steps to Install
1. Navigate to the project directory:

```
cd front
```

2. Install dependencies:

```
yarn install
```
3. Create the .env file in the root directory to configure your environment variables:

```
REACT_APP_BASE_API_URI=http://localhost:3001
```

4. Start the development server:

```
yarn start
```

The app should now be running at http://localhost:3000.

Available Scripts

In the project directory, you can run:

```
yarn start
```

Runs the app in development mode.
Open http://localhost:3000 to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

```
yarn build
```

Builds the app for production to the build folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

```
yarn test
```

Launches the test runner in interactive watch mode.
See the section about running tests for more information.

# Configuration

## Environment Variables

You can configure environment variables by creating a .env file in the root of the project.

For example:

```
REACT_APP_API_URL=http://localhost:3001
```

These variables can be used throughout the app to configure API endpoints, authentication secrets, and more.

# Project Structure

	•	src/: Contains the main application code
	•	components/: Shared components like forms, buttons, etc.
	•	pages/: Pages like login, register, profile
	•	services/: API interaction using Axios
	•	hooks/: Custom React hooks
	•	utils/: Utility functions, helpers
	•	public/: Static files like index.html
	•	tailwind.config.js: TailwindCSS configuration

# Linting and Formatting

	•	Prettier is used for code formatting.
	•	ESLint is configured to ensure code quality.

To format the code manually, run:

```
yarn format
```

# Folder Aliases

For cleaner imports, folder aliasing is set up using react-app-alias. You can import from src without relative paths like this:

```
import { Login } from '@/pages/Login';
```

Author

Roman Havrylko

License

This project is UNLICENSED.