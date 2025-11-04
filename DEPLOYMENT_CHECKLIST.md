# ✅ Post-Generation Deployment Checklist

## 🎯 You're Ready to Deploy!

The monorepo transformation is complete. All 4 apps build successfully. Follow this checklist to deploy to Vercel.

---

## Quick Reference

**4 Apps to Deploy:**
1. `apps/europcar-intake` → Public invoice intake (Europcar)
2. `apps/europcar-admin` → Staff dashboard (Europcar)
3. `apps/goldcar-intake` → Public invoice intake (Goldcar)
4. `apps/goldcar-admin` → Staff dashboard (Goldcar)

**Each app requires:**
- Separate Vercel Project
- Same GitHub repository
- Root Directory set to respective `apps/` folder
- "Include source outside Root Directory" enabled

---

## 📝 Deployment Steps (Repeat 4x)

### For Each App:

1. **Create Vercel Project**
   - [ ] Go to https://vercel.com/new
   - [ ] Import from GitHub: `kostasuser01gr/InvoiceExport`

2. **Configure Project Settings**
   - [ ] Framework: Next.js
   - [ ] Root Directory: `apps/[app-name]`
   - [ ] **✅ CRITICAL**: Enable "Include source files outside of the Root Directory in the Build Step"

3. **Add Environment Variables**
   
   **All Apps Need:**
   - [ ] `DATABASE_URL`
   - [ ] `BRAND` (`europcar` or `goldcar`)
   - [ ] `PUBLIC_BASE_URL` (deployment URL, update later with custom domain)
   
   **Admin Apps Also Need:**
   - [ ] `NEXTAUTH_URL` (same as PUBLIC_BASE_URL)
   - [ ] `NEXTAUTH_SECRET` (generate: `openssl rand -base64 32`)
   - [ ] `ALLOWLIST` (comma-separated emails)
   - [ ] `EMAIL_SERVER` and `EMAIL_FROM` (or `RESEND_API_KEY`)

4. **Deploy**
   - [ ] Click "Deploy"
   - [ ] Wait for build to complete

5. **Optional: Custom Domain**
   - [ ] Settings → Domains
   - [ ] Add: `intake.europcar.yourdomain.com` (etc.)
   - [ ] Update `PUBLIC_BASE_URL` and `NEXTAUTH_URL` env vars

6. **Optional: Ignored Build Step**
   - [ ] Settings → Git → Ignored Build Step
   - [ ] Command: `bash scripts/ignored-build.sh apps/[app-name]`

---

## 🗄️ Database Setup

Before testing, set up your database:

```bash
# 1. Connect to your PostgreSQL database

# 2. Run this SQL to create sequences
CREATE SEQUENCE IF NOT EXISTS seq_invoice_ecp START 1;
CREATE SEQUENCE IF NOT EXISTS seq_invoice_gld START 1;

# 3. Run Prisma migrations (from packages/db/)
npx prisma migrate deploy

# 4. (Optional) Seed demo data
npx prisma db seed
```

---

## ✅ Testing Checklist

### Europcar Intake (`intake.europcar.yourdomain.com`)
- [ ] Page loads with green Europcar branding
- [ ] Can fill intake form
- [ ] Submission creates invoice with `ECP-` prefix
- [ ] QR code appears on verification page
- [ ] PDF generation works (`/api/invoices/[id]/pdf`)

### Europcar Admin (`admin.europcar.yourdomain.com`)
- [ ] Login page loads
- [ ] Magic link email arrives
- [ ] Only allowlisted emails can access
- [ ] Dashboard shows Europcar invoices only
- [ ] KPI cards display counts

### Goldcar Intake (`intake.goldcar.yourdomain.com`)
- [ ] Page loads with yellow Goldcar branding
- [ ] Intake form works
- [ ] Invoices get `GLD-` prefix
- [ ] QR and PDF work

### Goldcar Admin (`admin.goldcar.yourdomain.com`)
- [ ] Authentication works
- [ ] Only allowlisted emails can access
- [ ] Dashboard shows Goldcar invoices only
- [ ] Separate from Europcar data

---

## 📊 Environment Variables Reference

### Shared Variables (All 4 Apps)

```bash
DATABASE_URL="postgresql://user:password@host:5432/invoice_suite"
```

### Europcar Intake

```env
BRAND="europcar"
PUBLIC_BASE_URL="https://intake.europcar.yourdomain.com"
```

### Europcar Admin

```env
BRAND="europcar"
PUBLIC_BASE_URL="https://admin.europcar.yourdomain.com"
NEXTAUTH_URL="https://admin.europcar.yourdomain.com"
NEXTAUTH_SECRET="[generate: openssl rand -base64 32]"
ALLOWLIST="heraklion.airport@europcargreece.com"
EMAIL_SERVER="smtp://user:pass@smtp.host:587"
EMAIL_FROM="noreply@yourdomain.com"
```

### Goldcar Intake

```env
BRAND="goldcar"
PUBLIC_BASE_URL="https://intake.goldcar.yourdomain.com"
```

### Goldcar Admin

```env
BRAND="goldcar"
PUBLIC_BASE_URL="https://admin.goldcar.yourdomain.com"
NEXTAUTH_URL="https://admin.goldcar.yourdomain.com"
NEXTAUTH_SECRET="[generate different secret]"
ALLOWLIST="info@goldcar-greece.com"
EMAIL_SERVER="smtp://user:pass@smtp.host:587"
EMAIL_FROM="noreply@yourdomain.com"
```

---

## 🔧 Troubleshooting

**Build fails:**
- Ensure `DATABASE_URL` is set (can be dummy: `postgresql://dummy@localhost/dummy`)
- Check all packages listed in `transpilePackages` in `next.config.js`

**PDF generation fails:**
- Puppeteer needs Chrome on Vercel (auto-installed in most regions)
- May need to increase function timeout

**Auth doesn't work:**
- Verify `NEXTAUTH_URL` matches actual domain
- Check `NEXTAUTH_SECRET` is set
- Test email delivery

---

## 📚 Documentation

- **Full Documentation**: See `README.md`
- **Deployment Details**: See `DEPLOYMENT.md.old` (original detailed guide)
- **Architecture**: See monorepo structure in README

---

## 🎉 Success!

Once all 4 apps are deployed and tested:

✅ Independent deployments per brand
✅ Shared codebase reduces duplication  
✅ Brand-specific invoice numbering working
✅ QR verification functional
✅ PDF generation operational
✅ Admin access control enforced

**Next**: Integrate myDATA when ready by adding real credentials to env vars.

---

**Questions?** Check README.md or contact: heraklion.airport@europcargreece.com
