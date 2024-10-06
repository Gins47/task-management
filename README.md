# Kanban Board Task Management System

This is a full-stack Kanban board application built with React, NestJS, and MongoDB, designed to manage tasks in a simple and intuitive drag-and-drop interface. The project allows users to add columns, create tasks, edit them, and reorder tasks by dragging and dropping. The application is styled using TailwindCSS and uses Docker Compose for deployment.

## Table of Contents

1. Features
2. Technologies
3. Project Structure
4. Installation
5. Running the Application
6. API Endpoints
7. Deployment
8. License

## Features

- Add Columns: Users can create new columns for organizing tasks.
- Delete Column: User can delete the column and all the tasks in the column
- Add Tasks: Users can create tasks under specific columns.
- Edit Tasks: Tasks can be modified to update their content and attributes.
- Delete task: User can delete task
- Drag and Drop: Tasks can be dragged and dropped between columns using dnd-toolkit.
- Real-time Updates: The task order and column data update automatically when tasks are moved.
- Responsive Design: The UI is responsive, built with TailwindCSS.
- Persistent Storage: Tasks and columns are saved in a MongoDB database.
- Task Sequencing: Each task has a sequence number within its column, and the sequence updates on reordering.

## Technologies

### Frontend:

- React
- Vite
- TailwindCSS
- dnd-toolkit

### Backend:

- NestJS
- MongoDB

### DevOps:

- Docker
- Docker Compose

Monorepo Setup:

- npm workspace

## Project Structure

The project is structured as a monorepo using npm workspaces to manage the frontend and backend codebases. The folder structure is as follows:

```bash
/root
 ── /apps
 ├── /client (Frontend - React with Vite)
 └── /backend (Backend - NestJS)

```

## Installation

Install dependencies:

Make sure you have Node.js and npm installed. Then, run the following command to install dependencies for both frontend and backend:

```bash
npm install
Set up environment variables:
```

## Running the Application

Using Docker Compose:

This project is containerized using Docker Compose. Run the following command to start both the frontend and backend along with MongoDB:

```bash
docker-compose -f docker-compose.yaml up --build
```

This will start:

1. The frontend at http://localhost:3000
2. The backend API at http://localhost:3001

MongoDB service for data storage
Running Manually (Without Docker):

Frontend: Run the client application using Vite:

```bash
cd packages/client
npm run dev
```

Access the frontend at http://localhost:3000.

Backend: Start the NestJS server:

```bash
cd packages/backend/backend
npm run start:dev
```

The backend API will be available at http://localhost:3001.

## Deployment

To deploy the application using Docker, run:

```bash
docker-compose up --build -d
```

This will launch the application in detached mode. You can configure the environment variables to deploy the app to different environments (e.g., production).

## License

This project is licensed under the MIT License.
