# 🎯 ByteBucks - Gamified Financial Literacy for Kids

## 💡 Why This Project?

Financial literacy is one of the most critical life skills, yet it's rarely taught in schools. Children grow up without understanding fundamental concepts like saving, budgeting, borrowing, or investing—leading to poor financial decisions in adulthood.

**ByteBucks** bridges this gap by transforming financial education into an engaging, game-like experience. Instead of boring lectures or textbooks, kids learn through interactive case-based scenarios that reward them with virtual currency and unlock new challenges as they progress.

This project demonstrates my ability to build a complete, production-ready educational platform that combines:
- **Real-world problem-solving** (financial literacy for kids)
- **Complex business logic** (adaptive learning, rule-based progression)
- **Modern full-stack engineering** (Next.js, Supabase, TypeScript)
- **User-centric design** (gamification, accessibility, responsive UI)

---

## 🌟 Significance & Impact

### The Problem
- **76% of adults** live paycheck to paycheck due to poor financial literacy
- **Only 17% of U.S. states** require high school personal finance courses
- Kids as young as 7 can understand basic money concepts, but lack engaging tools to learn
- Traditional financial education is dry, abstract, and disconnected from real-life scenarios

### Why It Matters
Financial mistakes made in early adulthood (student loans, credit card debt, lack of emergency savings) can take decades to recover from. By teaching kids these concepts through interactive, memorable experiences, we can:
- Build lifelong healthy financial habits
- Reduce future debt crises
- Empower the next generation to make informed decisions about borrowing, saving, and investing

### Why ByteBucks is Different
Unlike static educational apps, ByteBucks uses:
- **Case-based learning**: Real-world scenarios (e.g., "Should you borrow $50 from a friend at 10% interest?")
- **Adaptive recommendations**: If a student struggles with "borrowing," the system automatically suggests remedial content
- **Gamification**: Virtual currency, badges, and progression unlock to maintain engagement
- **Parent/teacher visibility**: Adults can track progress and identify knowledge gaps

---

## 🎯 What Problem Does It Solve?

**Problem Statement:**
Children aged 10-16 lack access to engaging, practical financial education tools that teach foundational concepts through real-world application.

**Target Users:**
1. **Students** (primary users): Learn financial concepts through interactive quizzes and earn rewards
2. **Parents**: Monitor their child's progress and identify areas needing improvement
3. **Educators**: Use the platform as a supplementary teaching tool in classrooms

**Solution:**
ByteBucks provides a gamified learning platform where students:
- Complete interactive financial case studies (saving, borrowing, investing, digital security)
- Earn virtual coins for correct answers and speed
- Unlock advanced topics only after mastering prerequisites (rule-based progression)
- Receive personalized recommendations based on their performance
- Track their progress through an engaging dashboard

Parents and educators get a separate view to monitor student progress, identify weak areas, and ensure learning objectives are met.

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **Next.js 14** (App Router) | Full-stack React framework | Server-side rendering, API routes, and excellent TypeScript support. Enables building both frontend and backend in a single codebase. |
| **TypeScript** | Type-safe JavaScript | Catches bugs at compile time, improves code maintainability, and provides better IDE support. Critical for complex business logic. |
| **Tailwind CSS** | Utility-first CSS framework | Rapid UI development with consistent design system. Mobile-first approach ensures responsive design out of the box. |
| **shadcn/ui** | Accessible component library | Pre-built, accessible components (buttons, dialogs, forms) that follow WAI-ARIA standards. Saves development time while ensuring accessibility. |

### Backend & Database
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **Supabase** | Backend-as-a-Service | Provides PostgreSQL database, authentication, and Row Level Security (RLS) out of the box. Eliminates the need to build custom backend APIs, saving 10+ hours of development time. |
| **PostgreSQL** | Relational database | Robust, ACID-compliant database. Supabase's managed Postgres handles data relationships (users, quizzes, attempts, wallets) with referential integrity. |
| **Supabase Auth** | Authentication & authorization | Secure email/password authentication with built-in session management. RLS policies ensure students can only access their own data. |

### Development & Deployment
| Technology | Purpose | Why I Chose It |
|------------|---------|----------------|
| **Vercel** | Frontend deployment | Seamless Next.js deployment with automatic CI/CD. Zero-config deployment with environment variable management. |
| **Supabase Cloud** | Database hosting | Managed PostgreSQL with automatic backups, scaling, and a user-friendly dashboard for database management. |
| **Zod** | Schema validation | TypeScript-first schema validation for form inputs and API responses. Prevents invalid data from reaching the database. |

---

## 🏗️ Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Student  │  │  Parent  │  │  Quiz    │              │
│  │Dashboard │  │   View   │  │  Engine  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└────────────────────┬────────────────────────────────────┘
                     │ (Server Actions / Zod Validation)
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend Logic (Next.js API)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Auth Logic  │  │  Scoring &   │  │  Reward &    │  │
│  │  (Supabase)  │  │  Rule Engine │  │  Workflow    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Supabase (BaaS)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │   Auth   │  │PostgreSQL│  │   RLS    │              │
│  │  Service │  │   (DB)   │  │Policies  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### For Students
- **Interactive Quiz Engine**: Answer real-world financial scenarios with immediate feedback
- **Gamified Wallet**: Earn virtual coins for correct answers, trackable on dashboard
- **Progressive Unlocking**: Master basic concepts before advancing to complex topics
- **Personalized Recommendations**: System suggests remedial content based on performance

### For Parents/Educators
- **Analytics Dashboard**: View student's total coins, quiz completion rate, and average scores
- **Progress Tracking**: Identify which financial concepts need more practice
- **Multi-student Support**: Monitor multiple children/students from a single account

### Advanced Technical Features
- **Automated Multi-Step Workflow (A07)**: Post-quiz pipeline that saves attempt, awards coins, checks badges, and triggers notifications—with failure recovery
- **Intelligent Decision Engine (A02)**: Rule-based system that analyzes quiz performance and recommends personalized learning paths

---

## ⚙️ Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

### 1. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root with your Supabase credentials (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a font family from Vercel.

### Deploying

The easiest way to deploy is the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), from the creators of Next.js. See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

### Learn More

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Next.js GitHub repository](https://github.com/vercel/next.js) - feedback and contributions are welcome!

---

## 📊 Competition Details

- **Competition**: Hack the Vibe 2026 (Code-ArenaX Solo Vibe Coding Championship)
- **Track**: Educational Problem Solver
- **Advanced Challenges Implemented**:
  - **A07**: Automated Multi-Step Workflow (Event-driven automation with recovery logic)
  - **A02**: Intelligent Decisions & Optimization (Rule-based recommendations)

---

## 🔐 Security & Best Practices

- **Row Level Security (RLS)**: Supabase RLS policies ensure students can only access their own data
- **Environment Variables**: All secrets (API keys, database URLs) stored in `.env` files, never committed to Git
- **Input Validation**: Zod schemas validate all user inputs before database operations
- **Duplicate Prevention**: Server-side checks prevent duplicate quiz submissions
- **Audit Logging**: Failed operations are logged for debugging and recovery

---

## 📖 Learning Outcomes

Building ByteBucks demonstrated my ability to:
- Design and implement complex business logic (rule-based progression, adaptive recommendations)
- Build production-ready full-stack applications with modern tools (Next.js, TypeScript, Supabase)
- Handle edge cases and failure scenarios gracefully (transaction rollback, error logging)
- Create accessible, responsive UIs following WCAG guidelines
- Deploy and document applications for production use

This project serves as a portfolio piece demonstrating my readiness for full-stack development roles and my passion for educational technology.

---

## 🤝 Contributing

This project was built for the Hack the Vibe 2026 competition. While it's not open for contributions, feel free to explore the code, learn from the implementation, or reach out with questions!

---

## 📄 License

This project was created for educational purposes as part of the Hack the Vibe 2026 competition.

---

**Built with ❤️ by Hosni Rabbani**