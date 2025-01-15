# Mithril News Backend

Welcome to the backend repository for Mithril News, a fullstack application that allows users to post and interact with articles. This backend was built using Node.js and Express, with a PostgreSQL database for data storage and Jest for testing. The application leverages Supabase for real-time functionality and is deployed on Render.

## Features

- **RESTful API:** Provides endpoints for managing articles, users, and interactions.
- **Database Integration:** Uses PostgreSQL for structured data storage.
- **Real-Time Functionality:** Powered by Supabase to enable live updates.
- **Testing Suite:** Comprehensive tests written with Jest to ensure API reliability.

## Tech Stack

### Backend
- **Node.js**: JavaScript runtime for building scalable server-side applications.
- **Express**: Framework for creating robust APIs.
- **PostgreSQL**: Relational database for managing application data.
- **Jest**: Testing framework for unit and integration tests.

### Deployment
- **Render**: Hosting platform for deploying the backend service.

### Fullstack Tech Stack Overview
For the fullstack implementation, the project also utilizes the following technologies:
- **Frontend:** React Vite, CSS, HTML, Material-UI (MUI)
- **Hosting:** Netlify (frontend), Render (backend)
- **Database:** Supabase

## Installation and Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/NadimChatellier/Mithril-news.git
   cd Mithril-news
   ```

2. **Install Dependencies**
   Make sure you have Node.js and npm installed, then run:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the root of the project and add the following:
   ```env
   DATABASE_URL=your_postgresql_database_url
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```

4. **Run the Development Server**
   ```bash
   npm start
   ```
   The server will start at `http://localhost:3000`.

5. **Run Tests**
   To execute the test suite:
   ```bash
   npm test
   ```

## API Endpoints

### Articles
- `GET /api/articles`: Retrieve a list of all articles.
- `POST /api/articles`: Create a new article.
- `GET /api/articles/:id`: Retrieve details of a specific article.
- `PATCH /api/articles/:id`: Update an article.
- `DELETE /api/articles/:id`: Delete an article.

### Users
- `GET /api/users`: Retrieve a list of all users.
- `POST /api/users`: Register a new user.

### Interactions
- `POST /api/articles/:id/interact`: Add an interaction (like/dislike) to an article.

## Deployment
The backend is deployed on Render and is accessible at [Mithril News Backend](#).

## Contributing

We welcome contributions to improve the application. To contribute:
1. Fork the repository.
2. Create a new branch.
3. Commit and push your changes.
4. Open a pull request.

## Frontend Repository
The frontend of this project is available here: .

Thank you for exploring Mithril News! If you have any questions or suggestions, feel free to open an issue or contact the maintainers.

