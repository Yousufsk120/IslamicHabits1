# CNAME Setup Guide: Connecting Vercel with Cloudflare

This guide explains how to connect your Vercel deployment with Cloudflare DNS management using CNAME records.

## Prerequisites

- A Vercel account with your project deployed
- A Cloudflare account with your domain added
- Domain ownership verified in both services

## Step 1: Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel dashboard
3. Deploy the project (Vercel will provide a default `.vercel.app` URL)

## Step 2: Add Custom Domain in Vercel

1. Go to your project settings in Vercel dashboard
2. Navigate to "Domains" section
3. Add your custom domain (e.g., `yoursite.com` or `www.yoursite.com`)
4. Vercel will show you the required DNS records

## Step 3: Configure CNAME in Cloudflare

### For Subdomain (www.yoursite.com):

1. Login to Cloudflare dashboard
2. Select your domain
3. Go to DNS > Records
4. Add a CNAME record:
   - **Name**: `www`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: DNS only (gray cloud) - recommended for initial setup
   - **TTL**: Auto

### For Root Domain (yoursite.com):

1. Add a CNAME record:
   - **Name**: `@` (represents root domain)
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: DNS only (gray cloud)
   - **TTL**: Auto

## Step 4: Verify Connection

1. Wait for DNS propagation (usually 5-30 minutes)
2. Check your custom domain in browser
3. Verify SSL certificate is active
4. Test both www and non-www versions

## Step 5: Enable Cloudflare Proxy (Optional)

After verifying the connection works:

1. Return to Cloudflare DNS settings
2. Click on the orange cloud icon to enable proxy
3. This enables Cloudflare's CDN, security features, and performance optimizations

## Troubleshooting

### Common Issues:

1. **DNS Propagation Delay**: Wait up to 24 hours for full global propagation
2. **SSL Certificate Issues**: Ensure Cloudflare SSL/TLS encryption mode is set to "Full (strict)"
3. **Redirect Loops**: Check Cloudflare's "Always Use HTTPS" setting and Vercel's domain configuration

### Verification Commands:

```bash
# Check DNS resolution
nslookup yoursite.com
dig yoursite.com CNAME

# Check if site is accessible
curl -I https://yoursite.com
```

## Security Recommendations

1. Enable HTTPS in both Vercel and Cloudflare
2. Set up HTTP Strict Transport Security (HSTS)
3. Configure appropriate Cloudflare security rules
4. Enable Cloudflare's Bot Fight Mode if needed

## Performance Optimizations

1. Enable Cloudflare's Auto Minify for CSS, JS, HTML
2. Configure appropriate caching rules
3. Enable Brotli compression
4. Set up Cloudflare's Polish for image optimization

## Configuration Files

This repository includes:

- `vercel.json`: Vercel deployment configuration
- Proper build settings for Vite + React deployment
- SPA routing configuration for client-side navigation
