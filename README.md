# MediCare

A healthcare management web app built with Next.js. MediCare gives patients a single dashboard for medications, appointments, and health trends, with a one-tap SOS flow for emergencies and an AI health assistant for general wellness questions.

Built for the GDG Hackathon.

## Features

- **Patient accounts** — email/password registration and login, plus Google sign-in. Passwords are hashed with bcrypt and sessions use JWT.
- **SOS emergency alerts** — one-tap alert with emergency type (general, cardiac, breathing, fall, medication), severity level, and device location. Each alert stores a snapshot of the patient's conditions, medications, allergies, and emergency contact, along with a full audit log.
- **Medicine tracker** — daily medication schedule with dose times and a tap-to-mark-taken flow.
- **Family portal** — share health status with family members and emergency contacts.
- **AI health assistant** — chat interface powered by Google Gemini for general health and wellness questions (with clear "not medical advice" guardrails).
- **Health charts** — visualize vitals and health trends over time with Recharts.
- **Appointment manager** — keep track of upcoming doctor visits.
- **Dark mode** — full light/dark theming across the dashboard.

> **Note:** the UI currently runs in demo mode with mock authentication and sample data, so the app can be explored without a database. The real API routes below are implemented and ready to be wired up.

## Tech stack

| Layer      | Technology |
|------------|------------|
| Framework  | Next.js 14 (App Router) + React 18 |
| Styling    | Tailwind CSS, Lucide icons |
| Database   | MongoDB (official Node.js driver) |
| Auth       | JWT (`jsonwebtoken`) + `bcryptjs`, Joi validation |
| AI         | Google Gemini (`@google/generative-ai`) |
| Charts     | Recharts |
| Notifications | Twilio (SMS) and SendGrid (email) — integration in progress |

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/register` | Create a patient account (validated, password hashed, sequential patient ID assigned) |
| `POST` | `/api/auth/login` | Verify credentials and issue a JWT |
| `POST` | `/api/emergency/alert` | Create an emergency alert with location and patient snapshot |
| `GET`  | `/api/emergency/alert` | List recent alerts for a patient |

## Getting started

### Prerequisites

- Node.js 18+
- A MongoDB database (e.g. a free MongoDB Atlas cluster)

### Setup

1. Clone the repo and install dependencies:

   ```bash
   git clone https://github.com/varshakodi/MediCare.git
   cd MediCare
   npm install
   ```

2. Create your environment file from the template and fill in your own values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Purpose |
   |----------|---------|
   | `MONGODB_URI` | MongoDB connection string |
   | `JWT_SECRET` | Secret for signing auth tokens (32+ random characters) |
   | `NEXTAUTH_URL` / `NEXTAUTH_SECRET` | NextAuth configuration |
   | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
   | `TWILIO_*` | Twilio credentials for SMS emergency notifications |
   | `SENDGRID_API_KEY` / `EMERGENCY_EMAIL` | Email notification settings |
   | `NEXT_PUBLIC_GEMINI_API_KEY` | Google Gemini API key for the health assistant |

   `.env.local` is git-ignored — never commit real credentials.

3. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Project structure

```
├── lib/
│   ├── auth.js          # Password hashing, JWT issue/verify, request auth
│   ├── emergency.js     # Emergency alert creation and status updates
│   └── mongodb.js       # MongoDB client (connection reuse in dev)
├── models/
│   ├── Patient.js       # Patient schema + Joi validation
│   └── EmergencyAlert.js# Alert schema + alert ID generation
└── src/app/
    ├── api/
    │   ├── auth/        # register + login routes
    │   └── emergency/   # emergency alert routes
    ├── page.js          # Dashboard UI (auth, SOS, tracker, chatbot, charts)
    ├── layout.js        # Root layout + metadata
    └── globals.css      # Global styles
```

## Disclaimer

MediCare is a hackathon project for demonstration and learning. It is not a medical device, and the AI assistant does not provide medical advice — always consult a healthcare professional for medical concerns. Do not use this project with real patient data without adding the security and compliance controls (e.g. HIPAA) that real health data requires.
