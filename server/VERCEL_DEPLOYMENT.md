# Vercel Deployment Guide

## Prerequisites

1. Install Vercel CLI: `npm install -g vercel`
2. Have a Vercel account and be logged in
3. Environment variables ready (see `.env.example`)

## Deployment Steps

### 1. Login to Vercel

```bash
vercel login
```

### 2. Configure Environment Variables

On Vercel Dashboard:

- Go to your project Settings → Environment Variables
- Add all required variables from `.env.example`:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `JWT_SECRET_KEY`
  - `PORT` (3000 recommended, Vercel will handle routing)
  - `HOST` (0.0.0.0)
  - `NODE_ENV` (production)
  - `TRUST_PROXY` (1)
  - `ALLOWED_ORIGINS` (your frontend URL)
  - `ARCJET_KEY` (if using Arcjet for security)
  - `ARCJET_MODE` (OFF, DRY_RUN, or LIVE)
  - `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` (for password resets)
  - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (if using image uploads)

### 3. Setup Database

Option A: PostgreSQL hosted service (Supabase, Railway, Render, etc.)

- Get your `DATABASE_URL` connection string
- Add it to Vercel environment variables

Option B: Prisma Data Platform

```bash
npx prisma db push --skip-generate
```

### 4. Deploy

```bash
# Initial setup and deployment
vercel --prod

# Or for preview deployment
vercel
```

### 5. Verify Deployment

- Check health endpoint: `https://your-project.vercel.app/api/health`
- View logs: `vercel logs`
- Check environment: `vercel env list`

## Important Notes

- **Build Output**: The `dist` folder is automatically generated from `src` during build
- **Prisma**: `prisma generate` runs automatically in the build process via `postinstall` script
- **Node Version**: Ensure Node.js version 18+ is used
- **Database Migrations**: Consider running migrations in a pre-deployment step or use `prisma db push`
- **File Uploads**: Cloudinary is configured for image uploads, ensure credentials are set

## Troubleshooting

### Build Failures

- Check `vercel logs` for detailed error messages
- Ensure all required environment variables are set
- Verify TypeScript compilation locally: `npm run build`
- Check for missing Prisma schema or migration issues

### Runtime Errors

- Review function logs in Vercel Dashboard
- Check database connectivity via health endpoint
- Verify JWT_SECRET_KEY and API keys are correct
- Ensure ALLOWED_ORIGINS includes your client URL

### Database Connection Issues

- Confirm `DATABASE_URL` is accessible from Vercel IPs
- Check IP whitelisting on your database
- Verify connection pool settings in Prisma schema
- Test connection locally before deploying

### Email/SMTP Issues

- Verify EMAIL_HOST, EMAIL_USER, EMAIL_PASS are correct
- Check if app passwords are required (Gmail requires these)
- Ensure SMTP port is correct (usually 587 for TLS)

## Local Testing Before Deploy

```bash
# Build locally
npm run build

# Test production build
NODE_ENV=production PORT=3000 node dist/server.js

# Test with your actual environment variables
# Create .env.local and source it before running the above
```

## Monitoring & Maintenance

After deployment:

- Monitor logs regularly: `vercel logs --follow`
- Set up error tracking with a tool like Sentry
- Monitor database query performance
- Keep dependencies updated: `npm outdated`
