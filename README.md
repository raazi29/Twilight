# Driver Payments Module

A production-ready admin dashboard for managing driver earnings, settlements, and payment preferences. Built for operations teams to track Batta (weekly) and Salary (monthly) components.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)

## Features

- **🚗 Route Configuration** - Define routes with per-trip Batta and Salary values
- **👤 Driver Management** - Register drivers with customizable payment preferences
- **📊 Trip Tracking** - Record trips with automatic earnings calculation
- **💰 Earnings Dashboard** - Weekly/Monthly view with summary cards
- **✅ Settlement System** - Process payments with detailed breakdowns
- **📜 Settlement History** - Expandable rows showing trip-level details

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [Clerk](https://clerk.com/) | Authentication & user management |
| [Supabase](https://supabase.com/) | PostgreSQL database |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Radix UI](https://radix-ui.com/) | Accessible UI primitives |
| [Vercel](https://vercel.com/) | Deployment platform |

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd twilight_assignment
npm install
```

### 2. Configure Environment

Create `.env.local` in the project root:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx  # Optional: for server-side operations
```

### 3. Set Up Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Open **SQL Editor**
3. Copy and run the SQL from `supabase/schema.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/                # API routes
│   │   ├── drivers/        # Driver CRUD
│   │   ├── routes/         # Route CRUD
│   │   ├── trips/          # Trip CRUD
│   │   ├── earnings/       # Earnings aggregation
│   │   └── settlements/    # Settlement CRUD
│   ├── drivers/            # Driver management page
│   ├── routes/             # Route configuration page
│   ├── trips/              # Trip tracking page
│   ├── settlements/        # Settlement history page
│   ├── sign-in/            # Clerk auth
│   └── page.tsx            # Dashboard
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Sidebar, Header
│   └── earnings/           # Earnings-specific components
├── hooks/                  # Custom React hooks
└── lib/
    ├── supabase/           # Database client
    ├── utils.ts            # Helper functions
    └── earnings-calculator.ts  # Business logic
```

## API Reference

### Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/routes` | List all routes |
| POST | `/api/routes` | Create route |
| GET | `/api/routes/[id]` | Get route |
| PUT | `/api/routes/[id]` | Update route |
| DELETE | `/api/routes/[id]` | Delete route |

### Drivers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/drivers` | List all drivers |
| POST | `/api/drivers` | Create driver |
| GET | `/api/drivers/[id]` | Get driver |
| PUT | `/api/drivers/[id]` | Update driver |
| DELETE | `/api/drivers/[id]` | Delete driver |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/trips` | List trips (with filters) |
| POST | `/api/trips` | Create trip (auto-calculates earnings) |
| DELETE | `/api/trips/[id]` | Delete trip |

### Earnings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/earnings?period=weekly` | Get earnings summary |

### Settlements
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settlements` | List settlements |
| POST | `/api/settlements` | Create settlement |
| PUT | `/api/settlements/[id]` | Update status |
| DELETE | `/api/settlements/[id]` | Delete (pending only) |

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Set these in Vercel Dashboard > Settings > Environment Variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (optional)

## Earnings Logic

```
┌─────────────────────────────────────────────────────────┐
│                    Driver Preference                     │
├─────────────────┬───────────────────┬───────────────────┤
│   Batta Only    │   Salary Only     │      Split        │
├─────────────────┼───────────────────┼───────────────────┤
│ All → Batta     │ All → Salary      │ Route config      │
│ (Weekly settle) │ (Monthly settle)  │ defines split     │
└─────────────────┴───────────────────┴───────────────────┘
```

## License

MIT License - feel free to use for your projects.
# Twilight
