<p align="center">
  <img src="client/public/logo512.png" alt="Saurellius Logo" width="120" />
</p>

<h1 align="center">Saurellius</h1>
<h3 align="center">by Dr. Paystub</h3>

<p align="center">
  <strong>Professional, Secure Digital Payroll Check Stubs</strong><br/>
  FICA-compliant &bull; Password-protected PDFs &bull; 6 Premium Templates
</p>

<p align="center">
  <a href="https://www.drpaystub.net">
    <img src="https://img.shields.io/badge/Live-drpaystub.net-7c3aed?style=for-the-badge&logo=microsoftazure&logoColor=white" alt="Live Site" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white" alt="Stripe" />
</p>

---

## Overview

**Saurellius** is a full-stack SaaS platform for generating professional payroll check stubs. Built for small businesses, contractors, freelancers, and self-employed individuals who need accurate, compliant pay documentation.

Every generated PDF is individually password-protected, digitally watermarked, and delivered via branded email through Azure Communication Services.

### Live Platform

> **[https://www.drpaystub.net](https://www.drpaystub.net)**

---

## Platform Screenshots

<table>
  <tr>
    <td align="center" width="50%">
      <img src="docs/screenshots/hero.png" alt="Landing Page" /><br/>
      <sub><b>Landing Page</b> — Modern hero with rotating state selector</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/screenshots/templates.png" alt="Template Selection" /><br/>
      <sub><b>6 Premium Templates</b> — Professional paystub layouts</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/screenshots/dashboard.png" alt="User Dashboard" /><br/>
      <sub><b>User Dashboard</b> — Stats, recent stubs, profile completion</sub>
    </td>
    <td align="center">
      <img src="docs/screenshots/paystubs.png" alt="My Paystubs" /><br/>
      <sub><b>My Paystubs</b> — Expandable groups with password reveal</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/screenshots/admin.png" alt="Admin Dashboard" /><br/>
      <sub><b>Admin Dashboard</b> — Revenue, Stripe, user & paystub analytics</sub>
    </td>
    <td align="center">
      <img src="docs/screenshots/email.png" alt="Email Delivery" /><br/>
      <sub><b>Branded Email</b> — Password-protected PDFs via Azure ACS</sub>
    </td>
  </tr>
</table>

> **Note:** To add screenshots, place PNG images in the `docs/screenshots/` directory with the filenames referenced above.

---

## Key Features

### Paystub Generation
- **6 premium templates** with professional layouts
- **Multi-period support** — generate multiple pay periods in a single order
- **Hourly & salaried** — supports both employment types
- **All 50 US states** — automatic federal, state, and local tax calculations
- **FICA compliant** — Social Security, Medicare, and SDI deductions
- **Custom additions & deductions** — overtime, bonuses, 401(k), health insurance, etc.

### Security & Compliance
- **Password-protected PDFs** — each stub locked with a unique password (`LASTNAME` + last 4 SSN + pay period start date `MMDDYYYY`)
- **Digital watermarking** — invisible security layer on every document
- **QR code verification** — document authenticity validation
- **Owner-level encryption** — separate owner password with restricted permissions
- **Snappt-resistant** — security features designed to pass document verification

### User Dashboard
- **Overview** — time-of-day greeting, stat cards (groups, pay periods, member since, profile %)
- **Profile completion tracker** — progress bar with field-by-field checklist
- **Recent paystubs feed** — last 3 generated stubs with relative timestamps
- **Quick actions** — one-click access to create, view, and manage
- **My Paystubs** — expandable group cards with per-stub details and password reveal toggle
- **Security** — password change with validation

### Admin Dashboard
- **Overview tab** — total users, paid paystubs, monthly growth trends, 6-month bar chart
- **Revenue & Stripe tab** — this month/last month revenue, Stripe balance, recent charges table
- **Users tab** — recent signups, verified/unverified breakdown, role badges
- **Paystubs tab** — recent paid stubs, total/paid/unpaid/weekly counts
- **Stripe mode indicator** — live/dev badge

### Email & Notifications
- **Branded email delivery** via Azure Communication Services from `noreply@drpaystub.net`
- **Password formula included** — each email lists the password for every attached stub
- **Purchase confirmation** — receipt with order details
- **Email verification** — secure signup flow

### Payments
- **Stripe integration** — secure checkout with live/test mode support
- **Webhook handling** — real-time payment event processing
- **Revenue tracking** — admin-level Stripe analytics

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Redux, React Router, Bootstrap, SCSS |
| **Backend** | Node.js, Express.js, EJS templating |
| **Database** | MongoDB (Mongoose ODM) |
| **PDF Engine** | PDFKit with custom security layer |
| **Payments** | Stripe (checkout, webhooks, revenue API) |
| **Email** | Azure Communication Services |
| **Auth** | JWT with bcrypt password hashing |
| **Hosting** | Azure App Service |
| **DNS/CDN** | Azure DNS |
| **Analytics** | Google Analytics, Facebook Pixel, Taboola, Outbrain |

---

## Project Structure

```
drpaystub/
├── client/                    # React frontend
│   ├── public/                # Static assets, logos, manifest
│   └── src/
│       ├── components/
│       │   ├── Header/        # Navigation & mobile menu
│       │   ├── Footer/        # Site footer
│       │   └── pages/
│       │       ├── Home/      # Landing page (Hero, HowItWorks, etc.)
│       │       ├── Dashboard/ # User & Admin dashboards
│       │       ├── PayStubForm/ # Multi-step paystub creator
│       │       ├── Blog/      # Knowledge base & articles
│       │       └── W2Form/    # W-2 form generator
│       ├── data/              # Blog articles, state tax data
│       └── redux/             # State management
├── routes/
│   ├── paystub.js             # Paystub generation & Stripe checkout
│   ├── auth.js                # Authentication & user management
│   ├── admin.js               # Admin stats & Stripe revenue API
│   ├── stripe-webhook.js      # Stripe webhook handler
│   └── ...
├── services/
│   ├── pdf-generator-pdfkit.js # Primary PDF engine (PDFKit)
│   ├── pdf-generator.js       # Image-based PDF engine
│   ├── email.service.js       # Azure ACS email service
│   ├── paystub.service.js     # Tax calculations & pay logic
│   └── ...
├── models/                    # MongoDB schemas (User, Paystub)
├── middlewares/                # Auth, role check, upload
├── config/                    # Tax tables, federal/state/SDI rates
├── views/                     # EJS paystub templates (1-6)
└── app.js                     # Express server entry point
```

---

## Getting Started

### Prerequisites
- **Node.js** 18+
- **MongoDB** (Atlas or local)
- **Stripe** account (test keys for development)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000
JWT_SECRET=your_jwt_secret

# MongoDB
MONGO_URI=mongodb+srv://...

# Stripe
STRIPE_MODE=dev
STRIPE_TEST_KEY=sk_test_...
STRIPE_LIVE_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Azure Communication Services (Email)
ACS_CONNECTION_STRING=endpoint=https://...
FROM_EMAIL=noreply@drpaystub.net

# URLs
URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Installation

```bash
# Clone the repository
git clone https://github.com/diegoenterprises/drpaystub.git
cd drpaystub

# Install server dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Run in development (server + client concurrently)
npm run dev
```

The server runs on `http://localhost:5000` and the client on `http://localhost:3000`.

### Production Build

```bash
cd client && npm run build && cd ..
npm start
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/register` | User registration |
| `GET` | `/api/auth/get-user` | Get current user |
| `PUT` | `/api/auth/update-user` | Update profile |
| `POST` | `/api/auth/change-password` | Change password |
| `GET` | `/api/auth/get-paystubs` | Get user's paystubs |

### Paystubs
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/paystub/getZip` | Generate & download paystub PDFs |
| `POST` | `/api/paystub/save-stub` | Save paystub to database |

### Admin (requires `admin` role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/stats` | Platform stats (users, paystubs, trends) |
| `GET` | `/api/admin/stripe-revenue` | Stripe revenue & charges |
| `GET` | `/api/auth/get-all-users` | Paginated user list |
| `GET` | `/api/auth/get-admin-paystubs` | Paginated paystub list |

---

## PDF Password Formula

Each generated paystub PDF is locked with a unique password:

```
LASTNAME + LAST4SSN + MMDDYYYY
```

| Component | Source | Example |
|-----------|--------|---------|
| `LASTNAME` | Employee last name (uppercase) | `SMITH` |
| `LAST4SSN` | Last 4 digits of SSN | `4567` |
| `MMDDYYYY` | Pay period start date | `01152026` |

**Example password:** `SMITH456701152026`

---

## Deployment

The platform is deployed on **Azure App Service** with the following infrastructure:

- **App Service:** `drpaystub-app` (Node.js 18 LTS)
- **Database:** MongoDB Atlas
- **Email:** Azure Communication Services (`noreply@drpaystub.net`)
- **DNS:** Azure DNS for `drpaystub.net`
- **Payments:** Stripe (live mode)

---

## License

Proprietary software. All rights reserved.

**Saurellius** is a product of **Eusorone Technologies Inc.**

---

<p align="center">
  <img src="client/public/logo192.png" alt="Saurellius" width="48" /><br/>
  <sub>Built with precision by <a href="https://github.com/diegoenterprises">Diego Enterprises</a></sub>
</p>