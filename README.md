# SME Lead Assessment Application

A Next.js application for assessing SME (Small and Medium Enterprise) leads with a multi-step wizard form and decision engine.

## Features

- **Multi-step Form Wizard**: Interactive form with progress tracking
- **Decision Engine**: Automated lead scoring (RED/YELLOW/GREEN)
- **Lead Management**: View, filter, and export leads
- **Admin Dashboard**: Manage leads and view analytics
- **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: Prisma ORM with PostgreSQL
- **Deployment**: Vercel

## Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/affanmirza/sme.git
   cd sme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.sample .env.local
   # Edit .env.local with your values
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

## Production Deployment

This application is configured for deployment on Vercel with Vercel Postgres.

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string (provided by Vercel Postgres)
- `ADMIN_EMAIL`: Admin user email address
- `NODE_ENV`: Set to `production`

### Database Setup

The application uses Prisma with PostgreSQL in production. The database schema includes:

- **User**: Admin and staff accounts
- **Lead**: Lead assessment data with scoring

## API Endpoints

- `GET /api/leads` - List all leads
- `POST /api/leads` - Create new lead
- `GET /api/leads/[id]` - Get specific lead
- `GET /api/leads/export` - Export leads as CSV

## Pages

- `/` - Home page
- `/form` - Lead assessment form
- `/leads` - Lead management dashboard
- `/lead/[id]` - Individual lead details

## License

MIT