# Manoj Kumar — Developer Portfolio + Admin CMS

A premium, fully responsive developer portfolio website with a complete admin dashboard CMS. All content is managed through Supabase — no source code editing required to update the portfolio.

## Features

### Public Website
- Dark modern developer theme with glassmorphism cards
- Animated particle background and gradient effects
- Hero section with animated typing text
- About section with animated statistics
- Skills section with progress bars and categories
- Education timeline
- Projects showcase with category filtering and featured badges
- Services cards
- Resume viewer and download
- Contact form (saves messages to Supabase)
- Professional footer with social links
- Fully responsive (320px to 1920px+)

### Admin Dashboard (`/admin`)
- Secure Supabase Authentication
- Protected admin routes (redirects to `/admin/login` if unauthorized)
- Dashboard with statistics overview
- Profile management (name, title, photo, contact info)
- About section editor with statistics
- Skills CRUD with icon picker, categories, and reordering
- Education CRUD with timeline reordering
- Projects CRUD with image upload, technologies, featured flag, reordering
- Services CRUD with icon picker
- Resume upload/replace/delete (PDF)
- Contact messages inbox with read/unread status
- Social links management
- Website settings (title, colors, SEO, footer text)
- Image upload to Supabase Storage with validation
- Confirmation dialogs for deletions

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- Supabase (database, auth, storage)
- React Router DOM

## Setup Guide

### 1. Prerequisites
- Node.js 18+
- A Supabase project (or use the pre-provisioned one)

### 2. Environment Variables
The project includes a pre-configured `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If setting up a new Supabase project:
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to Settings → API
3. Copy the Project URL and anon public key
4. Add them to your `.env` file

### 3. Database Setup
The database schema, RLS policies, storage bucket, and seed data are already created via migration. If setting up fresh, the migration SQL is in `supabase/migrations/`.

Tables created:
- `profiles` — personal info
- `about` — bio and statistics
- `skills` — technical skills
- `education` — education timeline
- `projects` — portfolio projects
- `services` — service offerings
- `messages` — contact form submissions
- `social_links` — social media links
- `website_settings` — site-wide config and SEO
- `resume` — resume file metadata

All tables have Row Level Security enabled:
- Public (anon) can read all portfolio content
- Public (anon) can insert messages (contact form)
- Only authenticated users can insert/update/delete

### 4. Create Admin Account
To access the admin dashboard, you need a Supabase Auth user:

1. Go to your Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Enter an email and password (e.g., password `MANOJ@2007`)
4. Disable "Email Confirm" (or confirm the email manually)
5. Use those credentials to log in at `/admin/login`

Alternatively, you can create the user programmatically via SQL:
```sql
-- This creates an auth user (run in Supabase SQL Editor)
-- Note: This is for initial setup only. Change the password after first login.
```

Or use the Supabase Dashboard UI which is the recommended approach.

### 5. Run Locally
```bash
npm install
npm run dev
```

The dev server starts automatically. Visit:
- `http://localhost:5173` — Public portfolio
- `http://localhost:5173/admin/login` — Admin login

### 6. Build for Production
```bash
npm run build
npm run preview
```

The production build is output to the `dist/` folder.

### 7. Deploy to Vercel
1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables in Vercel project settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy — Vercel auto-detects Vite and runs `npm run build`

## Admin Routes
| Route | Description |
|-------|-------------|
| `/admin/login` | Login page |
| `/admin` | Dashboard |
| `/admin/profile` | Profile management |
| `/admin/about` | About section |
| `/admin/skills` | Skills CRUD |
| `/admin/education` | Education CRUD |
| `/admin/projects` | Projects CRUD |
| `/admin/services` | Services CRUD |
| `/admin/resume` | Resume upload |
| `/admin/messages` | Contact messages |
| `/admin/social` | Social links |
| `/admin/settings` | Website settings & SEO |

## Security
- Supabase Auth handles password hashing and sessions
- Row Level Security on all tables
- No service-role keys in frontend code
- Protected admin routes redirect unauthorized users
- File upload validation (type and size)
- Storage bucket with public read, auth-only write
