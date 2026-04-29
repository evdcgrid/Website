SPA routing and domain redirect examples

Problem summary
- A Single Page App (SPA) using client-side routing will load `index.html` and then the JS router shows `/simulation`.
- If the server/host is not configured to return `index.html` for unknown paths, a direct request to `/simulation` returns 404.
- Also make sure both `www` and apex domain are configured on your host — if one is missing it will 404.

Quick fixes

1) Netlify / Static hosts that support `_redirects`

Add `public/_redirects` with:

  /*    /index.html   200

This makes every request return `index.html` (status 200) so the client router can handle the path.

2) Vercel

Vercel usually handles SPA routing automatically, but ensure both domains (`evdcgrid.pt` and `www.evdcgrid.pt`) are added in Project Settings and set a redirect domain.

Vercel recommended setup (project-level)

- Add both `evdcgrid.pt` and `www.evdcgrid.pt` in your Vercel Project > Domains.
- Set `evdcgrid.pt` as the Primary Domain in the Vercel dashboard (this will make Vercel redirect `www` → primary automatically).
- If you prefer to enforce redirects via config, add a `vercel.json` to the repo with the following content (this project includes an example file):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "redirects": [
    {
      "source": "/:path*",
      "has": [ { "type": "host", "value": "www.evdcgrid.pt" } ],
      "destination": "https://evdcgrid.pt/:path*",
      "permanent": true
    }
  ]
}
```

Notes:
- After adding a custom domain in Vercel, follow the DNS instructions they show. For the apex domain they typically ask you to add A/AAAA records; for `www` they usually accept a CNAME to `cname.vercel-dns.com`.
- Once the domain is verified in Vercel and set as Primary, direct navigation to client-side routes (e.g. `/simulation`) will work because Vercel will serve `index.html` and the router will render the route.

3) Nginx example

server {
  listen 80;
  server_name www.evdcgrid.pt evdcgrid.pt;

  # Optionally redirect www -> non-www
  # if ($host = 'www.evdcgrid.pt') {
  #   return 301 https://evdcgrid.pt$request_uri;
  # }

  root /var/www/evdcgrid/dist; # adjust to your build output

  location / {
    try_files $uri $uri/ /index.html;
  }

  location ~* \.(?:ico|css|js|jpg|jpeg|png|svg|gif|webp)$ {
    expires 30d;
    add_header Cache-Control "public";
  }
}

4) Apache example (Enable `mod_rewrite`)

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  # Redirect www to apex (optional)
  # RewriteCond %{HTTP_HOST} ^www\.evdcgrid\.pt$ [NC]
  # RewriteRule ^(.*)$ https://evdcgrid.pt/$1 [L,R=301]

  # Serve index.html for non-file requests
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ /index.html [L]
</IfModule>

5) S3 + CloudFront (static hosting)

- Configure CloudFront to use `index.html` as the default root object.
- Set an Origin Response / Error Pages so 403/404 return `index.html` with HTTP 200 (custom error response).

What to check now
- Confirm whether `https://evdcgrid.pt/simulation` and `https://www.evdcgrid.pt/simulation` behave differently.
- If only the `www` host fails, add a DNS/host redirect from `www` to `evdcgrid.pt` (or vice-versa) and ensure the domain is configured in your hosting provider.

If you tell me where you host the site (Netlify, Vercel, Nginx, Apache, S3/CloudFront, Cloudflare Pages, etc.), I can add the exact configuration or push the `_redirects` and a small CI-friendly script.
