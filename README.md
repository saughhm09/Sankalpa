# Sankalpa

> **Discipline over Motivation. Consistency over Intensity.**

Sankalpa is a modern, self-contained productivity web application built to help you build discipline through structured habits, daily task management, focused routines, and progress tracking.

It is not a feature-heavy all-in-one platform. Sankalpa does a few things exceptionally well and stays out of your way.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Pages & Routes](#pages--routes)
- [API Reference](#api-reference)
- [Development Phases](#development-phases)
- [Design Philosophy](#design-philosophy)

---

## Overview

Most productivity apps try to do everything. They end up cluttered, overwhelming, and ironically — counterproductive.

Sankalpa takes the opposite approach. It focuses on the fundamentals:

- **What do I need to do today?** → Tasks
- **What habits am I building or breaking?** → Habits
- **How am I spending my time?** → Routines & Timer
- **Am I actually making progress?** → Reports

Everything runs locally. No accounts, no cloud sync, no subscriptions. Just you and your data.

---

## Features

### Landing Page
A minimal entry screen with the Sankalpa logo, name, tagline, and a single **Get Started** button. Clean, distraction-free, and purpose-built.

---

### Dashboard (`/dashboard`)
Your daily command center. Everything important is visible at a glance.

- **Greeting** — Changes based on time of day (Good Morning / Afternoon / Evening)
- **Live Clock** — Current date and time, updated every second
- **Stats Cards** — Tasks completed today, active habits count, current streak
- **Today's Tasks** — A preview of today's 5 most important tasks with priority badges
- **Today's Habits** — A preview of today's habits with completion status
- **Routines** — Quick access to your created routines

---

### Tasks (`/tasks`)
Full task lifecycle management.

**Fields per task:**
- Title (required)
- Description (optional)
- Due Date (required)
- Due Time (optional)
- Duration in minutes (optional)
- Priority — Low, Medium, High
- Status — Pending, In Progress, Completed

**Actions:**
- Create a new task using the **Add Task** button
- Edit any task using the pencil icon — opens an inline form pre-filled with existing data
- Delete a task with confirmation prompt
- Toggle completion by clicking the checkbox
- Filter tasks by status: All, Pending, In-Progress, Completed
- Priority is color-coded: red (high), yellow (medium), grey (low)

---

### Habits (`/habits`)
Track both positive and negative habits consistently over time.

**Two habit types:**
- **Build** — Habits you want to form (Workout, Read, Meditate, Drink Water)
- **Quit** — Habits you want to break (Reduce Screen Time, Stop Procrastinating)

**Fields per habit:**
- Name (required)
- Description (optional)
- Type — Build or Quit
- Frequency — Daily or Weekly
- Start Date (required)
- End Date (optional)
- Reminder Time (required)
- Target Duration in minutes (optional)

**Actions:**
- Create, edit, and delete habits
- Mark today's habit as **Done** or **Missed** directly from the card
- View streak count on each card
- Click the **eye icon** to open the full habit detail page

---

### Habit Detail & Grid (`/habits/[id]`)
A dedicated report page for each individual habit.

**Stats shown:**
- Current Streak (consecutive completed days)
- Longest Streak (best streak ever recorded)
- Consistency % (completed days ÷ total days since start)
- Total Completed Days

**GitHub-style Contribution Grid:**
- Displays the last **12 weeks** of daily activity
- Each cell represents one day
- Color coding:
  - 🟢 Green — Completed
  - 🔴 Red — Missed
  - 🟡 Yellow — Pending (today, not yet marked)
  - ⬜ Light grey — Future date
  - Darker grey — Before habit start date
- Hover over any cell to see the date and status
- Month labels along the top, day labels along the side
- Legend at the bottom

**Timeline section:**
- Start date, end date (if set), reminder time

**Recent Activity:**
- Last 5 history entries with date and status badge

---

### Routines (`/routines`)
Create and manage structured daily routines with ordered steps.

**Examples:**
- Morning Routine — Wake Up → Brush → Bath → Breakfast → Leave
- Study Routine — Review Notes → Practice Problems → Summarize
- Evening Routine — Reflect → Journal → Read → Sleep

**Fields per routine:**
- Name (required)
- Description (optional)
- Steps — each step has:
  - Name (required)
  - Scheduled time (optional)
  - Duration in minutes (optional)

**Actions:**
- Create, edit, delete routines
- Add unlimited steps
- Reorder steps using the ↑ ↓ buttons
- Total duration is calculated and displayed automatically
- Step count shown on the card

---

### Timer (`/timer`)
A clean, distraction-free focus timer.

**Set duration using:**
- Quick presets: 1m, 5m, 15m, 25m, 45m, 60m
- Custom input with separate **minutes** and **seconds** fields (e.g. 4 minutes 30 seconds)

**Controls:**
- **Start** — begins the countdown
- **Pause** — freezes the timer
- **Resume** — continues from where it paused
- **Stop** — ends and resets to original duration
- **Reset** — returns to original duration

**Display:**
- Large MM:SS countdown in monospace font
- Circular SVG progress ring that depletes as time passes
- Start button is disabled if both minutes and seconds are 0

---

### Reports (`/reports`)
A dedicated progress page. Review your performance whenever you choose — not a live updating analytics dashboard.

**Today:**
- Tasks completed
- Habits completed

**This Week:**
- Tasks completed
- Habits completed
- Current streak

**This Month:**
- Total tasks completed
- Total habits completed
- Longest streak

**Insights panel:**
- A plain-English summary of your activity (e.g. "You've completed 7 items today")

---

## Tech Stack

| Area | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | SQLite | — |
| ORM | Prisma | 7.x |
| State Management | Zustand | — |
| Animations | Framer Motion | — |
| Icons | Lucide React | — |
| Date Handling | dayjs | — |
| Charts | Recharts | — |
| Theming | next-themes | — |
| DB Adapter | @prisma/adapter-libsql | — |

> All data is stored locally in a SQLite file at `prisma/dev.db`. No external services required.

---

## Project Structure

```
sankalpa/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (/)
│   ├── layout.tsx                # Root layout with ThemeProvider
│   ├── globals.css               # Global styles and CSS variables
│   │
│   ├── dashboard/
│   │   └── page.tsx              # Dashboard (/dashboard)
│   │
│   ├── tasks/
│   │   └── page.tsx              # Tasks page (/tasks)
│   │
│   ├── habits/
│   │   ├── page.tsx              # Habits list (/habits)
│   │   └── [id]/
│   │       └── page.tsx          # Habit detail + grid (/habits/[id])
│   │
│   ├── routines/
│   │   └── page.tsx              # Routines (/routines)
│   │
│   ├── timer/
│   │   └── page.tsx              # Timer (/timer)
│   │
│   ├── reports/
│   │   └── page.tsx              # Reports (/reports)
│   │
│   └── api/                      # REST API routes
│       ├── tasks/
│       │   ├── route.ts           # GET all, POST create
│       │   └── [id]/
│       │       └── route.ts       # GET one, PATCH update, DELETE
│       ├── habits/
│       │   ├── route.ts           # GET all, POST create
│       │   └── [id]/
│       │       ├── route.ts       # GET one, PATCH update, DELETE
│       │       └── track/
│       │           └── route.ts   # POST track habit for a day
│       └── routines/
│           ├── route.ts           # GET all, POST create
│           └── [id]/
│               └── route.ts       # GET one, PATCH update, DELETE
│
├── components/
│   ├── habits/
│   │   └── habit-grid.tsx        # GitHub-style contribution grid
│   ├── layout/
│   │   └── navigation.tsx        # Top navigation bar
│   ├── providers/
│   │   └── theme-provider.tsx    # next-themes wrapper
│   └── ui/
│       └── theme-toggle.tsx      # Light/dark mode toggle button
│
├── features/
│   └── dashboard/
│       ├── dashboard-view.tsx    # Dashboard layout container
│       ├── dashboard-header.tsx  # Greeting + live clock
│       ├── dashboard-stats.tsx   # Stats cards (server component)
│       ├── today-tasks.tsx       # Today's tasks preview
│       ├── today-habits.tsx      # Today's habits preview
│       └── today-routines.tsx    # Routines preview
│
├── lib/
│   ├── prisma.ts                 # Prisma client singleton (libsql adapter)
│   ├── date.ts                   # Date helpers built on dayjs
│   └── utils.ts                  # cn() class merging utility
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── dev.db                    # Local SQLite database file
│   └── migrations/               # Migration history
│
├── types/
│   └── index.ts                  # Shared TypeScript types and enums
│
├── prisma.config.ts              # Prisma datasource config
├── next.config.ts                # Next.js config
├── tailwind.config.ts            # Tailwind config
└── tsconfig.json                 # TypeScript config
```

---

## Database Schema

### Task
| Field | Type | Notes |
|---|---|---|
| id | String | cuid, primary key |
| title | String | required |
| description | String? | optional |
| dueDate | DateTime | required |
| dueTime | String? | e.g. "09:00" |
| duration | Int? | minutes |
| priority | String | low / medium / high |
| status | String | pending / in-progress / completed |
| completedAt | DateTime? | set when status = completed |
| createdAt | DateTime | auto |
| updatedAt | DateTime | auto |

### Habit
| Field | Type | Notes |
|---|---|---|
| id | String | cuid, primary key |
| name | String | required |
| description | String? | optional |
| type | String | build / quit |
| startDate | DateTime | required |
| endDate | DateTime? | optional |
| reminderTime | String | e.g. "08:00" |
| frequency | String | daily / weekly |
| targetDuration | Int? | minutes |

### HabitHistory
| Field | Type | Notes |
|---|---|---|
| id | String | cuid |
| habitId | String | foreign key → Habit |
| date | DateTime | start of day |
| status | String | completed / missed / pending |
| completedAt | DateTime? | when marked done |
| duration | Int? | actual duration in minutes |

### Routine
| Field | Type | Notes |
|---|---|---|
| id | String | cuid |
| name | String | required |
| description | String? | optional |

### RoutineStep
| Field | Type | Notes |
|---|---|---|
| id | String | cuid |
| routineId | String | foreign key → Routine |
| name | String | required |
| time | String? | scheduled time |
| duration | Int? | minutes |
| order | Int | step position |

---

## Getting Started

### Prerequisites
- Node.js 18 or later
- npm

### Installation

```bash
# 1. Navigate to the project folder
cd sankalpa

# 2. Install all dependencies
npm install

# 3. Run database migrations (creates prisma/dev.db)
npx prisma migrate dev

# 4. Generate the Prisma client
npx prisma generate

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Reset the Database

```bash
npx prisma migrate reset
npx prisma generate
```

> This deletes all data and re-runs migrations from scratch.

---

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static | Landing page |
| `/dashboard` | Static | Daily overview |
| `/tasks` | Client | Full task management |
| `/habits` | Client | Habit list and tracking |
| `/habits/[id]` | Server | Habit detail with grid |
| `/routines` | Client | Routine management |
| `/timer` | Client | Focus timer |
| `/reports` | Client | Progress reports |

---

## API Reference

### Tasks

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Fetch all tasks (optional `?status=` filter) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/[id]` | Fetch a single task |
| PATCH | `/api/tasks/[id]` | Update a task |
| DELETE | `/api/tasks/[id]` | Delete a task |

### Habits

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/habits` | Fetch all habits with last 30 days of history |
| POST | `/api/habits` | Create a new habit |
| GET | `/api/habits/[id]` | Fetch a single habit with full history |
| PATCH | `/api/habits/[id]` | Update a habit |
| DELETE | `/api/habits/[id]` | Delete a habit |
| POST | `/api/habits/[id]/track` | Mark a habit as completed or missed for a date |

### Routines

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/routines` | Fetch all routines with steps |
| POST | `/api/routines` | Create a new routine with steps |
| GET | `/api/routines/[id]` | Fetch a single routine |
| PATCH | `/api/routines/[id]` | Update routine and replace all steps |
| DELETE | `/api/routines/[id]` | Delete a routine and its steps |

---

## Development Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Project setup, Prisma, SQLite, global layout, theming | ✅ Complete |
| 2 | Dashboard with greeting, live clock, stats, previews | ✅ Complete |
| 3 | Tasks — full CRUD, filtering, priority, status | ✅ Complete |
| 4 | Habits — full CRUD, daily tracking, streaks | ✅ Complete |
| 5 | Habit Grid — GitHub-style 12-week activity grid | ✅ Complete |
| 6 | Routines — full CRUD, step ordering | ✅ Complete |
| 7 | Timer — presets, custom minutes + seconds, progress ring | ✅ Complete |
| 8 | Reports — daily, weekly, monthly summaries | ✅ Complete |
| 9 | Polish — routine execution mode, animations, advanced reports | 🔄 In Progress |

---

## Design Philosophy

Sankalpa is built around one principle: remove friction from the process of building discipline.

**The UI is:**
- Minimal — nothing on screen that doesn't earn its place
- Calm — no bright gradients, no noise, no clutter
- Responsive — works on any screen size
- Fast — server components where possible, instant client interactions
- Consistent — same spacing, same radius, same type scale throughout

**Dark and light mode** are both first-class. The theme preference is persisted across sessions.

**Typography, spacing, and hierarchy** do the heavy lifting. The design borrows its philosophy from tools like Linear and Vercel — opinionated, clean, and purposeful.

---

## License

Personal project. Built for learning, self-improvement, and experimentation.
