
# Welcome to Intelej Hosp

## Project info

**URL**: https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de

## Technologies Used

This healthcare application is built using a modern tech stack:

### Frontend Technologies
- **TypeScript**: Strongly typed programming language that builds on JavaScript
- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality UI components built with Radix UI and Tailwind CSS
- **React Router**: Library for routing in React applications
- **React Query**: Data fetching and state management library
- **Lucide Icons**: Beautiful open source icons
- **Recharts**: Responsive charting library for React

### Backend Technologies
- **IndexedDB**: Browser-based database for local storage
- **MedLlama**: Specialized medical AI model for healthcare assistance
- **MySQL** (optional): Relational database for persistent storage

### Development Tools
- **Vite**: Fast frontend build tool
- **Node.js**: JavaScript runtime for building the application
- **npm**: Package manager for JavaScript
- **ESLint**: JavaScript linting utility
- **TypeScript**: Type system for JavaScript

### Languages Used
- **TypeScript/JavaScript**: Core programming language
- **HTML5**: Markup language for structuring web content
- **CSS3**: Styling language for design
- **SQL**: Database query language (when using MySQL)

## Project Structure Analysis

Here's a breakdown of the key files and directories in the project:

### Core Application Files
- `src/main.tsx` (TypeScript/React): Application entry point that sets up React with providers
- `src/App.tsx` (TypeScript/React): Main application component defining routes
- `src/index.css` (CSS/Tailwind): Global styles using Tailwind CSS
- `vite.config.ts` (TypeScript): Vite configuration for build tools

### Components
- `src/components/` (TypeScript/React): Reusable UI components
  - `Header.tsx`: Navigation header component
  - `Footer.tsx`: Page footer component
  - `WelcomePopup.tsx`: Apple-style popup with project credits
  - `ui/`: shadcn UI components (buttons, cards, dialogs, etc.)

### Pages
- `src/pages/` (TypeScript/React): Application pages
  - `Index.tsx`: Main entry page with welcome popup
  - `LandingPage.tsx`: Homepage with Quran verse and features
  - `LoginPage.tsx`: Authentication page
  - `patient/`: Patient-specific pages (dashboard, appointments, AI chat)
  - `doctor/`: Doctor-specific pages (dashboard, patient list)

### Contexts and Hooks
- `src/contexts/` (TypeScript/React): Global state management
  - `AuthContext.tsx`: Authentication state management
  - `LanguageContext.tsx`: Internationalization support (English/Arabic)
  - `ThemeContext.tsx`: Theme management (light/dark mode)
- `src/hooks/` (TypeScript/React): Custom React hooks
  - `use-welcome-styles.ts`: Dynamic styling for welcome popup
  - `use-mobile.tsx`: Responsive design utilities

### Services
- `src/services/` (TypeScript): Backend service integrations
  - `localDatabase.ts`: IndexedDB implementation for local storage
  - `mysqlAdapter.ts`: MySQL database adapter (optional)
  - `ollamaService.ts`: Integration with AI model

## Setting up MedLlama for the AI Health Assistant

MedLlama is a specialized large language model fine-tuned for medical domain knowledge. To integrate MedLlama with this application:

### 1. Install Ollama

First, you need to install Ollama, which is a framework for running LLMs locally:

#### Windows
1. Download and install Ollama from [the official website](https://ollama.com/download/windows)
2. Run the installer and follow the instructions

#### macOS
1. Download and install Ollama from [the official website](https://ollama.com/download/mac)
2. Or use Homebrew: `brew install ollama`

#### Linux
1. Run the following command:
```sh
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull the MedLlama Model

After installing Ollama:

1. Open a terminal/command prompt
2. Run the following command to download MedLlama:
```sh
ollama pull medllama
```
3. Wait for the download to complete (approximately 4GB)

### 3. Configure the Application to Use MedLlama

To configure the application to use MedLlama:

1. Open `src/services/ollamaService.ts` and update the model name from "phi" to "medllama":

```typescript
// Example modification
const response = await fetch("http://localhost:11434/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "medllama", // Changed from phi to medllama
    prompt: message,
    stream: false,
  }),
});
```

### 4. Start the Ollama Service

1. Make sure Ollama is running in the background:
   - **Windows**: It should start automatically after installation
   - **macOS/Linux**: Run `ollama serve` in a terminal window

2. Start the Intelej Hosp application
3. Navigate to the Patient Dashboard
4. Use the AI Chat Assistant to send a medical query
5. The response will be generated locally using MedLlama's specialized medical knowledge

### 5. Optimizing MedLlama Responses

To get the best results from MedLlama:

1. Add medical context to your prompts
2. Be specific about symptoms or conditions
3. Ask one question at a time
4. Include relevant patient information when applicable

## How to Rebuild This Project From Scratch

If you want to rebuild this project yourself, here's a step-by-step guide:

### 1. Setup Development Environment

1. Install Node.js and npm from [nodejs.org](https://nodejs.org/)
2. Install Git from [git-scm.com](https://git-scm.com/)
3. Install a code editor like VS Code from [code.visualstudio.com](https://code.visualstudio.com/)

### 2. Create a New React Project with Vite

```bash
# Create a new project with Vite
npm create vite@latest intelej-hosp -- --template react-ts

# Navigate to the project directory
cd intelej-hosp

# Install dependencies
npm install
```

### 3. Add Required Dependencies

```bash
# UI and styling
npm install tailwindcss postcss autoprefixer
npm install @radix-ui/react-dialog @radix-ui/react-toast # and other Radix UI components
npm install lucide-react recharts date-fns

# Routing and state management
npm install react-router-dom @tanstack/react-query

# Utility libraries
npm install uuid class-variance-authority clsx tailwind-merge zod

# Initialize Tailwind CSS
npx tailwindcss init -p
```

### 4. Project Structure Setup

Create the following directory structure:

```
src/
├── components/
│   ├── ui/
│   ├── Header.tsx
│   └── Footer.tsx
├── contexts/
│   ├── AuthContext.tsx
│   ├── LanguageContext.tsx
│   └── ThemeContext.tsx
├── hooks/
│   └── use-mobile.tsx
├── pages/
│   ├── patient/
│   ├── doctor/
│   ├── Index.tsx
│   ├── LandingPage.tsx
│   └── LoginPage.tsx
├── services/
│   ├── localDatabase.ts
│   ├── mysqlAdapter.ts
│   └── ollamaService.ts
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

### 5. Learning Path for Each Technology

To master the technologies used in this project:

#### TypeScript & React
1. Learn JavaScript basics (variables, functions, objects)
2. Learn TypeScript fundamentals (types, interfaces, generics)
3. Learn React basics (components, props, state, hooks)
4. Study React's advanced patterns (context, custom hooks)
5. Learn TypeScript with React (typing props, hooks, events)

#### CSS & Tailwind
1. Learn CSS fundamentals (selectors, properties, layouts)
2. Learn Flexbox and Grid layout systems
3. Learn Tailwind CSS utility-first approach
4. Study responsive design principles
5. Master dark mode implementation

#### Backend & Database
1. Learn IndexedDB basics for browser storage
2. Understand RESTful API concepts
3. Learn basic SQL for database operations
4. Study authentication and security principles
5. Learn about AI model integration

### 6. Resources for Learning

- **TypeScript**: [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- **React**: [React Documentation](https://react.dev/)
- **Tailwind CSS**: [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- **React Router**: [React Router Documentation](https://reactrouter.com/en/main)
- **React Query**: [TanStack Query Documentation](https://tanstack.com/query/latest)
- **IndexedDB**: [MDN IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
