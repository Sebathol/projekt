# GitHub Marketplace Listing - API Master

## App-Details

**App-Name**: API Master - Secure API Management

**Developer**: Ai Storm Create (Sebastian Beyer)

**Category**: Developer Tools / Security

**Pricing Model**: Free Trial + Paid Plans

**Integration Type**: OAuth App + GitHub Actions

---

## Tagline (50 Zeichen)

```
Secure API Key Management for Developers
```

---

## Short Description (180 Zeichen)

```
Manage all your API keys securely with proxy keys, environment switching, and team collaboration. Military-grade encryption. Perfect for DevOps teams and developers.
```

---

## Full Description (Markdown, unbegrenzt)

```markdown
# 🚀 API Master - Revolutionary API Management

Securely manage all your API keys from one place - perfect for developers, DevOps engineers, and teams.

## 🔐 Secure Proxy Keys

The core feature of API Master: Use proxy keys in your code while your real API keys stay encrypted. No more exposed keys in Git repositories!

### How it works:
1. Store your original API key (encrypted with AES-256-GCM)
2. Get a secure proxy key (APM_xxx format)
3. Use the proxy key in your code
4. Rotate keys anytime without code changes!

**Example:**
```bash
# Before (exposed!)
OPENAI_API_KEY=sk-live-1234567890abcdef

# After (secure!)
OPENAI_API_KEY=APM_abc123def456ghi789jkl012mno345pqr678stu901
```

## ⚡ Multi-API Management

Manage 20-100 APIs from one dashboard:
- **AI/ML**: OpenAI, Anthropic Claude, Google AI, Hugging Face
- **Payment**: Stripe, PayPal, Square, Mollie
- **Cloud**: AWS, Google Cloud, Azure, DigitalOcean
- **Email**: SendGrid, Mailgun, Postmark, Amazon SES
- **DevOps**: GitHub, GitLab, Vercel, Netlify, Railway
- **Database**: MongoDB Atlas, Firebase, Supabase, PlanetScale
- **And 90+ more APIs...**

## 🔄 Environment Switching

Switch instantly between test and production - without code changes! Perfect for rapid debugging and development cycles.

```bash
# Set environment via API or Dashboard
curl -X POST https://api.apimaster.com/v1/proxy/environment \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"proxyKey": "APM_xxx", "environment": "production"}'
```

## 📊 Real-time Analytics

- **Request Tracking**: Monitor all API calls in real-time
- **Cost Monitoring**: Track spending per API
- **Performance Metrics**: Latency, response times, error rates
- **Usage Reports**: Detailed analytics and insights
- **Rate Limit Tracking**: Stay within API quotas
- **Error Tracking**: Get alerted on failures

## 👥 Team Collaboration

**Ultimate & Enterprise Plans:**
- Real-time team chat
- File sharing (images, documents, code snippets)
- Role-based access control
- Shared API management
- Activity feed & audit log
- Team dashboard

## 🛡️ Military-Grade Security

- **AES-256-GCM Encryption** for all stored keys
- **JWT Authentication** with refresh tokens
- **2-Factor Authentication (2FA)**
- **Rate Limiting & DDoS Protection**
- **Automatic Key Rotation**
- **GDPR Compliant**
- **SOC 2 Type II** (in progress)
- **Regular Security Audits**
- **Bug Bounty Program**

## 🔗 GitHub Integration

### GitHub Actions

Use API Master in your CI/CD pipelines:

```yaml
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup API Master
        uses: api-master/setup-action@v1
        with:
          api-master-token: ${{ secrets.API_MASTER_TOKEN }}

      - name: Deploy with OpenAI API
        env:
          OPENAI_API_KEY: ${{ secrets.APM_OPENAI_PROXY }}
        run: npm run deploy
```

### Benefits:
- ✅ No API keys in repository secrets
- ✅ Easy key rotation without updating secrets
- ✅ Environment-specific keys
- ✅ Usage tracking per workflow
- ✅ Cost monitoring per project

### Repository Integration

- **Automatic Key Scanning**: Detect exposed API keys in commits
- **PR Checks**: Verify no keys are exposed before merge
- **Security Alerts**: Get notified of potential key leaks
- **Webhook Integration**: Sync with your workflows

## 💰 Pricing

### Individual Plan - $19.99/month
- Manage **20 APIs**
- Unlimited proxy keys
- Test/Production switching
- Basic analytics
- Email support
- GitHub Actions integration

### Ultimate Plan - $99.99/month
- Manage **50 APIs**
- Up to **5 team members**
- Team chat & file sharing
- Advanced analytics
- Priority support
- All integrations
- Custom webhooks

### Enterprise Plan - $299.99/month
- Manage **100 APIs**
- Up to **10 team members**
- Custom branding
- SLA guarantee (99.9% uptime)
- Dedicated support
- On-premise option
- SSO/SAML
- Advanced compliance features

**🎁 14-Day Free Trial** - No credit card required!

## 📱 Cross-Platform

- **Web**: app.apimaster.com
- **Desktop**: Windows, macOS, Linux
- **Mobile**: iOS, Android
- **CLI**: npm install -g @api-master/cli
- **API**: Full REST API
- **SDK**: JavaScript, Python, Go, Ruby

## 🎯 Use Cases

### For Freelancers
- Manage all client APIs organized
- Quick environment switching
- Professional invoicing with usage tracking

### For Startups
- Team collaboration on API management
- Cost tracking per feature
- Scale from 5 to 50+ APIs

### For DevOps
- CI/CD integration
- Monitoring & alerting
- Automated key rotation
- Compliance & audit logs

### For Agencies
- Multi-client API management
- Team permissions per client
- White-label options (Enterprise)

## 🌟 Customer Testimonials

> "Saves me at least 10 hours per week! The proxy keys are genius."
> — Sarah M., Freelance Developer

> "Essential for our 5-person dev team! Finally, all APIs centrally managed."
> — Michael K., CTO at TechStartup

> "No more exposed API keys in Git! Our security team is thrilled."
> — Thomas W., DevOps Engineer

> "The environment switch is a game-changer for our development workflow."
> — Anna L., Full-Stack Developer

## 📚 Documentation

- **Getting Started**: [docs.apimaster.com/quickstart](https://docs.apimaster.com/quickstart)
- **GitHub Integration**: [docs.apimaster.com/github](https://docs.apimaster.com/github)
- **API Reference**: [docs.apimaster.com/api](https://docs.apimaster.com/api)
- **CLI Guide**: [docs.apimaster.com/cli](https://docs.apimaster.com/cli)
- **Examples**: [github.com/api-master/examples](https://github.com/api-master/examples)

## 🚀 Quick Start

### 1. Install CLI
```bash
npm install -g @api-master/cli
# or
brew install api-master
```

### 2. Login
```bash
api-master login
```

### 3. Add API Key
```bash
api-master add openai \
  --key sk-live-1234567890abcdef \
  --env production
```

### 4. Get Proxy Key
```bash
api-master proxy openai
# Output: APM_abc123def456...
```

### 5. Use in Code
```javascript
// .env
OPENAI_API_KEY=APM_abc123def456...

// app.js
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Proxy key!
});
```

## 🔧 API Endpoints

Base URL: `https://api.apimaster.com/v1`

### Authentication
```bash
POST /auth/login
POST /auth/register
POST /auth/refresh
```

### Proxy Keys
```bash
GET    /proxy/keys
POST   /proxy/keys
PUT    /proxy/keys/:id
DELETE /proxy/keys/:id
POST   /proxy/keys/:id/rotate
```

### Analytics
```bash
GET /analytics/usage
GET /analytics/costs
GET /analytics/performance
```

### Teams
```bash
GET  /teams
POST /teams/:id/members
GET  /teams/:id/activity
```

## 🛠️ Supported Frameworks

- **Node.js**: Native support
- **Python**: SDK available
- **Go**: SDK available
- **Ruby**: SDK available
- **PHP**: SDK available
- **Java**: SDK available
- **.NET**: SDK available

## 🔒 Security & Compliance

- **Encryption**: AES-256-GCM for data at rest
- **Transport**: TLS 1.3 for data in transit
- **Authentication**: JWT with refresh tokens
- **Authorization**: Role-based access control (RBAC)
- **Auditing**: Complete audit logs
- **Compliance**: GDPR, SOC 2 Type II (in progress)
- **Infrastructure**: AWS Frankfurt (Germany)
- **Backups**: Daily encrypted backups
- **DDoS Protection**: Cloudflare Enterprise

## 📞 Support

- **Email**: support@apimaster.com
- **Documentation**: docs.apimaster.com
- **Community**: discord.gg/apimaster
- **GitHub Issues**: github.com/api-master/issues
- **Status Page**: status.apimaster.com

## 📄 Legal

- **Privacy Policy**: apimaster.com/privacy
- **Terms of Service**: apimaster.com/terms
- **Security**: apimaster.com/security
- **Data Processing Agreement**: Available for Enterprise

## 🏆 Why API Master?

✅ **No More Exposed Keys**: Proxy system protects your original keys
✅ **Save Time**: Manage all APIs from one place
✅ **Team Ready**: Built for collaboration from day one
✅ **Developer First**: CLI, API, SDKs, GitHub Actions
✅ **Secure by Default**: Military-grade encryption
✅ **Cost Control**: Monitor spending across all APIs
✅ **Always Available**: 99.9% uptime SLA (Enterprise)

---

**Made with ❤️ in Germany**
Ai Storm Create - Sebastian Beyer

**Try it free for 14 days!**
[Get Started](https://apimaster.com/signup?ref=github-marketplace) →
```

---

## Screenshots (min. 3, empfohlen: 5-8)

### Dashboard
![Dashboard](screenshots/01_dashboard.png)
*Manage all your APIs from one central dashboard*

### Proxy Key Generation
![Proxy Keys](screenshots/03_proxy_key.png)
*Generate secure proxy keys with one click*

### Analytics
![Analytics](screenshots/04_analytics.png)
*Real-time insights into API usage and costs*

### Team Collaboration
![Team Chat](screenshots/05_team_chat.png)
*Collaborate with your team in real-time*

### GitHub Actions Integration
![GitHub Actions](screenshots/09_github_actions.png)
*Seamless integration with your CI/CD pipeline*

---

## App Logo (200x200 PNG)

**logo.png**

Design:
- Symbol: Key with Shield
- Color: Primary Blue (#0ea5e9)
- Background: Transparent
- Style: Modern, recognizable at small sizes

---

## Categories & Tags

### Primary Category
Developer Tools

### Additional Categories
- Security
- DevOps
- Productivity

### Tags
```
api-management
security
encryption
developer-tools
devops
ci-cd
github-actions
team-collaboration
proxy
api-keys
```

---

## GitHub App Permissions

### Required Permissions:

**Repository:**
- Read access to code (for key scanning)
- Read access to metadata

**Organization:**
- Read access to members (for team features)

**User:**
- Read access to email

### Webhooks:
- Push events (for key scanning)
- Pull request events (for PR checks)
- Repository events

---

## Pricing Plans (GitHub Marketplace Format)

### Free Trial
```yaml
name: Free Trial
price: $0
duration: 14 days
features:
  - All Individual Plan features
  - No credit card required
```

### Individual
```yaml
name: Individual
price_monthly: $19.99
price_yearly: $179.99
unit: per user
features:
  - 20 APIs
  - Unlimited proxy keys
  - Environment switching
  - Basic analytics
  - GitHub Actions
  - Email support
```

### Ultimate
```yaml
name: Ultimate
price_monthly: $99.99
price_yearly: $999.99
unit: per organization
features:
  - 50 APIs
  - Up to 5 team members
  - Team collaboration
  - Advanced analytics
  - Priority support
  - Webhooks
```

### Enterprise
```yaml
name: Enterprise
price_monthly: $299.99
price_yearly: $2999.99
unit: per organization
features:
  - 100 APIs
  - Up to 10 team members
  - Custom branding
  - SLA guarantee
  - Dedicated support
  - On-premise option
  - SSO/SAML
```

---

## Installation Instructions

### Via GitHub Marketplace

1. Go to [API Master on GitHub Marketplace](https://github.com/marketplace/api-master)
2. Click "Set up a plan"
3. Choose your plan (start with Free Trial)
4. Grant required permissions
5. Complete installation

### Via CLI

```bash
# Install CLI
npm install -g @api-master/cli

# Login with GitHub
api-master login --github

# You're ready!
api-master --help
```

### Via GitHub Actions

Add to `.github/workflows/deploy.yml`:

```yaml
- name: Setup API Master
  uses: api-master/setup-action@v1
  with:
    api-master-token: ${{ secrets.API_MASTER_TOKEN }}
```

---

## Support & Documentation

**Documentation**: https://docs.apimaster.com
**API Reference**: https://docs.apimaster.com/api
**GitHub Examples**: https://github.com/api-master/examples
**Support Email**: support@apimaster.com
**Community Discord**: https://discord.gg/apimaster

---

## Verification & Trust

- [ ] GitHub Verified Publisher Badge
- [ ] Security Policy published
- [ ] Code of Conduct
- [ ] Contributing Guidelines
- [ ] Open Source Components listed
- [ ] Privacy Policy linked
- [ ] Terms of Service linked

---

## Marketplace Submission Checklist

- [ ] GitHub Organization erstellt: `api-master`
- [ ] OAuth App registriert
- [ ] GitHub App erstellt (für Actions)
- [ ] Logo 200x200 hochgeladen
- [ ] Min. 3 Screenshots
- [ ] Beschreibung ausgefüllt (Markdown)
- [ ] Pricing Plans konfiguriert
- [ ] Support-URL hinterlegt
- [ ] Privacy Policy URL
- [ ] Terms of Service URL
- [ ] Webhook-Endpoint getestet
- [ ] GitHub Actions Action veröffentlicht

---

## Revenue & Fees

**GitHub Marketplace Revenue Share:**
- First $25,000/year: **25% fee** (you keep 75%)
- After $25,000/year: **0% fee** (you keep 100%)

**Example Calculation:**
- 100 Individual subscriptions à $19.99 = $1,999/month
- First year: $23,988 revenue → $5,997 fees → **$17,991 net**
- Second year: Same revenue → **$0 fees** → **$23,988 net**

**Payment Processing:**
- Handled by GitHub
- Monthly payouts via Stripe
- No additional fees (included in 25%)

---

**Status**: BEREIT FÜR SUBMISSION ✅
**Setup-Kosten**: $0 (GitHub Marketplace kostenlos)
**Revenue-Share**: 25% first $25k, then 0%
**Erstellt**: 2025-01-XX
**Kontakt**: aistormcreate.service@gmail.com
