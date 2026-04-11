# Porokh

Porokh is a modern, AI-assisted online examination and evaluation platform designed for educational institutions and corporate training. It provides a comprehensive suite of tools for examiners to create, proctor, and grade exams, while offering examinees a secure and intuitive testing environment.

## 🚀 Key Features

- **Virtual Classrooms**: Organize assessments into "Rooms" with unique join codes and role-based access control.
- **Advanced Exam Builder**: Create questions using a Tiptap-powered rich text editor with native LaTeX support for math formulas.
- **AI-Powered Grading**: Automatically evaluate descriptive answers against custom rubrics using Google Gemini AI with vision support.
- **Robust Proctoring**: Monitor tab switches, track text pasting, and log time spent on individual questions to ensure integrity.
- **Automated Collection**: Submissions are automatically collected when time limits or global end times are reached.
- **Real-time Analytics**: Track class performance with metrics like average, median, and question-specific difficulty ratings.
- **Secure Authentication**: Robust user management and secure sessions powered by Better Auth.
- **Ownership & Collaboration**: Transfer room ownership or add multiple examiners to collaborate on grading.
- **Selective Publishing**: Control precisely when results and individual grades are visible to examinees.
- **Export Capabilities**: Export exam results and submission data to CSV for external reporting.

## 🛠️ Tech Stack

- **Next.js**: Full-stack React framework for App Router and Server Actions.
- **TypeScript**: Static typing for safer and more maintainable code.
- **PostgreSQL**: Relational database for core application data.
- **Prisma**: Type-safe ORM for database management.
- **Better Auth**: Authentication and session management.
- **AI SDK**: Tooling for Google Gemini AI integration.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Shadcn UI**: Pre-built accessible UI components.
- **Tiptap**: Rich text editor for questions and answers.
- **KaTeX**: LaTeX math rendering engine.
- **Zod**: Data validation and type inference.
- **Nodemailer**: Transactional email delivery.

## 🏁 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL instance
- Google Generative AI API Key
- Gmail account (for SMTP/Nodemailer)

### Installation

1. **Clone & Install**:

   ```bash
   git clone https://github.com/your-username/porokh.git
   cd porokh
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/porokh"
   BETTER_AUTH_SECRET="your-secret-here"
   BETTER_AUTH_URL="http://localhost:3000"
   GMAIL_USER="your-email@gmail.com"
   GMAIL_APP_PASSWORD="your-app-password"
   GOOGLE_GENERATIVE_AI_API_KEY="your-gemini-key"
   ```

3. **Database Sync**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run**:
   ```bash
   npm run dev
   ```
