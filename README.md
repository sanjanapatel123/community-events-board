<div align="center">

# 🌸 Community Events Board

**Local events. Shared interests. Better plans.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-17151B?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-BB76A2)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma)

A small app where admins post local events and visitors discover events they enjoy.

</div>

---

### ✨ Features

- **Admin:** Login, create events and switch events between Active and Inactive.
- **Discover:** Active, upcoming events with category, city and search filters together, plus pagination.
- **My Feed:** Events based on saved favourite categories.
- **Reminders:** Instant button updates, saved after refresh and rollback if saving fails.
- **Card designer:** Three themes, five stickers, up to three selected stickers and saved designs.
- **UI:** Responsive layouts, loading/error/empty states, Indian prices and IST dates.

### 🛠️ Stack

| Frontend | Backend |
|---|---|
| Next.js App Router, TypeScript, Tailwind CSS | Node.js, Express, TypeScript |
| TanStack Query & Table, React Hook Form, Zod | PostgreSQL, Prisma, JWT, Argon2id |

### 🚀 Run locally

**Requirements:** Node.js 22.12+, npm and Docker Desktop.

Clone the repository and open its root folder. Start PostgreSQL:

```bash
docker compose up -d
```

**Backend — terminal 1:**

```bash
cd backend
npm ci
```

Copy `.env.example` to `.env`. Generate a JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Paste the output into `JWT_SECRET` in `.env`, then run:

```bash
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run dev
```

**Frontend — terminal 2:**

```bash
cd frontend
npm ci
```

Copy `.env.example` to `.env.local`, then run:

```bash
npm run dev
```

Open **http://localhost:3000**. API runs at **http://localhost:5000/api**.

The seed adds an admin and 15 sample events across different categories and cities, including past and inactive events. Running it again does not duplicate them.

### 🔑 Demo admin

Use these local values in the backend `.env` before seeding:

```env
ADMIN_EMAIL=admin@community.test
ADMIN_PASSWORD=CommunityAdmin@123
```

Log in with these credentials to open `/admin`. Visitors can create their own account through signup.

### 🔌 API overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/signup`, `/api/auth/login` | Create account / log in |
| GET / POST | `/api/auth/me` / `/api/auth/logout` | Current user / log out |
| GET | `/api/events`, `/api/events/:id` | Browse events / details |
| GET / POST | `/api/admin/events` | Admin list / create event |
| PATCH | `/api/admin/events/:id/status` | Activate or deactivate |
| GET / PUT | `/api/favourites` | Read / save categories |
| GET | `/api/feed` | Personalised upcoming events |
| GET | `/api/reminders` | Saved reminder IDs |
| PUT / DELETE | `/api/reminders/:eventId` | Save / remove reminder |
| GET / PUT | `/api/card-designs/:eventId` | Read / save card design |

Protected APIs accept a JWT through a Bearer header or an HttpOnly cookie.

### 💬 Design answers

**1. What is the database structure, and why?**

I used five tables: `User`, `Event`, `FavouriteCategory`, `Reminder` and `CardDesign`.  
Favourites belong to a user; reminders and designs belong to a user and an event.  
Combined keys prevent duplicate reminders and multiple designs for the same user/event.  
Event prices use Decimal, and events are made inactive instead of deleted.

**2. How do the filters work, and what index would you add?**

I build one Prisma `where` condition for active and upcoming events.  
Category, city and search work together with AND; search matches title OR description.  
The same condition is used for the results and total count, ordered by date and ID.  
I added listing indexes; for larger text searches, I would add PostgreSQL trigram GIN indexes.

**3. How are passwords and admin routes protected?**

I store Argon2id password hashes, not plain passwords. Login returns an expiring JWT.  
Express verifies the token and reads the user's role from the database.  
Admin APIs require the ADMIN role, and Next.js checks the session on the server before showing admin pages.  
Browser authentication uses an HttpOnly cookie; public signup always creates a regular user.

### 📝 Current notes

- Favourite categories can be selected from **My interests**; an automatic first-login prompt is pending.
- Reminders save a preference; they do not send emails or SMS.
- Card previews update live. Click **Save my design** to keep changes after refresh.
- Logout clears the browser cookie; an issued Bearer token remains valid until expiry.
- Final production-build and mobile checks are still pending.

### 🤖 AI usage

I used ChatGPT ,cloud ai, emergent ai for setup guidance, code drafts, UI ideas and debugging.
