# 🚀 API Master - Deployment Guide

## Overview

This guide covers deploying API Master to production environments.

## Prerequisites

- Docker & Docker Compose (recommended)
- Node.js 18+ & npm 9+
- PostgreSQL 14+
- Domain name with SSL certificate
- Cloud hosting (AWS, DigitalOcean, Heroku, etc.)

## Production Environment Variables

### Backend (.env)

```bash
# Server
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database (PostgreSQL)
DB_HOST=your-db-host.com
DB_PORT=5432
DB_NAME=api_master_prod
DB_USER=api_master_user
DB_PASSWORD=your-secure-password-here
DB_POOL_MAX=20
DB_POOL_MIN=5

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

# Encryption (AES-256)
ENCRYPTION_KEY=your-32-character-encryption-key-here
ENCRYPTION_IV=your-16-char-iv

# Stripe
STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live

# Email (SMTP)
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_email@domain.com
SMTP_PASSWORD=your_email_password
FROM_EMAIL=noreply@apimaster.com
FROM_NAME=API Master

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12

# Frontend URL
FRONTEND_URL=https://app.apimaster.com

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
```

### Frontend (.env)

```bash
VITE_API_URL=https://api.apimaster.com/api
VITE_SOCKET_URL=https://api.apimaster.com
VITE_APP_ENV=production
```

## Deployment Options

### Option 1: Docker Compose (Recommended)

1. **Create docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: api_master_prod
      POSTGRES_USER: api_master_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - ./backend/.env
    depends_on:
      - postgres
    restart: always

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

2. **Deploy**

```bash
docker-compose up -d
```

### Option 2: Manual Deployment

#### Backend

```bash
cd backend
npm install --production
npm run migrate
npm start
```

#### Frontend

```bash
cd frontend
npm install
npm run build
# Serve dist/ with nginx or similar
```

### Option 3: Cloud Platforms

#### Heroku

```bash
# Backend
heroku create api-master-backend
heroku addons:create heroku-postgresql:hobby-dev
git subtree push --prefix backend heroku main

# Frontend
heroku create api-master-frontend
heroku buildpacks:set heroku/nodejs
git subtree push --prefix frontend heroku main
```

#### Vercel (Frontend)

```bash
cd frontend
vercel --prod
```

#### DigitalOcean App Platform

Use the web interface to deploy from GitHub repository.

## Database Migration

```bash
cd backend
npm run migrate
```

## SSL Certificate Setup

### Using Let's Encrypt (Certbot)

```bash
sudo certbot --nginx -d apimaster.com -d www.apimaster.com
```

### Using Cloudflare (Recommended)

1. Add domain to Cloudflare
2. Enable SSL/TLS (Full or Full Strict)
3. Update DNS records
4. Enable Always Use HTTPS

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name apimaster.com www.apimaster.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name apimaster.com www.apimaster.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /var/www/api-master/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Monitoring & Logging

### PM2 (Process Manager)

```bash
npm install -g pm2

# Start backend
cd backend
pm2 start src/server.js --name api-master-backend

# Save configuration
pm2 save
pm2 startup
```

### Log Aggregation

Use services like:
- Papertrail
- Loggly
- Datadog
- New Relic

## Backup Strategy

### Database Backups

```bash
# Automated daily backup
0 2 * * * pg_dump -U api_master_user api_master_prod | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

### File Backups

```bash
# Backup uploads directory
0 3 * * * tar -czf /backups/uploads_$(date +\%Y\%m\%d).tar.gz /app/uploads
```

## Performance Optimization

### Backend
- Enable compression
- Use Redis for caching
- Implement CDN for static assets
- Database query optimization
- Connection pooling

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- CDN for assets
- Browser caching

## Security Checklist

- [ ] All environment variables secured
- [ ] Database password strong and unique
- [ ] JWT secret is random and long (32+ characters)
- [ ] Encryption keys are properly generated
- [ ] SSL/TLS enabled and enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Database backups automated
- [ ] Monitoring and alerting set up

## Health Checks

```bash
# Backend health check
curl https://api.apimaster.com/health

# Expected response
{"success":true,"message":"API Master Backend is running"}
```

## Scaling

### Horizontal Scaling
- Load balancer (AWS ALB, Nginx)
- Multiple backend instances
- Shared Redis session store
- Database read replicas

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Enable caching

## Troubleshooting

### Common Issues

**Database connection fails:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U api_master_user -h localhost api_master_prod
```

**Port already in use:**
```bash
# Find process
sudo lsof -i :5000
# Kill process
sudo kill -9 <PID>
```

**Environment variables not loading:**
```bash
# Ensure .env file exists
ls -la backend/.env

# Check file permissions
chmod 600 backend/.env
```

## Updates & Maintenance

### Zero-Downtime Deployment

```bash
# Using PM2
cd backend
git pull
npm install --production
pm2 reload api-master-backend
```

### Database Migrations

```bash
# Create migration
npm run migrate:create migration_name

# Run migrations
npm run migrate

# Rollback if needed
npm run migrate:undo
```

## Support

For deployment issues, contact:
- Email: devops@apimaster.com
- Discord: [API Master DevOps](https://discord.gg/apimaster)
- Documentation: [docs.apimaster.com/deployment](https://docs.apimaster.com/deployment)

---

**Remember:** Always test in staging environment before deploying to production!
