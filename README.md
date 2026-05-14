# Todo App

A beautiful todo application built with Next.js, featuring multi-user authentication and data isolation.

## Features

- 🚀 **Multi-user Support**: Register and login with email and password
- 🔐 **Data Isolation**: Each user only sees their own todos
- ✏️ **Create Todos**: Add new tasks with title and description
- ✅ **Complete Todos**: Check off completed tasks
- 🗑️ **Delete Todos**: Remove unwanted tasks
- 🎨 **Beautiful UI**: Modern gradient design with smooth animations

## Tech Stack

- **Framework**: Next.js 14
- **Authentication**: NextAuth.js
- **Database**: SQLite (easily switchable to PostgreSQL/Neon)
- **ORM**: Prisma
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18.17.0
- npm >= 9.6.7

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and set your NextAuth secret:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-must-be-at-least-32-characters-long"
```

4. Initialize the database:

```bash
npx prisma migrate dev --name init
```

5. Run the development server:

```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Register**: Go to `/register` to create a new account
2. **Login**: Go to `/login` to sign in
3. **Manage Todos**: After logging in, you can:
   - Add new todos
   - Mark todos as complete
   - Delete todos

## Switching to PostgreSQL/Neon

To use PostgreSQL with Neon:

1. Update `.env` with your Neon database URL:

```env
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host:5432/database?sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

2. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

3. Run migrations:

```bash
npx prisma migrate dev --name init
```

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── todos/...
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   ├── Header.tsx
│   ├── SignOutButton.tsx
│   ├── TodoForm.tsx
│   ├── TodoList.tsx
│   └── SessionWrapper.tsx
├── lib/
│   ├── auth.ts
│   └── actions.ts
├── prisma/
│   ├── schema.prisma
│   └── client.ts
└── .env.example
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
