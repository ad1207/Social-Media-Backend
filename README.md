# Social Media Backend Project

This is the backend code for a social media web application built using Node.js, Express.js, MongoDB, and Mongoose. This project is designed to provide a platform where users can share their thoughts and ideas, follow other users, and like and comment on their posts.

## Installation

To use this project, you need to have Node.js and MongoDB installed on your system. Once you have these dependencies installed, follow these steps:

1. Clone this repository using the command:
```
git clone https://github.com/ad1207/Social-Media-Backend.git
```

2. Navigate to the project directory:
```
cd Social-Media-Backend
```

3. Install the required packages using the command:
```
npm install
```

4. Create a `.env` file in the root directory of the project and add the following environment variables:

```
MONGODB_URL=<mongodb-url>
```

5. Start the server using the command:
```
npm start
```

The server will be running at http://localhost:port-number.

## Usage

This backend code provides APIs for creating and authenticating users, posting and retrieving posts, and following and unfollowing other users. 

### API Documentation

The API documentation can be found in the `API-Documentation.md` file in the root directory of the project.

### Authentication

This backend uses JWT tokens for authentication. To authenticate a user, create a POST request to `/auth/login` with the user's email and password. The server will respond with a JWT token, which you can use to access protected routes.

To access protected routes, include the JWT token in the `Authorization` header of your HTTP request with the value `Bearer <JWT token>`.

### Testing

This project uses Jest and Supertest for testing. To run the tests, use the command:
```
npm test
```

## Contributing

Contributions are welcome! If you find any bugs or want to add new features, feel free to open an issue or a pull request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
