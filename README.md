# AgriNexus Waitlist Backend

## Overview
This project provides the backend infrastructure for the AgriNexus waitlist system.

## Getting Started
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Create a `.env` file with your MongoDB connection string and JWT secret.
4. Start the server: `node server.js`.

## Server URL
The backend server runs on the following URL:
- **Development**: `http://localhost:5000`

## Swagger Documentation URL
You can access the Swagger API documentation at:
- **Swagger UI**: `http://localhost:5000/api-docs`

This provides an interactive interface for testing the API endpoints and exploring the available routes, parameters, and responses.

## Endpoints
Here are some of the key endpoints available:
- **GET** `/waitlist/register`: Register a new user on the waitlist.
- **GET** `/waitlist/benefits`: View available benefits.
- **GET** `/waitlist/admin/waitlist/stats`: Get statistics about the users in the waitlist.
- **POST** `/waitlist/admin/waitlist/approve`: Approve a user for the waitlist.
- **POST** `/waitlist/admin/waitlist/reject`: Reject a user from the waitlist.

## Environment Variables
Make sure to set up the following environment variables in your `.env` file:
- `MONGODB_URI`: Your MongoDB connection string.
- `JWT_SECRET`: Secret key used for signing JWT tokens.

## Running the Project
Once everything is set up, you can start the server by running the command:
```bash
node server.js
