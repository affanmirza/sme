# SME Quick Screen

A FREE, local-first web application for SME (Small and Medium Enterprise) lead screening built with Next.js 14, TypeScript, and SQLite.

## Features

- **Mobile-first wizard interface** with one question per step and smooth animations
- **Decision engine** that automatically scores leads as RED/YELLOW/GREEN
- **Local-first** with SQLite database (no cloud dependencies)
- **CSV export** functionality for lead management
- **WhatsApp integration** for lead handoff to Relationship Managers
- **Responsive design** with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Database**: Prisma ORM with SQLite
- **Validation**: Zod
- **CSV Export**: PapaParse

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment

Copy the environment sample file and configure your settings:

```bash
cp env.sample .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="file:./dev.db"
ADMIN_EMAIL="admin@example.com"
```

### 3. Set Up Database

Run the database migrations and seed the initial admin user:

```bash
npx prisma migrate dev
node prisma/seed.js
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: If you encounter Turbopack errors, the application has been configured to use the standard Next.js dev server for better compatibility.

## Application Structure

### Pages

- `/form` - Lead screening wizard
- `/leads` - Admin dashboard for viewing/exporting leads
- `/lead/[id]` - Individual lead detail page

### Decision Engine

The application automatically scores leads based on business rules:

- **RED (Tidak Lolos Screen)**: Critical issues that prevent approval
- **YELLOW (Perlu Konfirmasi Lanjut)**: Issues requiring further review
- **GREEN (Siap Di-PAS)**: Ready for processing

### Lead Screening Fields

1. **Sektor Usaha** - Business sector classification
2. **Omzet Tahunan** - Annual revenue bracket
3. **Usia Perusahaan** - Company age
4. **Hubungan dengan Bank Mandiri** - Relationship with Bank Mandiri
5. **Kebutuhan Produk** - Product requirements
6. **Tenor** - Loan tenor (for applicable products)
7. **Dokumen Legal** - Legal documentation status
8. **Informasi Agunan** - Collateral information
9. **Bukti Value Chain** - Value chain evidence
10. **Informasi Kontak** - Contact details

## API Endpoints

### Leads
- `POST /api/leads` - Create new lead
- `GET /api/leads` - Get all leads
- `GET /api/leads/[id]` - Get specific lead
- `GET /api/leads/export` - Export leads as CSV

## Database Schema

### Lead Model
- `id` - Unique identifier
- `createdAt` - Creation timestamp
- `createdById` - Creator user ID
- `status` - Lead status (RED/YELLOW/GREEN)
- Form fields (sektor, omzetBracket, etc.)
- `reasons` - JSON array of decision reasons
- `checklist` - JSON array of required documents

## Development

### Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

### Building for Production

```bash
npm run build
npm start
```

## Security Features

- Input validation with Zod
- SQL injection protection via Prisma

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For support or questions, please create an issue in the repository.