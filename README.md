# StudentPG Bhopal

StudentPG Bhopal is a full-stack web platform that helps students find verified PGs (paying guest accommodations) and rental rooms in Bhopal. The idea is to make it easier for students to find a place to stay, while also giving PG owners a way to list and manage their properties.

## Current status

This is an active MVP (version 1). Right now the focus is on:

- PG discovery
- Area-based filtering
- A responsive UI
- Letting students contact owners directly on WhatsApp

## Features

**For students**
- Browse PG listings
- Search by location
- Filter by area and PG type
- View listing details
- Contact owners through WhatsApp

**For owners (in progress)**
- Registration and login
- Add, edit, and delete listings

**For admins (planned)**
- Verify listings
- Approve or reject owners
- Manage listings and monitor activity

## Tech stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Spring Boot, Spring Data MongoDB, REST APIs
- Database: MongoDB Atlas
- Tools: Git, GitHub, VS Code, Postman

## Architecture

The project is split into a frontend, a backend, and a database, and they talk to each other like this:

```
Frontend (React/Vite) --- REST API (JSON over HTTP) ---> Backend (Spring Boot) ---> MongoDB Atlas
```

The backend itself is organized in layers:

- `controller` - exposes the REST endpoints the frontend calls
- `service` - handles the business logic (filtering, validation, etc.)
- `repository` - talks to MongoDB using Spring Data
- `model` - defines the data structures (PG listings, owners, and so on)

Keeping these separate makes it easier to change one part (say, swap the database, or add a mobile app later) without having to touch everything else.

## Project structure

```
studentpg-project
├── frontend
│   ├── src
│   ├── public
│   └── tests
├── backend
│   ├── controller
│   ├── service
│   ├── repository
│   └── model
├── README.md
├── ROADMAP.md
└── CONTRIBUTING.md
```

## Getting started

You'll need:

- Node.js 18+ and npm
- Java JDK 17+
- Maven (or the `mvnw` wrapper if the backend includes one)
- A MongoDB Atlas account (the free tier works fine), or a local MongoDB instance

A sample environment file is available at [.env.example](.env.example). Copy it to `.env` and fill in the required values before starting the services.

**1. Clone the repo**

```bash
git clone https://github.com/khuman-dhakad/studentpg-project.git
cd studentpg-project
```

**2. Set up the backend**

```bash
cd backend
```

Add your MongoDB connection string to `src/main/resources/application.properties`:

```
spring.data.mongodb.uri=your_mongodb_connection_string
server.port=8080
```

Then run it:

```bash
./mvnw spring-boot:run
```

This starts the backend on `http://localhost:8080`.

The API documentation is available at `http://localhost:8080/swagger-ui/index.html` once the backend is running.

**3. Set up the frontend**

In a separate terminal:

```bash
cd frontend
npm install
```

If the frontend needs to know where the API is, set it in `frontend/.env` (see
[`frontend/.env.example`](frontend/.env.example)):

```
NEXT_PUBLIC_API_URL=http://localhost:8080
BACKEND_INTERNAL_URL=http://localhost:8080
```

Then run it:

```bash
npm run dev
```

This starts the frontend on `http://localhost:5173`.

Once both are running, open `http://localhost:5173` in your browser. Make sure the backend is up first so the frontend has something to fetch data from.

## Roadmap

**Version 1 (current)** - search, area filtering, WhatsApp contact, responsive design, basic owner management

**Version 2** - student accounts, saved favorites, advanced filters, user profiles

**Version 3** - reviews and ratings, booking requests, online payments

**Version 4** - Android app, AI-based recommendations, analytics dashboard

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

Check `CONTRIBUTING.md` before working on anything major.

## Long-term vision

The goal is for StudentPG to become a trusted accommodation platform for students in Bhopal, and eventually expand to other cities. It's being built both as an open-source learning project and as a real startup idea.

## Author

Khuman Dhakad - MCA student, Java developer
GitHub: https://github.com/khuman-dhakad