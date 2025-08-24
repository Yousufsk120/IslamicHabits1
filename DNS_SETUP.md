# DNS Configuration for Custom Domain

This file provides specific DNS record examples for connecting your custom domain to Cloudflare Pages.

## Automatic Configuration (Recommended)

When you add a custom domain in Cloudflare Pages dashboard, Cloudflare will automatically create the necessary DNS records.

## Manual DNS Configuration

If you need to configure DNS manually, use these record types:

### For Root Domain (example.com)
```
Type: A
Name: @
Content: [Cloudflare Pages IP - automatically provided]
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### For WWW Subdomain (www.example.com)
```
Type: CNAME
Name: www
Content: your-project.pages.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

### Additional Subdomains (optional)
```
Type: CNAME
Name: app (or any subdomain)
Content: your-project.pages.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

## Verification Commands

After setting up DNS, verify with these commands:

```bash
# Check A record for root domain
dig A your-domain.com

# Check CNAME for www
dig CNAME www.your-domain.com

# Check if site is reachable
curl -I https://your-domain.com
```

## Troubleshooting

- **DNS propagation**: Changes can take up to 24 hours to propagate globally
- **SSL certificates**: Cloudflare automatically provides SSL certificates for custom domains
- **Cache issues**: Use incognito mode or clear cache if you see old content

## Security Headers

Cloudflare Pages automatically includes security headers:
- HSTS (HTTP Strict Transport Security)
- X-Content-Type-Options
- X-Frame-Options
- Referrer-Policy