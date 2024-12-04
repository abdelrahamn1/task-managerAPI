[![npm version](https://badge.fury.io/js/your-package-name.svg)](https://badge.fury.io/js/your-package-name)
[![JavaScript](https://img.shields.io/badge/javascript-ES6-green)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-eslint-4B32C3.svg)](https://eslint.org/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Postman Collection](https://img.shields.io/badge/Postman-Collection-blue)](https://www.postman.com/your-collection-link)


# Task manager RestAPI 
> The Task Management API is designed to help manage tasks across different user roles, with robust authentication and secure password recovery features. Below are the main functionalities of the API:

## How It Works

The Task Management API provides functionalities for admins and users to manage tasks and user profiles efficiently. Below is a detailed breakdown of the key features:

### Admin Controller:
The **Admin** has full control over the system and can perform various CRUD (Create, Read, Update, Delete) operations for users and tasks. Admins can:
- **Add, update, delete, or get** any user profile.
- **Assign roles** (e.g., user, manager) and manage user permissions.
- **View system-wide task reports** and monitor user activity.

### User Task Management:
Each **user** can manage their own tasks with the following capabilities:
- **Add new tasks**: Users can create tasks with details such as due date, priority, and status.
- **Update tasks**: Users can update the status, priority, and description of existing tasks.
- **Delete tasks**: Users can delete tasks they no longer need.
- **View and list tasks**: Users can view and filter all their tasks (e.g., by due date, priority, or status). They can also view completed or pending tasks.

### Authentication & Authorization:
The API supports user **login** and **sign-up** functionality with:
- **JWT Authentication**: Secure, token-based login system for both regular users and admins.
- **Error Handling**: Robust error handling for login attempts, account creation, and unauthorized access.
- **Role-based Access Control (RBAC)**: Depending on the user role (e.g., admin, regular user), different permissions are granted, ensuring secure access to resources.

### Password Reset & Recovery:
The API provides a **password recovery** mechanism using **NodeMailer** to securely send password reset emails:
- **Request password reset**: Users can request a password reset if they forget their password.
- **Reset token**: A secure reset token is sent via email to the user's registered email address.
- **Token expiration**: Password recovery includes expiration-based tokens for added security and a smooth user experience.

### Error Handling:
- Comprehensive **error handling** is implemented throughout the system, including scenarios for invalid credentials, unauthorized access, and invalid task operations (e.g., deleting a non-existent task).
- Proper **HTTP status codes** and **messages** are returned to inform users about success or failure.


## Prerequisites
 This project requires NodeJS (version 18 or later) , EXPRESS (Version 4 or latter), NPM (Version 5 or later)  , MOngoDB (Version 5 or later) ,  MOngoose (Version 8 or later)
 , [Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.


 To make sure you have them available on your machine,
try running the following command.


```sh
$ npm -v && node -v
10.9.0
v22.11.0
```
``

### .env file requirements
you must provide the following environment variables to run the application
```sh
DATABASE = <your-mongo-db-uri>    # MongoDB Atlas URI
DATABASE_PASSWORD = <your-db-password>  # MongoDB Atlas password
PORT = <your-port>    # Port number (e.g., 5000)
JWT_SECRET_KEY = <your-jwt-secret>    # Secret key for JWT
JWT_EXPIRES = <token-expiration-time>  # JWT expiration (e.g., '1d')
EMAIL = <your-email-address>    # Sender email for NodeMailer
EMAIL_USER = <your-email-username>  # NodeMailer username
EMAIL_PASS = <your-email-password>  # NodeMailer password
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone [https://github.com/abdelrahamn1/task-managerAPI.git]
```

To install and set up the library, run:

```sh
$ npm install
```

Or if you prefer using Yarn:

```sh
$ yarn add
```

## Usage

### Serving the app

```sh
$ npm start
```

or if it dose't work : 

```sh
$ node server.js
```

Or if you prefer using Yarn:

```sh
$ yarn start
```


## Built With
* Node.js 
* EXPRESS
* MongoDB
* nodmailer
* Post Man


* ## Authors

* **abdelrahman1** - *Initial work* - [abdelrahman1](https://github.com/abdelrahman1)
