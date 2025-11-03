# Deployment Guide — Invoice Export

This guide provides step-by-step instructions for deploying the Invoice Export application to production.

## Prerequisites

Before you begin, ensure you have:

- [x] GitHub account with repository access
- [x] Vercel account ([signup](https://vercel.com/signup))
- [x] Neon PostgreSQL account ([signup](https://neon.tech))
- [x] Resend account for emails ([signup](https://resend.com))
- [x] SMTP credentials OR Resend API key

## 1. Database Setup (Neon)

### Create Database

1. Log in to [Neon Console](https://console.neon.tech)
2. Click **"New Project"**
3. Name: `invoice-export-production`
4. Region: Select closest to your users (e.g., `eu-central-1`)
5. Click **"Create Project"**

### Get Connection String

1. In your project dashboard, click **"Connection Details"**
2. Copy the **Connection String** (with pooling)
   ```
   postgres://[user]:[password]@[host]/[database]?sslmode=require&pgbouncer=true
   ```
3. Save this for later - you'll need it for Vercel

### Initialize Schema

After deployment, you'll run:
```bash
# Vercel will auto-run: prisma generate
# Then manually run seed:
npx prisma db seed
```

## 2. Email Setup (Resend)

### Option A: Resend (Recommended)

1. Log in to [Resend Dashboard](https://resend.com/dashboard)
2. Click **"API Keys"** → **"Create API Key"**
3. Name: `invoice-export-production`
4. Permissions: **Full Access**
5. Copy the API key (starts with `re_`)
6. Save for Vercel environment variables

### Option B: SMTP

If using custom SMTP (Gmail, SendGrid, etc.):
```
EMAIL_SERVER=smtp://username:password@smtp.provider.com:587
EMAIL_FROM=noreply@yourdomain.com
```

## 3. Vercel Deployment

### Connect Repository

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository**
4. Select `kostasuser01gr/InvoiceExport`
5. Click **"Import"**

### Configure Project

**Framework Preset**: Next.js  
**Root Directory**: `./`  
**Build Command**: `npm run build` (default)  
**Output Directory**: `.next` (default)

### Environment Variables

Click **"Environment Variables"** and add:

#### Database
```
DATABASE_URL=postgresql://[user]:[password]@[neon-host]/[db]?sslmode=require&pgbouncer=true
```

#### NextAuth
```
NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=[generate-using-openssl-rand-base64-32]
```

**Generate Secret**:
```bash
openssl rand -base64 32
```

#### Email
```
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVER=smtp://user:pass@smtp.host:587
```
(Use either RESEND_API_KEY or EMAIL_SERVER, not both)

#### Staff Access
```
ALLOWLISTED_STAFF_EMAIL=heraklion.airport@europcargreece.com
```

#### myDATA (Optional - Stub Mode)
```
MYDATA_BASE_URL=https://mydata-sandbox.gov.gr
MYDATA_USERNAME=your-username
MYDATA_PASSWORD=your-password
MYDATA_SUBSCRIPTION_KEY=your-key
```

#### Storage (Optional - for file uploads)
```
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Visit deployment URL

## 4. Post-Deployment Setup

### Seed Database

After first deployment, seed the database:

```bash
# Via Vercel CLI (install: npm i -g vercel)
vercel env pull .env.production.local
npm run db:seed

# OR manually via database client
# Connect to Neon and run SQL from prisma/seed.ts
```

This creates:
- ✅ Europcar tenant
- ✅ Goldcar tenant  
- ✅ Staff user with RBAC permissions

### Verify Deployment

1. **Home Page**: Visit `https://your-project.vercel.app`
   - Should show brand selector
   
2. **Intake Form**: `https://your-project.vercel.app/intake?brand=europcar`
   - Multi-step form should work
   
3. **Submit Test Intake**:
   - Fill out form
   - Submit
   - Check database for draft invoice
   
4. **Staff Dashboard**: `https://your-project.vercel.app/admin`
   - Sign in with allowlisted email
   - Should see dashboard

## 5. Domain Setup (Optional)

### Add Custom Domain

1. In Vercel project, go to **Settings** → **Domains**
2. Add domain: `invoices.yourcompany.com`
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to match custom domain

### DNS Configuration

**If using Vercel DNS**:
- Automatic setup

**If using external DNS**:
Add A record or CNAME:
```
CNAME: invoices → cname.vercel-dns.com
```

## 6. QR Code Generation

### Generate QR Codes for Counter

Use any QR generator with these URLs:

**Europcar**:
```
https://your-domain.com/intake?brand=europcar
```

**Goldcar**:
```
https://your-domain.com/intake?brand=goldcar
```

### Recommended QR Tools
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)
- Use library: `npm install qrcode && node -e "require('qrcode').toFile('europcar-qr.png', 'https://your-domain.com/intake?brand=europcar')"`

### Print Materials

1. Generate high-resolution QR codes (300 DPI minimum)
2. Create signage for rental counter
3. Include brand colors matching theme
4. Add text: "Scan to complete rental details"

## 7. Monitoring & Maintenance

### Vercel Analytics

1. Enable in Vercel project settings
2. Monitor:
   - Page views
   - Response times
   - Error rates

### Database Monitoring

1. Check Neon dashboard for:
   - Connection count
   - Query performance
   - Storage usage

### Logs

**View Logs**:
```bash
vercel logs [deployment-url]
```

**Or** in Vercel Dashboard → Deployments → [deployment] → Logs

## 8. Environment-Specific Deploys

### Preview Deployments

Every PR automatically creates a preview:
```
https://invoice-export-git-[branch]-[user].vercel.app
```

### Production Deployment

Push to `main` branch:
```bash
git push origin main
```

Auto-deploys to: `https://your-project.vercel.app`

## 9. Scaling Considerations

### Database

**Neon Free Tier**:
- 0.5 GB storage
- 3 GB data transfer

**Upgrade if needed**:
- Scale plan: $19/month (unlimited storage)
- Pro plan: Custom pricing

### Vercel

**Hobby Plan**: Free
- 100 GB bandwidth
- 1,000 builds/month

**Pro Plan**: $20/month
- 1 TB bandwidth
- Unlimited builds

## 10. Security Checklist

- [x] `NEXTAUTH_SECRET` is strong random string
- [x] Database credentials are secure
- [x] HTTPS enforced (automatic with Vercel)
- [x] Email allowlist configured
- [x] Environment variables not in code
- [x] API keys rotated regularly
- [x] Database backups enabled (Neon auto-backup)

## 11. Troubleshooting

### Build Failures

**Error**: Prisma generation failed
```bash
# Solution: Ensure DATABASE_URL is set in Vercel env vars
```

**Error**: Module not found
```bash
# Solution: Clear build cache
vercel --force
```

### Runtime Errors

**Error**: Database connection timeout
```bash
# Solution: Check Neon database is running
# Verify DATABASE_URL includes ?pgbouncer=true
```

**Error**: Email not sending
```bash
# Solution: Verify RESEND_API_KEY or EMAIL_SERVER
# Check Resend dashboard for API status
```

**Error**: Access denied to /admin
```bash
# Solution: Verify ALLOWLISTED_STAFF_EMAIL matches user email
# Re-run seed script if needed
```

## 12. Rollback Procedure

### Instant Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

### Via CLI
```bash
vercel rollback
```

## 13. Backup & Recovery

### Database Backup

**Neon automatic backups**: Daily (retained 7 days on Pro)

**Manual backup**:
```bash
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

### Application Code

Git repository serves as source of truth.

## 14. Support

### Get Help

- **Vercel**: [Vercel Support](https://vercel.com/support)
- **Neon**: [Neon Docs](https://neon.tech/docs)
- **Project Issues**: GitHub Issues

### Contact

Technical support: `heraklion.airport@europcargreece.com`

---

## Quick Reference

### Key URLs

| Environment | URL |
|-------------|-----|
| Production  | `https://your-project.vercel.app` |
| Preview     | `https://invoice-export-git-[branch].vercel.app` |
| Admin       | `/admin` |
| Europcar QR | `/intake?brand=europcar` |
| Goldcar QR  | `/intake?brand=goldcar` |

### Commands

```bash
# Deploy
git push origin main

# View logs
vercel logs

# Rollback
vercel rollback

# Seed database
npm run db:seed

# Check status
vercel ls
```

---

**Deployment completed!** 🎉

Your multi-tenant invoicing system is now live and ready for use.
