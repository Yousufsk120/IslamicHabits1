# Vercel Domain Configuration

To set up your custom domain with CNAME records:

1. **Add Domain in Vercel Dashboard:**
   - Go to Project Settings > Domains
   - Add your domain (e.g., example.com)
   - Vercel will show DNS instructions

2. **Cloudflare DNS Records:**

   ```
   Type: CNAME
   Name: @ (for root domain) or www (for subdomain)
   Target: cname.vercel-dns.com
   Proxy: DNS only (gray cloud) initially
   ```

3. **Verify Setup:**
   - Check domain propagation
   - Enable SSL certificate
   - Test both www and non-www versions

4. **Optional: Enable Cloudflare Proxy**
   - After verification, enable orange cloud for CDN benefits

See [CNAME_SETUP.md](../CNAME_SETUP.md) for complete instructions.
