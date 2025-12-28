# Invoice Export — Europcar × Goldcar

Multi-tenant invoicing system for car rental companies with two public QR code intakes, staff-only dashboard, PDF generation, and myDATA integration stub.

## 🚀 Features

### Multi-Tenant Support
- **Two brands**: Europcar (green theme) and Goldcar (yellow theme)
- Brand-aware styling, logos, and invoice numbering
- Separate tenant configurations with custom VAT settings

### Public Customer Intake
- Multi-step intake form accessible via QR codes
- Customer information collection (PII with consent)
- Contract and vehicle details
- Privacy and data usage consent
- Brand-themed UI with progress indicator

### Staff Dashboard
- **Strict RBAC**: Only allowlisted email (`heraklion.airport@europcargreece.com`)
- KPI overview (Drafts, Pending, Approved, Sent)
- Invoice management across both brands
- NextAuth authentication with email magic links

### Invoice Management
- Draft → Review → Approve → PDF → Email lifecycle
- Invoice verification page with QR code support
- myDATA stub integration (ready for AADE production)
- VAT calculation (24% default, configurable)

### PWA Ready
- Progressive Web App manifest
- Installable on mobile devices
- Offline-ready architecture (ready for service worker)

## 📋 Prerequisites

- **Node.js** 18+ 
- **PostgreSQL** database (Neon recommended)
- **npm** or **yarn**

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kostasuser01gr/InvoiceExport.git
cd InvoiceExport
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string"
EMAIL_SERVER="smtp://user:pass@smtp.host:587"
EMAIL_FROM="no-reply@yourdomain.com"
ALLOWLISTED_STAFF_EMAIL="heraklion.airport@europcargreece.com"

# Storage (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Email (Resend)
RESEND_API_KEY="re_your_resend_api_key"

# myDATA (stub for now)
MYDATA_BASE_URL="https://mydata-sandbox.gov.gr"
MYDATA_USERNAME="your-username"
MYDATA_PASSWORD="your-password"
MYDATA_SUBSCRIPTION_KEY="your-key"
```

### 4. Initialize Database

Push the Prisma schema to your database:

```bash
npm run db:push
```

### 5. Seed the Database

Create tenants and staff user:

```bash
npm run db:seed
```

This creates:
- ✅ Europcar tenant with prefix `ECP-`
- ✅ Goldcar tenant with prefix `GLD-`
- ✅ Staff user linked to both tenants

### 6. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

### Customer Intake Flow

1. Navigate to home page
2. Select Europcar or Goldcar brand
3. Complete the multi-step intake form:
   - Step 1: Customer Information
   - Step 2: Contract Details
   - Step 3: Vehicle Information
   - Step 4: Review & Consent
4. Submit to create draft invoice

**QR Code URLs:**
- Europcar: `https://your-domain.com/intake?brand=europcar`
- Goldcar: `https://your-domain.com/intake?brand=goldcar`

### Staff Dashboard

1. Navigate to `/admin`
2. Sign in with allowlisted email
3. Access dashboard with invoice queues
4. Review and manage invoices (coming soon: approve, PDF, email)

### Invoice Verification

Access public invoice verification page:
```
https://your-domain.com/invoice/{invoiceId}
```

## 📂 Project Structure

```
InvoiceExport/
├── app/
│   ├── admin/              # Staff dashboard (RBAC protected)
│   ├── api/
│   │   ├── auth/           # NextAuth endpoints
│   │   └── intake/         # Intake form API
│   ├── intake/             # Public intake form
│   ├── invoice/[id]/       # Invoice verification
│   └── page.tsx            # Home / Brand selector
├── components/
│   └── ui/                 # Shadcn/UI components
├── config/
│   └── tenants.ts          # Brand configurations
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── mydata.ts           # myDATA stub
│   ├── prisma.ts           # Database client
│   ├── qr.ts               # QR code generation
│   ├── utils.ts            # Utility functions
│   └── validators.ts       # Zod schemas
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed script
├── public/
│   └── manifest.json       # PWA manifest
└── types/
    └── next-auth.d.ts      # TypeScript definitions
```

## 🔐 Security & RBAC

### Authentication
- **NextAuth** with email (magic link)
- Session-based authentication
- Secure session cookies

### Authorization
- **Allowlist-based**: Only specific email has staff access
- **Tenant-scoped**: User-tenant relationships
- **Route protection**: Middleware on `/admin` routes
- **Database-level**: Role-based UserTenant model

### Allowlisted Staff Email
By default: `heraklion.airport@europcargreece.com`

To change, update `ALLOWLISTED_STAFF_EMAIL` in `.env`

## 🗄️ Database Schema

### Key Models

- **Tenant**: Brand configuration (Europcar, Goldcar)
- **User**: Staff users with email authentication
- **UserTenant**: M:N relationship with roles
- **Customer**: Rental customer details
- **Contract**: Rental contract information
- **Invoice**: Invoice with status lifecycle
- **InvoiceLine**: Line items for invoices

### Invoice Status Flow

```
DRAFT → REVIEW → APPROVED → SENT → (CANCELED)
```

## 🚀 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub repository

2. **Configure Environment Variables**
   - Add all variables from `.env.example`
   - Set `NEXTAUTH_URL` to your Vercel domain

3. **Set Up Database**
   - Create Neon PostgreSQL database
   - Copy connection string to `DATABASE_URL`

4. **Deploy**
   ```bash
   # Automatic on git push to main
   git push origin main
   ```

5. **Run Migrations**
   - Vercel will run `prisma generate` automatically
   - Manually run seed after first deploy:
   ```bash
   npx prisma db seed
   ```

### Database Provider: Neon

1. Create account at [neon.tech](https://neon.tech)
2. Create new project
3. Copy connection string
4. Add to Vercel environment variables

## 📱 PWA Setup

The app includes a basic PWA manifest at `/public/manifest.json`.

### To Enable Full PWA Features

1. Add service worker in `/public/sw.js`
2. Register service worker in app layout
3. Add offline functionality
4. Implement background sync for intake

### Current PWA Features
- ✅ Web app manifest
- ✅ Installable prompt
- ⏳ Service worker (ready to implement)
- ⏳ Offline mode (ready to implement)

## 🧪 Testing

### Unit Tests (Vitest)

```bash
npm test
```

### E2E Tests (Playwright)

```bash
npm run test:e2e
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## 📊 myDATA Integration

Currently **stubbed** for development. Returns mock MARK in development mode.

### To Enable Production myDATA

1. Get AADE credentials
2. Update `.env` with real credentials
3. Implement production API call in `lib/mydata.ts`
4. Test in AADE sandbox environment

### myDATA Flow

1. Invoice approved → Generate PDF
2. Send to AADE via API
3. Receive MARK (unique identifier)
4. Store MARK in `Invoice.mydataMark`
5. Embed MARK in PDF and email

## 📧 Email Configuration

### Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Get API key
3. Set `RESEND_API_KEY` in `.env`

### Alternative: SMTP

Use any SMTP provider (Gmail, SendGrid, etc.):

```env
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="no-reply@yourdomain.com"
```

## 🎨 Brand Customization

### Tenant Configuration

Edit `/config/tenants.ts` to customize:

- Colors (primary, secondary, accent)
- Logo URLs
- Invoice number prefixes
- VAT settings
- Company information

### Adding a New Brand

1. Add configuration to `TENANTS` object
2. Run seed script to create tenant in database
3. Add logo to `/public/logos/`
4. Update QR code generation

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Lint code
npm test             # Run unit tests
npm run test:e2e     # Run E2E tests
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

### Database Management

```bash
# View database in browser
npm run db:studio

# Create migration
npx prisma migrate dev --name description

# Reset database (⚠️ deletes all data)
npx prisma migrate reset
```

## 🐛 Troubleshooting

### Build Errors

**Font loading error**: Removed Google Fonts due to network restrictions. Uses system fonts.

**useSearchParams error**: All dynamic pages wrapped in Suspense boundary.

### Database Errors

**Connection refused**: Check `DATABASE_URL` is correct and database is running.

**Missing tables**: Run `npm run db:push` to create tables.

### Authentication Errors

**Email not sending**: Verify `EMAIL_SERVER` and `EMAIL_FROM` are configured.

**Access denied**: Ensure your email matches `ALLOWLISTED_STAFF_EMAIL`.

## 📝 License

This project is proprietary software for Europcar Greece and Goldcar Greece.

## 👥 Contributors

- "Konstantinos Foskolakis - Full Stack Developer

## 📞 Support

For issues or questions, contact: 

---

**Built with** Next.js 15 • TypeScript • Prisma • PostgreSQL • Tailwind CSS • NextAuth • Vercel
