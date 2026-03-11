# 🇮🇳 JobPulse India
## India's Smart Government Job Alert Platform

> Automated platform that collects, processes, and delivers government job notifications to thousands of job seekers.

---

## ✨ Features

- 🤖 **Auto-crawler** — Scrapes government job portals every 3 hours
- 🧠 **AI Processing** — Uses Claude AI to enhance job descriptions and SEO
- 📧 **Email Alerts** — Personalized job notifications based on preferences
- 🔍 **Full-text Search** — Fast MongoDB text search
- 📱 **Responsive UI** — Mobile-first Next.js frontend
- 🔐 **Authentication** — JWT-based auth with email verification
- ⚙️ **Admin Panel** — Manage jobs, users, and automation logs
- 📊 **SEO Optimized** — Auto sitemap, schema markup, meta tags

---

## 🗂️ Project Structure

```
jobpulse-india/
├── frontend/               # Next.js frontend
│   ├── pages/              # App pages (index, jobs, dashboard, etc.)
│   ├── components/         # Reusable React components
│   │   ├── layout/         # Navbar, Footer, Layout
│   │   ├── jobs/           # JobCard, JobFilters
│   │   └── ui/             # Skeleton loaders, UI components
│   ├── hooks/              # useAuth, custom hooks
│   ├── lib/                # API helper functions
│   └── styles/             # Global CSS + Tailwind
│
├── backend/                # Node.js + Express API
│   ├── models/             # Mongoose models (Job, User, Notification)
│   ├── routes/             # API route definitions
│   ├── controllers/        # Business logic
│   ├── services/           # Crawler, AI, Email, Notification services
│   ├── middleware/         # Auth middleware
│   └── server.js           # Entry point
│
├── scripts/
│   ├── scheduler.js        # Cron job scheduler (runs with backend)
│   └── job-crawler.js      # Standalone crawler script
│
└── docker/
    └── docker-compose.yml  # Full stack Docker setup
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (free tier works)
- Gmail account (for SMTP alerts)

### 1. Clone & Install

```bash
git clone https://github.com/yourname/jobpulse-india.git
cd jobpulse-india

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI, email, API keys
```

**Frontend:**
```bash
cd frontend
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### 3. Run Development

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Start frontend
cd frontend && npm run dev
```

Visit `http://localhost:3000`

### 4. Create Admin User

Connect to MongoDB and update a user's role:
```javascript
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

### 5. Trigger First Crawl

```bash
# Manual crawl (wait for DB to be connected)
cd backend && node ../scripts/job-crawler.js
```

---

## 🌐 Deployment

### Option A: Vercel + Railway (Recommended)

**Backend on Railway:**
1. Push backend to GitHub
2. Create new project on [railway.app](https://railway.app)
3. Add MongoDB service in Railway
4. Set environment variables
5. Deploy — Railway auto-detects Node.js

**Frontend on Vercel:**
1. Push frontend to GitHub  
2. Import project on [vercel.com](https://vercel.com)
3. Set `NEXT_PUBLIC_API_URL` = your Railway backend URL
4. Deploy

---

### Option B: Render

**Backend:**
1. Create Web Service on [render.com](https://render.com)
2. Build command: `npm install`
3. Start command: `node server.js`
4. Add environment variables

**Frontend:**
1. Create Static Site or Web Service
2. Build command: `npm run build`
3. Set environment variables

---

### Option C: Docker (VPS/Self-hosted)

```bash
# Clone repo on your VPS
git clone https://github.com/yourname/jobpulse-india.git
cd jobpulse-india/docker

# Copy and configure env
cp ../backend/.env.example .env
# Edit .env with production values

# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

---

### Option D: Manual VPS Setup

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt install -y nodejs

# Install PM2
npm install -g pm2

# Backend
cd backend
npm install --production
pm2 start server.js --name "jobpulse-backend"

# Frontend
cd ../frontend
npm install
npm run build
pm2 start npm --name "jobpulse-frontend" -- start

# Save PM2 config
pm2 save
pm2 startup
```

---

## ⚙️ Automation Schedule

The scheduler runs automatically when the backend starts:

| Task | Schedule | Description |
|------|----------|-------------|
| Job Crawl | Every 3 hours | Scrapes all job sources |
| Deadline Alerts | Daily 8 AM | Reminds users of closing jobs |
| Expired Cleanup | Every Sunday | Deactivates old job listings |

**Manual trigger via API:**
```bash
curl -X POST http://localhost:5000/api/crawler/trigger \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List all jobs (paginated) |
| GET | `/api/jobs/latest` | 12 most recent jobs |
| GET | `/api/jobs/trending` | Top viewed jobs |
| GET | `/api/jobs/search?q=...` | Full-text search |
| GET | `/api/jobs/:slug` | Single job details |
| GET | `/api/jobs/stats` | Dashboard statistics |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Current user profile |
| POST | `/api/users/save-job/:id` | Save/unsave a job |
| GET | `/api/notifications` | User notifications |
| GET | `/api/admin/dashboard` | Admin stats (admin only) |
| POST | `/api/crawler/trigger` | Trigger crawl (admin only) |

---

## 🧠 AI Processing

Set `ANTHROPIC_API_KEY` in your backend `.env` to enable:

- Auto-rewrite raw scraped descriptions into clean readable format
- Generate SEO-optimized job titles (max 70 chars)
- Create compelling meta descriptions (max 160 chars)
- Tag jobs with relevant search keywords

Without the API key, jobs are still saved with raw scraped data.

---

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App Passwords
3. Generate an app password for "Mail"
4. Set in `.env`:
   ```
   SMTP_USER=your@gmail.com
   SMTP_PASS=your_16_char_app_password
   ```

---

## 🔒 Security Features

- JWT authentication with configurable expiry
- bcrypt password hashing (12 rounds)
- Rate limiting (200 req/15min globally, 20 auth attempts/hour)
- Helmet.js security headers
- Input validation with express-validator
- CORS configured for specific frontend origin

---

## 📈 SEO Features

- Auto-generated sitemap at `/sitemap.xml`
- robots.txt at `/robots.txt`
- JobPosting schema markup on job detail pages
- Per-page meta titles and descriptions
- AI-generated SEO titles and meta descriptions

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License — feel free to use for personal and commercial projects.

---

## 🙏 Acknowledgments

- Job data sourced from public government portals
- AI processing powered by Anthropic Claude
- Built with Next.js, Node.js, MongoDB, TailwindCSS

---

**Made with ❤️ for job seekers across India 🇮🇳**
