### README.md

# SkyCourier Project

## Overview

SkyCourier is a Node.js application using Express.js for the backend and Microsoft SQL Server for the database. This application provides endpoints to manage users, handle authentication, and process orders.

## Prerequisites

- Node.js (v12 or later)
- Microsoft SQL Server
- npm (Node Package Manager)

## Installation

1. **Clone the repository:**

    git clone https://github.com/llinaax/Project_University.git
    cd Project_University

2. **Install dependencies:**

    npm install

3. **Configure database connection:**

    const config = {
      user: 'alina',          
      password: '12457800alina',           
      server: 'localhost',    
      port: 1433,            
      database: 'SkyCourier', 
      options: {
        encrypt: true,        
        trustServerCertificate: true 
      }
    };

4. **Set up the database:**

    Ensure that your SQL Server is running and create the `SkyCourier` database. Import the necessary tables and initial data as per your schema.

## Running the Application

1. **Start the server:**

    node app.js

2. **Access the application:**

    Open your browser and navigate to `http://localhost:5500`.

## API Endpoints

### Get All Users

- **URL:** `/api/users`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON array of users

### Create a New User

- **URL:** `/api/users`
- **Method:** `POST`
- **Body:**
  - `name` (String)
  - `email` (String)
  - `password` (String)
- **Success Response:**
  - **Code:** 201
  - **Content:** `Пользователь успешно создан.`
- **Error Response:**
  - **Code:** 500
  - **Content:** Error message

### User Login

- **URL:** `/api/login`
- **Method:** `POST`
- **Body:**
  - `email` (String)
  - `password` (String)
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON object with `success` and `username`
- **Error Response:**
  - **Code:** 401
  - **Content:** `Неверный email или пароль.`
  - **Code:** 500
  - **Content:** Error message

### Get Cafe by ID

- **URL:** `/api/cafe/:id`
- **Method:** `GET`
- **Success Response:**
  - **Code:** 200
  - **Content:** JSON object of cafe
- **Error Response:**
  - **Code:** 404
  - **Content:** `Кафе не найдено`
  - **Code:** 500
  - **Content:** Error message

### Create an Order

- **URL:** `/api/orders`
- **Method:** `POST`
- **Body:**
  - `items` (Array of objects)
    - `item` (String)
    - `price` (Number)
    - `quantity` (Number)
- **Success Response:**
  - **Code:** 201
  - **Content:** `Заказ успешно создан.`
- **Error Response:**
  - **Code:** 500
  - **Content:** Error message

## Static Files

Static files are served from the `public` directory. Ensure your `index.html` and other assets are placed in this directory.

## Development

To run the application in development mode with nodemon, use:

npm run dev


This will automatically restart the server when changes are detected.

## Contact

For any questions or issues, please contact Alina Taranova at [alina.taranova@nure.ua].

---

By following these instructions, you should be able to set up and run the SkyCourier project locally. If you encounter any issues or have any questions, feel free to reach out.