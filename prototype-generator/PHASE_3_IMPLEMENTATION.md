# 🚀 Phase 3 - Implementation Guide
## Account Settings + Stripe Payments + Analytics + Advanced Projects

**Status**: 60% Backend, 0% Frontend
**Database**: ✅ All 7 new models created
**Backend Routes**: 50% Complete (Settings done, Analytics/Stripe/Projects pending)

---

## ✅ COMPLETED

### 1. Database Schema Extended
- `Subscription` - Stripe subscription tracking
- `Billing` - Invoice and payment history
- `APIKey` - User API key management
- `ProjectTemplate` - Project templates library
- `ProjectVersion` - Project version control
- `ProjectAnalytics` - Usage analytics per project
- `NotificationSettings` - Email preferences

### 2. Settings Routes (settings.js) - ✅ COMPLETE
```
PUT  /api/settings/profile          - Update avatar, bio, name
PUT  /api/settings/password         - Change password
GET  /api/settings/notifications   - Get notification prefs
PUT  /api/settings/notifications   - Update notification prefs
POST /api/settings/api-keys        - Generate new API key
GET  /api/settings/api-keys        - List user API keys
DELETE /api/settings/api-keys/:id  - Revoke API key
```

---

## ⏳ PENDING IMPLEMENTATION

### 3. Stripe Routes (stripe.js) - TODO
```
POST /api/billing/create-checkout   - Create Stripe checkout session
POST /api/billing/webhook           - Stripe webhook handler
GET  /api/billing/subscription      - Get current subscription
POST /api/billing/update-subscription - Change subscription plan
DELETE /api/billing/subscription    - Cancel subscription
GET  /api/billing/invoices          - Get billing history
POST /api/billing/invoice/:id       - Download invoice PDF
```

**Features**:
- 3 Plans: Free (100k tokens/mo), Pro ($29/mo), Enterprise ($99/mo)
- Stripe webhook for subscription events
- Auto-upgrade quotas based on plan
- Invoice generation and storage
- Payment method management

### 4. Analytics Routes (analytics.js) - TODO
```
GET  /api/analytics/dashboard         - Overall usage stats
GET  /api/analytics/projects          - Per-project analytics
POST /api/analytics/track/:projectId  - Track project action
GET  /api/analytics/costs              - Cost breakdown
GET  /api/analytics/export/:format    - Export analytics
```

**Tracks**:
- View count per project
- Edit/customization count
- Export actions
- Total tokens used
- Total cost spent
- Last activity date

### 5. Advanced Projects Routes (projects-advanced.js) - TODO
```
POST   /api/projects/:id/favorite      - Mark as favorite
DELETE /api/projects/:id/favorite      - Remove favorite
PUT    /api/projects/:id/tags          - Add tags
POST   /api/projects/:id/versions      - Create version
GET    /api/projects/:id/versions      - List versions
GET    /api/projects/:id/versions/:v   - Get specific version
POST   /api/projects/templates         - List templates
POST   /api/projects/:id/use-template  - Use template
```

**Features**:
- Favorites system
- Tag-based organization
- Version history with restore
- Project templates
- Bulk operations (archive, delete)

### 6. Account Settings Frontend (Settings.jsx) - TODO
```jsx
Pages:
- Profile tab (avatar, bio, name)
- Security tab (password change)
- Notifications tab (email preferences)
- API Keys tab (generate, revoke, list)
- Account tab (delete account, data export)

Features:
- Avatar upload
- Real-time notifications toggle
- API key generation/management
- Copy-to-clipboard for API keys
- Confirmation dialogs for destructive actions
```

### 7. Billing Page (Billing.jsx) - TODO
```jsx
Components:
- Plan selection cards (Free/Pro/Enterprise)
- Current subscription info
- Payment method management
- Invoice list and download
- Usage metrics with costs

Stripe Integration:
- Checkout button per plan
- Subscription management
- Payment method update
- Cancel subscription flow
- Webhook success/error handling
```

### 8. Analytics Dashboard (Analytics.jsx) - TODO
```jsx
Visualizations:
- Line chart: Token usage over time
- Pie chart: Cost breakdown by project
- Bar chart: Top projects by usage
- Stat cards: Total projects, total spent, avg cost

Features:
- Date range selector
- Project filter
- Export to CSV/PDF
- Detailed project analytics modal
- Cost forecasting
```

### 9. Advanced Projects UI (Projects-Advanced.jsx) - TODO
```jsx
Features:
- Favorite/unfavorite projects
- Add/remove tags
- Version history with restore
- Use project as template
- Bulk select and archive/delete
- Search by tags
- Filter by favorites

Components:
- ProjectCard with favorite icon
- TagInput component
- VersionHistory modal
- TemplateSelector modal
- BulkActions toolbar
```

---

## 📊 STRIPE PRICING STRUCTURE

```javascript
// Recommended Plans
FREE:
  - 100k tokens/month
  - $0/month
  - 5 projects max
  - Basic analytics

PRO:
  - 1M tokens/month
  - $29/month (or pay-as-you-go)
  - Unlimited projects
  - Advanced analytics
  - API access

ENTERPRISE:
  - Unlimited tokens
  - $99/month
  - Everything in Pro
  - Priority support
  - Custom rate limits
  - Webhook access
```

---

## 🔐 STRIPE WEBHOOK EVENTS

```javascript
// Handle these events in /api/billing/webhook:
- customer.created
- customer.updated
- customer.deleted
- invoice.created
- invoice.payment_succeeded
- invoice.payment_failed
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
```

---

## 📈 ANALYTICS TRACKING

```javascript
// Track in each AI endpoint:
const analytics = await prisma.projectAnalytics.upsert({
  where: { projectId },
  update: {
    viewCount: { increment: 1 },
    totalTokensUsed: { increment: usage.totalTokens },
    totalCost: { increment: cost.totalCost },
    lastViewedAt: new Date(),
  },
});
```

---

## 🛠️ IMPLEMENTATION PRIORITY

### Phase 3A: Core Features (2-3 hours)
1. ✅ Settings routes (DONE)
2. ⏳ Analytics routes
3. ⏳ Advanced project routes
4. ⏳ Account Settings UI
5. ⏳ Analytics Dashboard UI

### Phase 3B: Payments (2-3 hours)
1. ⏳ Stripe setup
2. ⏳ Billing routes
3. ⏳ Billing UI
4. ⏳ Webhook handling

---

## 🚀 NEXT STEPS

To complete Phase 3:

1. **Create remaining backend routes**:
   ```bash
   # routes/analytics.js
   # routes/stripe.js
   # routes/projects-advanced.js
   ```

2. **Add route imports to server.js**:
   ```javascript
   import analyticsRoutes from './routes/analytics.js';
   import stripeRoutes from './routes/stripe.js';
   import projectsAdvancedRoutes from './routes/projects-advanced.js';

   app.use('/api/analytics', analyticsRoutes);
   app.use('/api/billing', stripeRoutes);
   app.use('/api/projects-advanced', projectsAdvancedRoutes);
   ```

3. **Create frontend pages**:
   ```
   src/pages/Settings.jsx
   src/pages/Billing.jsx
   src/pages/Analytics.jsx
   src/pages/Projects-Advanced.jsx
   ```

4. **Update App.jsx routing**:
   ```jsx
   <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
   <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
   <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
   ```

5. **Add navigation links in Header**:
   - Settings
   - Billing
   - Analytics
   - Projects (with advanced features)

6. **Testing**:
   - Test all endpoints with curl/Postman
   - Test Stripe webhook with Stripe CLI
   - E2E testing of payment flow
   - Analytics tracking validation

---

## 📝 ENVIRONMENT VARIABLES (Add to .env)

```
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@prototypegenerator.com
```

---

## 💾 DATABASE MIGRATION

After updating schema.prisma, run:
```bash
npx prisma migrate dev --name "Add Phase 3 models"
npx prisma generate
```

---

**Total Phase 3 Scope**: ~2000 lines of backend code + ~1500 lines of frontend code
**Estimated Time**: 6-8 hours total
**Complexity**: Medium (Stripe integration + analytics tracking)

