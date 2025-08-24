# Cloudflare Pages Deployment Guide

This guide will help you connect your domain with Cloudflare and deploy the Islamic Habits app to Cloudflare Pages.

## Prerequisites

1. A Cloudflare account
2. Your domain registered and ready to be managed by Cloudflare
3. GitHub repository access

## Step 1: Set up Cloudflare Account

1. Sign up for a [Cloudflare account](https://dash.cloudflare.com/sign-up) if you don't have one
2. Add your domain to Cloudflare:
   - Click "Add site" in the Cloudflare dashboard
   - Enter your domain name
   - Choose a plan (Free plan is sufficient for most cases)
   - Cloudflare will scan your DNS records

## Step 2: Update Nameservers

1. Cloudflare will provide you with new nameservers
2. Update your domain registrar's nameserver settings to use Cloudflare's nameservers
3. Wait for DNS propagation (can take up to 24 hours)

## Step 3: Set up Cloudflare Pages

1. Go to Cloudflare Dashboard → Pages
2. Click "Create application" → "Connect to Git"
3. Connect your GitHub account and select this repository
4. Configure build settings:
   - **Project name**: `islamic-habits` (or your preferred name)
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)

## Step 4: Configure GitHub Secrets

For automated deployments, add these secrets to your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `CLOUDFLARE_API_TOKEN`: Your Cloudflare API token with Pages permissions
   - `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

### Getting Cloudflare API Token:
1. Go to Cloudflare Dashboard → My Profile → API Tokens
2. Click "Create Token"
3. Use "Custom token" template
4. Set permissions:
   - Zone: Zone.Read
   - Page: Edit
5. Include your account and zones
6. Copy the generated token

### Getting Account ID:
1. Go to Cloudflare Dashboard → right sidebar
2. Copy the Account ID

## Step 5: Custom Domain Setup

1. In Cloudflare Pages → your project → Custom domains
2. Click "Set up a custom domain"
3. Enter your domain name
4. Cloudflare will automatically create the necessary DNS records

## Step 6: DNS Configuration

Cloudflare will automatically configure DNS records for your Pages deployment:
- `A` record pointing to Cloudflare Pages
- `AAAA` record for IPv6 (if needed)
- `CNAME` record for www subdomain (optional)

## Optional: Advanced Configuration

### Wrangler CLI (Local Development)
This project includes Wrangler CLI for local Cloudflare development:

```bash
# Install dependencies (includes wrangler)
npm install

# Build the project first
npm run build

# Run local Cloudflare Pages simulation
npm run cf:dev

# Deploy manually (requires authentication)
npm run cf:deploy
```

### Environment Variables
Set environment variables in Cloudflare Pages settings if your app requires them.

### Functions
The `functions/` directory is set up for Cloudflare Workers/Pages Functions if you need serverless API endpoints.

### Preview Deployments
Every pull request will create a preview deployment automatically.

## Verification

1. Push changes to main branch
2. Check GitHub Actions for successful deployment
3. Visit your Cloudflare Pages URL
4. Once DNS propagates, visit your custom domain

Your app should be live on both the Cloudflare Pages URL and your custom domain!