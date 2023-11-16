# Assignment (NodeJS API)

## Description

This project consists of API endpoints for user login system using MYSQL + Nodejs and CRUD APIs for manipulation of gameData for the specific users using JWT Auth.

## Installation

1. Clone the repository.
2. Install dependencies: `npm ci`.
3. Install MYSQL on the local machine. (For Linux system)
   Refer to: [How To Install MySQL on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-20-04)
4. Make a user in the mysql db and run the following commands for making the database and table USERS ,which is requred.
   -sudo mysql -u <username> -p <password>

   - CREATE DATABASE_NAME ;
   - use DATABASE_NAME;
   - CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     username VARCHAR(50) NOT NULL,
     email VARCHAR(50) NOT NULL UNIQUE,
     password_hash CHAR(60) NOT NULL,
     status ENUM('active', 'inactive') DEFAULT 'active',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );
   - DESC users;

   - Also, MODIFICATIONS in the ENV file needs to be done in env variables as hostname, username, database and password.

## Usage

1. Run the application: `npm start`.
2. Open your Postman or Thunderbird and access `localhost:3000/`, then paste the respective endpoints.
3. Dummy API payloads provided:

   - **Register User**

     - Endpoint: `/register` (POST)

     ```json
     {
       "username": "taj",
       "email": "taj@gmail.com",
       "password_hash": "12345",
       "status": "active"
     }
     ```

   - **Login User**

     - Endpoint: `/login` (POST)

     ```json
     {
       "email": "taj@gmail.com",
       "password": "12345"
     }
     ```

   - **Create Game**

     - Endpoint: `/user/createGame/userID` (POST)

     ```json
     {
       "gameName": ["pratik", "rugby"],
       "playerStatistics": [
         { "score": 1, "level": 2, "achievements": "old is first" },
         { "score": 2, "level": 3, "achievements": "old is second" }
       ],
       "gameResults": [
         { "wins": 1, "losses": 2 },
         { "wins": 4, "losses": 5 }
       ]
     }
     ```

   - **Update Game**

     - Endpoint: `/user/updateGame/userID` (POST)
       _(Payload similar to Create Game)_

   - **Delete Game**

     - Endpoint: `/user/deleteGame/userID` (GET)

   - **Get Game**
     - Endpoint: `/user/getGame/userID` (GET)

## Features

- API endpoints for login and registration operations using a local MySQL DB.
- API endpoints for CRUD operations to perform operations on Cloud MongoDB.

## Contact

For questions or support, please contact ritikjainjm75@gmail.com.
