
# Real-Time Collaboration Platform

A full-stack, real-time project management and collaboration platform built with Next.js, Node.js, Express, MongoDB, and Socket.IO.

## Features

- **User Authentication:** Secure login and signup with JWT.
- **Project Management:** Create, view, and manage multiple projects.
- **Task Management:** Assign, update, and track tasks with priorities, deadlines, and status.
- **Invitations:** Invite users to projects and manage invitations.
- **Team Management:** View and manage project members, with manager/member roles.
- **Real-Time Messaging:** Project-based chat with live updates using Socket.IO.
- **Notifications:** Real-time notifications for invitations and project events.
- **Dashboard & Reports:** Visualize project progress, completed/incomplete/overdue tasks, and team activity.
- **Responsive UI:** Modern, responsive design with Tailwind CSS and MUI charts.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, MUI, Axios, React Hot Toast, Socket.IO Client
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT, Bcrypt, Socket.IO
- **Real-Time:** Socket.IO server for chat and online presence
- **Other:** Universal Cookie, timeago.js, Lucide React Icons

## Monorepo Structure

```
Real-Time-Collaboration-Platform/
│
├── Backend/      # Express API, MongoDB models, business logic
├── Frontend/     # Next.js app, React components, styles
├── Socket/       # Socket.IO server for real-time features
└── README.md     # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/Real-Time-Collaboration-Platform.git
cd Real-Time-Collaboration-Platform
```

### 2. Install dependencies

Install for each part:

```bash
cd Backend
npm install

cd ../Frontend
npm install

cd ../Socket
npm install
```

### 3. Configure Environment

- Create a `.env` file in `Backend/` with your MongoDB URI and JWT secret.

Example:
```
MONGO_URI=mongodb://localhost:27017/rtc-platform
JWT_SECRET=your_jwt_secret
```

### 4. Run the servers

**Backend API:**
```bash
cd Backend
npm start
```

**Frontend (Next.js):**
```bash
cd Frontend
npm run dev
```

**Socket.IO Server:**
```bash
cd Socket
node index.js
```

### 5. Open the app

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Sign up / Log in** to your account.
- **Create a project** or join via invitation.
- **Add tasks** to projects, assign to members, set deadlines and priorities.
- **Chat** in real-time with your team in each project.
- **View reports** and dashboards for project progress.
- **Manage team members** and invitations.

## Development

- Frontend code: `Frontend/app/`
- Backend API: `Backend/`
- Real-time server: `Socket/`

## Scripts

- `npm run dev` (Frontend): Start Next.js dev server
- `npm start` (Backend): Start Express API
- `node index.js` (Socket): Start Socket.IO server

## License

This project is licensed under the MIT License.
