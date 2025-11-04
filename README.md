# Invoice Suite — Turborepo Monorepo

Production-ready **Turborepo monorepo** hosting **four independent Next.js apps** for Europcar and Goldcar Greece invoice management. Each app is deployed as a **separate Vercel Project** from the same GitHub repository.

## 🏗️ Architecture

```
invoice-suite/
├─ apps/
│  ├─ europcar-intake/       # Public invoice intake (Europcar only)
│  ├─ europcar-admin/        # Staff dashboard (Europcar only)
│  ├─ goldcar-intake/        # Public invoice intake (Goldcar only)
│  └─ goldcar-admin/         # Staff dashboard (Goldcar only)
├─ packages/
│  ├─ ui/                    # shadcn/ui components, forms, tables, toasts
│  ├─ config/                # brand tokens & configs (logos, colors, VAT rules)
│  ├─ db/                    # Prisma schema, client, repository layer
│  ├─ auth/                  # Auth.js (NextAuth) config, middleware, RBAC helpers
│  ├─ pdf/                   # Puppeteer helpers + HTML/React invoice templates
│  ├─ email/                 # email sender (e.g., Resend) + templates
│  ├─ mydata/                # AADE myDATA typed client (sandbox‑ready)
│  └─ utils/                 # zod schemas, money/date, QR utils, error helpers
├─ turbo.json
├─ pnpm-workspace.yaml
├─ package.json
└─ .github/workflows/ci.yml
```

### Tech Stack

- **Next.js 15+ App Router** for all apps
- **pnpm** workspaces
- **Turborepo** pipelines (build, dev, lint, test, typecheck)
- **TypeScript**, **ESLint + Prettier**
- **PostgreSQL + Prisma** with brand-specific sequences
- **Auth.js (NextAuth)** with email magic links
- **Puppeteer** for pixel-perfect PDF generation
- **Resend** for email delivery
- **myDATA (AADE)** client scaffold

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **pnpm** 9+
- **PostgreSQL** database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kostasuser01gr/InvoiceExport.git
   cd InvoiceExport
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy root .env.example
   cp .env.example .env

   # Copy per-app .env.example files
   cp apps/europcar-intake/.env.example apps/europcar-intake/.env
   cp apps/europcar-admin/.env.example apps/europcar-admin/.env
   cp apps/goldcar-intake/.env.example apps/goldcar-intake/.env
   cp apps/goldcar-admin/.env.example apps/goldcar-admin/.env
   ```

4. **Configure environment variables**
   
   Edit `.env` and per-app `.env` files with your values. See **Environment Variables** section below.

5. **Set up database**
   ```bash
   # Generate Prisma Client
   cd packages/db
   pnpm db:generate

   # Push schema to database
   pnpm db:push

   # Seed demo data
   pnpm db:seed
   ```

6. **Run development servers**
   ```bash
   # Run all apps concurrently
   pnpm dev

   # Or run individual apps
   pnpm dev:europcar-intake   # http://localhost:3001
   pnpm dev:europcar-admin    # http://localhost:3002
   pnpm dev:goldcar-intake    # http://localhost:3003
   pnpm dev:goldcar-admin     # http://localhost:3004
   ```

## 📋 Environment Variables

### Root `.env` (Shared)

```bash
# Database (shared)
DATABASE_URL="postgresql://user:password@host:5432/invoice_suite"

# Email (shared)
EMAIL_SERVER="smtp://user:pass@smtp.host:587"
EMAIL_FROM="noreply@yourdomain.com"
RESEND_API_KEY=""

# myDATA (AADE)
MYDATA_ENV="SANDBOX"  # or "PRODUCTION"
MYDATA_USERNAME=""
MYDATA_SUBSCRIPTION_KEY=""
MYDATA_VAT_NUMBER=""

# Logging
LOG_LEVEL="info"
```

### Per-App `.env` Files

Each app in `apps/*/` has its own `.env.example` file. Key variables:

| Variable | Intake Apps | Admin Apps | Description |
|----------|-------------|------------|-------------|
| `BRAND` | ✅ | ✅ | `"europcar"` or `"goldcar"` (hardcoded per app) |
| `PUBLIC_BASE_URL` | ✅ | ✅ | Public URL for QR codes and links |
| `NEXTAUTH_URL` | ❌ | ✅ | Full URL of the admin app |
| `NEXTAUTH_SECRET` | ❌ | ✅ | Secret for JWT signing (generate with `openssl rand -base64 32`) |
| `ALLOWLIST` | ❌ | ✅ | Comma-separated list of allowlisted staff emails |

**Example for `apps/europcar-admin/.env`:**

```bash
BRAND="europcar"
NEXTAUTH_URL="https://admin.europcar.yourdomain.com"
NEXTAUTH_SECRET="your_generated_secret"
ALLOWLIST="heraklion.airport@europcargreece.com,admin@yourdomain.com"
PUBLIC_BASE_URL="https://admin.europcar.yourdomain.com"
```

## 🗄️ Database Schema

### Brand-Specific Invoice Numbering

Each brand has its own PostgreSQL sequence:

- **Europcar**: `seq_invoice_ecp` → Invoice numbers like `ECP-2025-0001`
- **Goldcar**: `seq_invoice_gld` → Invoice numbers like `GLD-2025-0001`

The `allocateNextNumber()` function in `packages/db/src/repositories/invoices.ts` allocates the next number atomically using `nextval()`.

### Key Models

- **Invoice**: Main invoice entity with brand enum, status, amounts, myDATA mark
- **User**, **Account**, **Session**, **VerificationToken**: NextAuth models

## 🔐 Authentication & Authorization

### Intake Apps

- **No authentication required** (public access)
- Customers submit invoices directly

### Admin Apps

- **Email magic link authentication** (NextAuth)
- **Allowlist-based RBAC** via middleware
- Only emails in `ALLOWLIST` env variable can access
- Middleware checks on every request (except auth routes)

## 📄 PDF Generation

Uses **Puppeteer** to render invoice pages as pixel-perfect PDFs.

Each app exposes:
- `/verify/[id]` — Public invoice verification page
- `/api/invoices/[id]/pdf` — PDF generation endpoint

PDF generation:
1. Renders the `/verify/[id]` page in headless browser
2. Uses `emulateMediaType('screen')` and `printBackground: true`
3. Exports as A4 PDF with brand colors intact

## 🔍 QR Codes

Each invoice has a QR code that links to its verification page:

```
https://intake.europcar.yourdomain.com/verify/cuid123
```

QR codes are generated using the `qrcode` library in `packages/utils/src/qr.ts`.

## 📧 Email Delivery

Uses **Resend** API (or SMTP fallback) to send invoices.

Configured in `packages/email/src/index.ts`.

## 🇬🇷 myDATA (AADE) Integration

Scaffold implementation for Greek Tax Authority integration.

**Environments:**
- `MYDATA_ENV="SANDBOX"` — Test environment
- `MYDATA_ENV="PRODUCTION"` — Live environment

**Client:** `packages/mydata/src/index.ts`

**Admin actions:** Approve → PDF → Email → Send to myDATA (stubbed with mock responses when `MYDATA_SUBSCRIPTION_KEY` is not set)

## 🚢 Deployment (Vercel Multi-Project)

### Overview

Deploy **4 separate Vercel Projects** from the **same GitHub repository**. Each project builds only its app using Vercel's "Root Directory" feature.

### Step-by-Step Instructions

#### For Each App (4 times):

1. **Import Project**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your GitHub repository: `kostasuser01gr/InvoiceExport`
   - Click "Import"

2. **Configure Root Directory**
   - **Framework Preset**: Next.js
   - **Root Directory**: Set to one of:
     - `apps/europcar-intake`
     - `apps/europcar-admin`
     - `apps/goldcar-intake`
     - `apps/goldcar-admin`
   - **✅ IMPORTANT**: Enable **"Include source files outside of the Root Directory in the Build Step"**
     - This allows access to `packages/*` shared code

3. **Environment Variables**
   - Add variables from the app's `.env.example` file
   - **Critical variables**:
     - `DATABASE_URL` (shared database)
     - `BRAND` (e.g., `"europcar"`)
     - `PUBLIC_BASE_URL` (app's public URL)
     - For admin apps:
       - `NEXTAUTH_URL`
       - `NEXTAUTH_SECRET`
       - `ALLOWLIST`
       - `EMAIL_SERVER`
       - `EMAIL_FROM`

4. **Domain Configuration**
   - Map a domain or subdomain:
     - `intake.europcar.yourdomain.com` → europcar-intake
     - `admin.europcar.yourdomain.com` → europcar-admin
     - `intake.goldcar.yourdomain.com` → goldcar-intake
     - `admin.goldcar.yourdomain.com` → goldcar-admin

5. **Ignored Build Step** (Optional but Recommended)
   - **Settings** → **Git** → **Ignored Build Step**
   - Set command:
     ```bash
     bash scripts/ignored-build.sh apps/europcar-intake
     ```
   - Replace `apps/europcar-intake` with the current app's path
   - This skips builds when only unrelated code changes

6. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app

#### Post-Deployment Checklist

- [ ] Run database migrations if needed
- [ ] Test intake form submission
- [ ] Test PDF generation endpoint
- [ ] Test QR code verification
- [ ] Test admin authentication (magic link)
- [ ] Test admin dashboard access control
- [ ] Verify allowlist enforcement

### Vercel Ignored Build Step

The `scripts/ignored-build.sh` script prevents unnecessary builds.

**How it works:**
1. Checks which files changed in the commit
2. If only unrelated apps or packages changed, returns exit code 0 (skip build)
3. If the current app or its dependencies changed, returns exit code 1 (proceed with build)

**Per-Project Configuration:**

| Project | Ignored Build Command |
|---------|----------------------|
| europcar-intake | `bash scripts/ignored-build.sh apps/europcar-intake` |
| europcar-admin | `bash scripts/ignored-build.sh apps/europcar-admin` |
| goldcar-intake | `bash scripts/ignored-build.sh apps/goldcar-intake` |
| goldcar-admin | `bash scripts/ignored-build.sh apps/goldcar-admin` |

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm dev                      # Run all apps concurrently
pnpm dev:europcar-intake      # Run only europcar-intake
pnpm dev:europcar-admin       # Run only europcar-admin
pnpm dev:goldcar-intake       # Run only goldcar-intake
pnpm dev:goldcar-admin        # Run only goldcar-admin

# Building
pnpm build                    # Build all apps and packages
pnpm build --filter=europcar-intake  # Build specific app

# Linting & Type Checking
pnpm lint                     # Lint all apps
pnpm typecheck                # Type check all apps

# Database
pnpm db:generate              # Generate Prisma Client
pnpm db:push                  # Push schema to database

# Formatting
pnpm format                   # Format all files with Prettier

# Cleanup
pnpm clean                    # Clean build outputs and node_modules
```

### Turborepo Caching

Turborepo caches build outputs to speed up subsequent builds.

**Cache locations:**
- Local: `.turbo/`
- Remote: Configure Vercel Remote Cache for team-wide caching

## 📦 Package Structure

### Shared Packages

All packages are in `packages/` and use the `@invoice-suite/*` namespace:

| Package | Description |
|---------|-------------|
| `@invoice-suite/config` | Brand tokens, logos, colors, VAT settings |
| `@invoice-suite/db` | Prisma schema, client, repositories |
| `@invoice-suite/auth` | NextAuth config, RBAC guards |
| `@invoice-suite/ui` | Shared UI components (Button, Card, etc.) |
| `@invoice-suite/utils` | Zod schemas, formatters, QR helpers |
| `@invoice-suite/pdf` | Puppeteer PDF generation |
| `@invoice-suite/email` | Email sending via Resend |
| `@invoice-suite/mydata` | myDATA (AADE) API client |

### Adding Dependencies to Packages

```bash
# Add dependency to specific package
pnpm add --filter @invoice-suite/db prisma

# Add devDependency to all packages
pnpm add -D --filter "./packages/*" typescript
```

## 🧪 Testing

### Unit Tests

```bash
pnpm test
```

### E2E Tests

```bash
pnpm test:e2e
```

## 🔒 Security Best Practices

1. **Never commit secrets** — Use `.env` files (gitignored)
2. **Server-only env vars** — Keep sensitive vars server-side (NextAuth, DB, API keys)
3. **Allowlist enforcement** — Admin apps check allowlist in middleware AND server actions
4. **JWT secrets** — Generate strong `NEXTAUTH_SECRET` values
5. **Database credentials** — Use connection pooling and SSL
6. **CORS** — API routes are same-origin by default (no CORS needed)

## 📝 Release Process

### Development

1. Create feature branch from `main`
2. Make changes
3. Push to GitHub
4. Vercel creates **Preview Deployment** for each app automatically
5. Review previews
6. Merge PR to `main`

### Production

1. Merge to `main` triggers **Production Deployment** for all changed apps
2. Vercel's ignored build step skips unchanged apps
3. Each app rolls out independently

### Rollback

To rollback a specific app:

1. Go to Vercel Dashboard → Project → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

## 🐛 Troubleshooting

### Build Errors

**"Cannot find module '@invoice-suite/...'**
- Ensure `transpilePackages` is configured in `next.config.js`
- Run `pnpm install` to link workspaces

**Prisma Client errors**
- Run `pnpm db:generate` in `packages/db/`
- Ensure `DATABASE_URL` is set

### Runtime Errors

**"Access denied: not allowlisted"** (Admin apps)
- Check `ALLOWLIST` env variable includes your email
- Email must match exactly (case-insensitive)

**PDF generation fails**
- Ensure Puppeteer dependencies are installed on Vercel
- Check `PUBLIC_BASE_URL` is correct
- Verify `/verify/[id]` page renders correctly

**QR code not working**
- Check `PUBLIC_BASE_URL` env variable
- Ensure invoice exists in database

### Database Issues

**Connection refused**
- Verify `DATABASE_URL` is correct
- Check database is accessible from your network
- Use connection pooling for production

**Sequences out of sync**
- Reset sequences if needed:
  ```sql
  SELECT setval('seq_invoice_ecp', (SELECT MAX(id) FROM "Invoice" WHERE brand = 'EUROPCAR'));
  SELECT setval('seq_invoice_gld', (SELECT MAX(id) FROM "Invoice" WHERE brand = 'GOLDCAR'));
  ```

## 📞 Support

For issues or questions:
- **Email**: heraklion.airport@europcargreece.com
- **GitHub Issues**: [Create an issue](https://github.com/kostasuser01gr/InvoiceExport/issues)

## 📄 License

Proprietary software for Europcar Greece and Goldcar Greece.

---

**Built with** Next.js 15 • TypeScript • Prisma • PostgreSQL • Turborepo • Vercel
