# docker_task_manager

A full-stack Dockerized task management web application that allows users to:

Add and view tasks

Search for similar tasks using vector similarity (pgvector + Sentence Transformers)

Store data in a PostgreSQL database

Run everything in isolated Docker containers

Built using React (frontend), Flask (backend), and PostgreSQL + pgvector (database).


🚀 Features
✅ Add new tasks with title, description, and status

🔍 Search for similar tasks using semantic vector search

💾 Local storage caching for better performance

💻 Fully containerized with Docker + Docker Compose

🌐 Cross-origin support (CORS)

🎨 Simple modern UI with responsive layout


🛠️ Technologies Used
Layer	Stack
Frontend:	React, CSS
Backend:	Flask, SQLAlchemy, Sentence Transformers
Database:	PostgreSQL, pgvector extension
Containerization:	Docker, Docker Compose


Run with Docker Compose
bash
Copy
Edit
docker-compose up --build
This command will:

Build and run the Flask backend on port 5050

Build and run the React frontend on port 3030

Launch a PostgreSQL database with pgvector on port 5432

Open the app
Visit: http://localhost:3030
