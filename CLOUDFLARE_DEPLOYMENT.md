# Cloudflare Pages Deployment Guide for islamic-habits.com

This guide will help you deploy your Islamic Habits app to the domain `islamic-habits.com` using Cloudflare Pages.

## Prerequisites
1. A Cloudflare account
2. Access to the domain `islamic-habits.com` in your Cloudflare account
3. GitHub repository access

## Step 1: Set up Cloudflare Pages

1. **Login to Cloudflare**: Go to [dash.cloudflare.com](https://dash.cloudflare.com)

2. **Navigate to Pages**: Click on "Pages" in the sidebar

3. **Connect to GitHub**: 
   - Click "Connect to Git"
   - Select "GitHub" and authorize Cloudflare
   - Select your repository: `Yousufsk120/IslamicHabits1`

4. **Configure Build Settings**:
   ```
   Build command: npm run build
   Build output directory: dist
   Root directory: /
   Node.js version: 20
   ```

5. **Environment Variables**: None required for basic setup

## Step 2: Set up Custom Domain

1. **Add Custom Domain**:
   - In your Cloudflare Pages project dashboard
   - Go to "Custom domains" tab
   - Click "Set up a custom domain"
   - Enter: `islamic-habits.com`

2. **DNS Configuration**:
   - Go to your domain's DNS settings in Cloudflare
   - Add a CNAME record:
     ```
     Type: CNAME
     Name: @
     Target: [your-pages-project].pages.dev
     ```
   - For www subdomain, add another CNAME:
     ```
     Type: CNAME
     Name: www
     Target: islamic-habits.com
     ```

## Step 3: Set up Automatic Deployments (Optional)

If you want GitHub Actions to handle deployments:

1. **Get Cloudflare API Token**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create token with "Cloudflare Pages:Edit" permissions

2. **Get Account ID**:
   - Go to your Cloudflare dashboard
   - Copy the Account ID from the right sidebar

3. **Add GitHub Secrets**:
   - Go to your GitHub repository
   - Settings → Secrets and variables → Actions
   - Add these secrets:
     ```
     CLOUDFLARE_API_TOKEN: [your-api-token]
     CLOUDFLARE_ACCOUNT_ID: [your-account-id]
     ```

## Step 4: Build Settings

Your project is configured with these build settings:

**package.json scripts**:
- `npm run build` - Builds the production app
- `npm run preview` - Preview the built app locally

**Output**: The built files will be in the `dist/` directory

## Step 5: Deploy

### Method 1: Automatic (via Cloudflare Pages Git integration)
- Push changes to the `main` branch
- Cloudflare Pages will automatically build and deploy

### Method 2: Manual (via GitHub Actions)
- The workflow in `.github/workflows/deploy.yml` will handle deployment
- Triggered on push to `main` branch

## Verification

1. Visit `https://islamic-habits.com` to see your deployed app
2. Check that the site loads properly
3. Verify SSL certificate is working (https://)
4. Test that all pages and assets load correctly

## Troubleshooting

**Build fails**: Check the build logs in Cloudflare Pages dashboard
**Domain not working**: Verify DNS records and wait for propagation (up to 24 hours)
**SSL issues**: Ensure SSL/TLS is set to "Full" or "Full (strict)" in Cloudflare

## Performance Optimizations

Your app includes:
- ✅ Production build with Vite
- ✅ CSS minification with Tailwind
- ✅ Asset optimization
- ✅ SPA routing with `_redirects` file
- ✅ SEO meta tags and sitemap
- ✅ Robots.txt for search engines

## Support

For issues:
1. Check Cloudflare Pages logs
2. Verify build process works locally with `npm run build`
3. Check GitHub Actions logs if using automated deployment