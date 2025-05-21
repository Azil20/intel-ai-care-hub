
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

## Setting Up MySQL for Intelej Hosp

The application by default uses browser-based IndexedDB for local data storage. For production or more robust development, you can set up a MySQL database. Follow these steps to implement MySQL support:

### 1. Install MySQL Server

#### Windows
1. Download MySQL Installer from [MySQL official website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and select "MySQL Server" during installation
3. Follow the installation wizard and setup root password
4. Make sure the service is running after installation

#### macOS
1. Install with Homebrew: `brew install mysql`
2. Start MySQL service: `brew services start mysql`
3. Set root password: `mysql_secure_installation`

#### Linux (Ubuntu/Debian)
```sh
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 2. Create Database and Tables

1. Access MySQL command line:
```sh
mysql -u root -p
```

2. Create a new database for the application:
```sql
CREATE DATABASE intelejhosp;
USE intelejhosp;
```

3. Create necessary tables for the application:
```sql
-- Users table
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('patient', 'doctor') NOT NULL,
  phoneNumber VARCHAR(20),
  avatar VARCHAR(255)
);

-- Appointments table
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36) NOT NULL,
  patientName VARCHAR(100) NOT NULL,
  patientPhoneNumber VARCHAR(20),
  doctorId VARCHAR(36) NOT NULL,
  doctorName VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  status ENUM('scheduled', 'completed', 'cancelled') NOT NULL,
  FOREIGN KEY (patientId) REFERENCES users(id),
  FOREIGN KEY (doctorId) REFERENCES users(id)
);

-- Messages table
CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  isAi BOOLEAN NOT NULL,
  timestamp DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

4. Add sample data (optional):
```sql
-- Insert sample doctor
INSERT INTO users (id, name, email, password, role, avatar)
VALUES ('d1', 'Dr. Sarah Smith', 'doctor@example.com', 'password', 'doctor', '/profile-placeholder.png');

-- Insert sample patient
INSERT INTO users (id, name, email, password, role, phoneNumber, avatar)
VALUES ('p1', 'John Doe', 'patient@example.com', 'password', 'patient', '555-123-4567', '/profile-placeholder.png');
```

### 3. Set Up Node.js Backend (Required for MySQL Connectivity)

Since browsers cannot connect directly to MySQL, you need a backend service:

1. Create a new Node.js project for your backend:
```sh
mkdir intelejhosp-backend
cd intelejhosp-backend
npm init -y
npm install express cors mysql2 dotenv
```

2. Create a `.env` file for database credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=intelejhosp
PORT=3001
```

3. Create a `server.js` file:
```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
app.get('/api/test', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1+1 as result');
    res.json({ message: 'Database connection successful', result: result[0] });
  } catch (error) {
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// API endpoint for users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, phoneNumber, avatar FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// API endpoint for appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

4. Start your backend:
```sh
node server.js
```

### 4. Update Frontend to Use MySQL

1. Update the `src/services/mysqlAdapter.ts` file with proper connection and query methods
2. Create a toggle to switch between IndexedDB and MySQL in your application settings
3. Update your frontend API calls to use the MySQL adapter

### 5. Integrating MySQL with the Frontend

To use MySQL in your frontend application:

1. Open your project and modify the data service layer to use the MySQL adapter:

```typescript
import { setupMySQLConnection, executeMySQLQuery } from './mysqlAdapter';

// Initialize MySQL connection
const mysqlConnection = setupMySQLConnection({
  host: 'localhost',
  port: 3001, // This is your Node.js backend port, not MySQL port
  username: 'root',
  password: 'password',
  database: 'intelejhosp'
});

// Example function to fetch users from MySQL
export const fetchUsersFromMySQL = async () => {
  const response = await fetch('http://localhost:3001/api/users');
  if (!response.ok) {
    throw new Error('Failed to fetch users from MySQL');
  }
  return await response.json();
};
```

2. Create a toggle between storage types in your application settings:

```typescript
// In a settings context or component
const [storageType, setStorageType] = useState('indexeddb'); // or 'mysql'

// Function to switch storage types
const switchToMySQL = () => {
  setStorageType('mysql');
  // Initialize MySQL connection here
};

const switchToIndexedDB = () => {
  setStorageType('indexeddb');
  // Go back to using IndexedDB
};
```

### 6. Data Migration Tool

For migrating data from IndexedDB to MySQL:

1. Create a migration utility:
```typescript
import * as localDB from './localDatabase';
import { migrateToMySQL } from './mysqlAdapter';

// Migration function
export const migrateDataToMySQL = async () => {
  // 1. Get all data from IndexedDB
  const users = localDB.getUsers();
  const appointments = localDB.getAppointments();
  const messages = localDB.getMessages();
  
  // 2. Format data for MySQL insertion
  // This would be handled by your backend
  
  // 3. Call the migration function
  const result = await migrateToMySQL();
  
  return result;
};
```

2. Add a migration button in your application settings
3. When clicked, execute the migration process

### 7. Testing MySQL Integration

To verify your MySQL setup is working:

1. Start your Node.js backend server
2. Open your application and switch to MySQL storage
3. Attempt to load user data or create a new appointment
4. Check your MySQL database to confirm the data was stored

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
