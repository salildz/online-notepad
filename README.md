# **Online Notepad**
<img alt="Header" src="https://img.shields.io/badge/Status-Active-success"> <img alt="Version" src="https://img.shields.io/badge/Version-1.0.0-blue"> <img alt="License" src="https://img.shields.io/badge/License-MIT-green">

A secure, modern full-stack web application for creating, editing, and managing personal notes with a clean and responsive interface.

## **📋 Features**

**User Authentication:** Secure signup and login with JWT-based authentication  
**Note Management:** Create, read, update, and delete notes  
**Responsive Design:** Works seamlessly on desktop and mobile devices  
**Dark/Light Theme:** User-configurable light and dark mode  
**Auto Refresh Token:** Maintains user sessions securely  
**Security Features:** XSS protection, rate limiting, and other security measures  

## **🖼️ Screenshots**

<table> <tr> <td><img src="https://github.com/salildz/online-notepad/blob/main/readmePics/login.png" alt= "Login Page"/></td> <td><img src="https://github.com/salildz/online-notepad/blob/main/readmePics/register.png" alt="Register Page" /></td> </tr> <tr> <td><img src="https://github.com/salildz/online-notepad/blob/main/readmePics/noNotes.png" alt="Note Page" /></td> <td><img src="https://github.com/salildz/online-notepad/blob/main/readmePics/4NotesEnglish.png" alt="Note Page" /></td> </tr> </table>

## **🛠️ Tech Stack**
### Frontend:
React.js, Material-UI components, Axios for API calls, Context API for state management
### Backend:
Node.js with Express, PostgreSQL with Sequelize ORM, JWT-based authentication, Helmet for security headers
### DevOps:
Docker & Docker Compose, Configurable for any cloud provider

## **🚀 Quick Start**
### Prerequisites:
Node.js (v14 or higher), PostgreSQL, Docker & Docker Compose (optional for containerization)

### Using Docker
1. Clone the repository:
```bash
git clone https://github.com/salildz/online-notepad.git
cd online-notepad
```

2. Create a .env file in the root directory:
```
NODE_ENV=development
BACKEND_PORT=9001
DB_HOST=db
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_PORT=9002
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

3. Build and start the containers:
```bash
docker-compose up -d
```

4. Access the application at http://localhost:6000

### Manual Setup
#### Backend Setup
1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```
NODE_ENV=development
BACKEND_PORT=9001
DB_HOST=db
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_db_name
DB_PORT=9002
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=15m
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

4. Start the server:
```bash
npm start
```

#### Frontend Setup
1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a .env file:
```
VITE_API_URL=http://localhost:6001/api
```

4. Start the client:
```bash
npm run dev
```

5. Access the application at http://localhost:9000

## **📝 API Reference**
### Authentication Endpoints
| Method | Endpoint              | Description                    | Request Body                           |
|--------|------------------------|--------------------------------|----------------------------------------|
| POST   | `/api/auth/register`   | Register a new user            | `{ username, email, password }`         |
| POST   | `/api/auth/login`      | Login a user                   | `{ identifier, password }`              |
| POST   | `/api/auth/refresh-token` | Refresh access token        | -                                      |
| POST   | `/api/auth/logout`     | Logout a user                  | -                                      |

### Note Endpoints
| Method | Endpoint         | Description           | Request Body / Parameters              |
|--------|------------------|-----------------------|----------------------------------------|
| GET    | `/api/note`      | Get all user notes    | -                                      |
| POST   | `/api/note`      | Add a new note        | `{ title, content }`                    |
| PUT    | `/api/note`      | Update a note         | `{ id, title, content }`                |
| DELETE | `/api/note/:id`  | Delete a note         | URL parameter: `id`                    |

## **🛡️ Security Features**
JWT-based authentication with refresh tokens  
HTTP security headers with Helmet.js  
Rate limiting for authentication endpoints  
CORS protection  
Password hashing with bcrypt  
Validated and sanitized inputs  
Protection against XSS attacks  
HTTPS support in production  

## **🐳 Docker Deployment**
The project includes Docker configuration for easy deployment to any cloud provider:

1. Build and push Docker images:
```bash
docker-compose build
docker tag online-notepad-client:latest yourusername/online-notepad-client:latest
docker tag online-notepad-server:latest yourusername/online-notepad-server:latest
docker push yourusername/online-notepad-client:latest
docker push yourusername/online-notepad-server:latest
```

2. Deploy to your cloud provider using the included docker-compose.yml file.

## **🤝 Contributing**
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## **📄 License**
This project is licensed under the MIT License - see the LICENSE file for details.

## **👨‍💻 Author**
Salih Yıldız - [GitHub@salildz](https://github.com/salildz/)
