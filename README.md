# 📝 DailyDo – Smart Timeline To-Dos with Reminders

DailyDo is a modern to-do web app that helps users plan their day, revisit past tasks via a timeline view, and never miss a deadline thanks to **web push reminders**.  
It’s built with **Next.js** (frontend), **Node.js + MySQL** (backend), styled with **Tailwind CSS**, and inspired by Google’s design language.

---

## 🚀 Features

- **Authentication**
  - Signup, login, logout
  - Forgot password (with email reset flow)

- **Daily To-Dos**
  - Add tasks with title, notes, and expiry time
  - Edit or delete tasks anytime
  - Mark tasks as complete / reopen

- **Timeline View**
  - View and filter **previous todos** by date
  - Timeline grouping by day/week/month

- **Smart Reminders**
  - Web Push notifications sent **6 hours before task expiry**
  - Browser-based opt-in notifications

- **Responsive UI**
  - Built with **Tailwind CSS**
  - Google-inspired cards and layouts
  - Mobile-first, accessible design
  - Includes favicon and icons for a polished look

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, Heroicons  
- **Backend:** Node.js (Express/Fastify), MySQL with ORM (Prisma/Sequelize)  
- **Notifications:** Web Push (VAPID, Service Worker)  
- **Auth:** JWT-based authentication with refresh tokens  
- **Infra (suggested):** Docker, Nginx, PM2, GitHub Actions CI/CD

---

## 📂 Project Structure (Suggested)

/frontend (Next.js)
/app
/components
/lib
/styles
public/ (favicon, manifest, sw.js)

backend (Node.js)
/src
/routes
/controllers
/services
/jobs (scheduler/cron)
/db (models/migrations)
/utils (jwt, email, push)
.env.example
docker-compose.yml

