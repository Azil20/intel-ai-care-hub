
# Intelej Hosp - Modern Healthcare Management System

![Intelej Hosp Logo](public/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png)

## 🏥 Project Overview

**Intelej Hosp** is a modern, multilingual healthcare management system designed for both patients and healthcare providers. The system features **Al-Rāzī (الرازي)**, our advanced AI medical assistant named after the legendary Persian-Arab doctor Abu Bakr al-Razi.

**Live Demo**: [https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de](https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de)

---

## 🤖 Meet Al-Rāzī - Our AI Medical Assistant

**Al-Rāzī (الرازي)** is our specialized medical AI assistant, named after Abu Bakr Muhammad ibn Zakariya al-Razi (854–925 CE), the legendary Persian-Arab physician, alchemist, and philosopher who made groundbreaking contributions to medicine.

### Features of Al-Rāzī:
- **Powered by MedLlama2**: Advanced medical language model specialized for healthcare
- **Multilingual Support**: Communicates in Arabic, English, and French
- **Local Privacy**: Runs completely locally on your machine - no data leaves your device
- **Medical Expertise**: Trained on medical literature and clinical guidelines
- **24/7 Availability**: Always ready to assist with medical questions

---

## 🛠️ Programming Languages & Technologies Used

### **Frontend Technologies**
| Language/Framework | Version | Purpose |
|-------------------|---------|---------|
| **TypeScript** | ^5.0.0 | Main programming language for type safety |
| **JavaScript (ES6+)** | Native | Core scripting language |
| **HTML5** | Native | Markup structure |
| **CSS3** | Native | Styling and animations |
| **React** | ^18.3.1 | Frontend framework for UI components |
| **Tailwind CSS** | ^3.0.0 | Utility-first CSS framework |

### **Backend & Data Technologies**
| Technology | Purpose |
|------------|---------|
| **IndexedDB** | Browser-based local database |
| **MySQL** | Optional relational database |
| **Node.js** | Runtime for MySQL backend service |
| **SQL** | Database queries and management |

### **AI & Machine Learning**
| Technology | Purpose |
|------------|---------|
| **MedLlama2** | Medical AI language model |
| **Ollama** | Local LLM inference engine |
| **Python** | AI model training and inference (backend) |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| **Vite** | Fast development build tool |
| **ESLint** | Code linting and quality |
| **Prettier** | Code formatting |
| **Git** | Version control |

---

## 🚀 How to Run the Project Locally

### **Prerequisites**
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **Ollama** for AI functionality
- **MySQL** (optional, for production database)

### **Step 1: Clone the Repository**
```bash
git clone https://github.com/your-username/intelej-hosp.git
cd intelej-hosp
```

### **Step 2: Install Dependencies**
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### **Step 3: Setup Environment**
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Intelej Hosp
VITE_APP_VERSION=1.0.0
VITE_OLLAMA_URL=http://localhost:11434
```

### **Step 4: Start Development Server**
```bash
# Using npm
npm run dev

# Or using yarn
yarn dev
```

The application will be available at: `http://localhost:5173`

---

## 🧠 Setting Up Al-Rāzī AI Assistant (MedLlama2)

### **For Windows 10 Users**

#### **Step 1: Install Ollama**
1. **Download Ollama for Windows**:
   - Visit: [https://ollama.com/download/windows](https://ollama.com/download/windows)
   - Download the Windows installer (.exe file)
   - Run the installer as Administrator
   - Follow the installation wizard

2. **Verify Installation**:
   ```cmd
   # Open Command Prompt (Win + R, type 'cmd')
   ollama --version
   ```

#### **Step 2: Install MedLlama2 Model**
```cmd
# Open Command Prompt as Administrator
ollama pull medllama2
```
**Note**: This will download approximately 4-7GB of data. Ensure you have sufficient internet bandwidth and storage space.

#### **Step 3: Start Ollama Service**
```cmd
# Start Ollama service (run this in Command Prompt)
ollama serve
```
**Keep this terminal window open** - Ollama needs to run continuously for Al-Rāzī to work.

#### **Step 4: Test Al-Rāzī Connection**
```cmd
# In a new Command Prompt window, test the model
ollama run medllama2 "Hello, I am Al-Rāzī"
```

#### **Step 5: Configure Windows Firewall**
1. Open **Windows Security** → **Firewall & network protection**
2. Click **Allow an app through firewall**
3. Find **Ollama** and ensure both **Private** and **Public** are checked
4. If Ollama isn't listed, click **Change Settings** → **Allow another app** → Browse to Ollama installation

#### **Step 6: Verify Integration**
1. Start your Intelej Hosp application: `npm run dev`
2. Navigate to Patient Dashboard → AI Chat Assistant
3. You should see "✅ Al-Rāzī (الرازي) - MedLlama2 AI assistant is available" in the browser console

### **Troubleshooting Al-Rāzī Setup**

| Issue | Solution |
|-------|----------|
| "Command not found: ollama" | Restart Command Prompt or add Ollama to PATH |
| Model download fails | Check internet connection, try `ollama pull medllama2` again |
| Connection refused | Ensure `ollama serve` is running in background |
| Firewall blocking | Configure Windows Firewall as described above |
| Port 11434 in use | Kill process: `netstat -ano \| findstr :11434` then `taskkill /F /PID <PID>` |

---

## 🗄️ MySQL Database Integration (Optional)

### **Windows 10 MySQL Setup**

#### **Step 1: Install MySQL Server**
1. **Download MySQL Installer**:
   - Visit: [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
   - Download **mysql-installer-community-8.0.xx.x.msi**
   - Run installer as Administrator

2. **Configure MySQL**:
   - Choose **Server only** installation
   - Use **Strong Password Encryption**
   - Set root password (remember this!)
   - Configure as **Windows Service** (start automatically)

#### **Step 2: Create Database**
```sql
-- Open MySQL Command Line Client
mysql -u root -p

-- Create the database
CREATE DATABASE intelejhosp;
USE intelejhosp;

-- Create tables
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role ENUM('patient', 'doctor') NOT NULL,
  phoneNumber VARCHAR(20),
  avatar VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (doctorId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  isAi BOOLEAN NOT NULL DEFAULT FALSE,
  timestamp DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO users (id, name, email, password, role, avatar) VALUES 
('doc1', 'Dr. Sarah Johnson', 'doctor@intelejhosp.com', 'securepass123', 'doctor', '/profile-placeholder.png'),
('pat1', 'Ahmed Al-Mahmoud', 'patient@intelejhosp.com', 'securepass123', 'patient', '/profile-placeholder.png');
```

#### **Step 3: Setup Backend API**
```bash
# Create backend directory
mkdir intelej-backend
cd intelej-backend

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors mysql2 dotenv bcryptjs jsonwebtoken
```

#### **Step 4: Create Backend Server**
Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'your_mysql_password',
  database: 'intelejhosp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 as healthy');
    res.json({ status: 'MySQL connected', data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users API
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role, phoneNumber, avatar FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Appointments API
app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments ORDER BY date DESC, time DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📊 MySQL database: intelejhosp`);
});
```

#### **Step 5: Start Backend**
```bash
# In intelej-backend directory
node server.js
```

#### **Step 6: Update Frontend Configuration**
In your main project, update `src/services/mysqlAdapter.ts` to point to your backend:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

---

## 📁 Source Code Analysis Guide

Analyze the files in this **exact order** for optimal understanding:

### **1. Core Application Structure**
```typescript
src/main.tsx                    // Application entry point and providers setup
src/App.tsx                     // Main routing and authentication flow
src/index.css                   // Global styles, themes, and animations
```

### **2. Context Providers (State Management)**
```typescript
src/contexts/AuthContext.tsx    // User authentication and session management
src/contexts/LanguageContext.tsx // Multi-language support (AR/EN/FR)
src/contexts/ThemeContext.tsx   // Dark/Light mode theme switching
```

### **3. Core Pages (User Interface)**
```typescript
src/pages/Index.tsx             // Landing page wrapper component
src/pages/LandingPage.tsx       // Homepage with hero section and features
src/pages/LoginPage.tsx         // Authentication form for users
src/pages/NotFound.tsx          // 404 error page handling
```

### **4. Patient Portal**
```typescript
src/pages/patient/PatientDashboard.tsx    // Patient's main interface
src/pages/patient/AiChatAssistant.tsx     // Al-Rāzī AI chat interface
src/pages/patient/AppointmentBooking.tsx  // Appointment scheduling system
```

### **5. Doctor Portal**
```typescript
src/pages/doctor/DoctorDashboard.tsx      // Doctor's main interface
src/pages/doctor/AppointmentCalendar.tsx  // Doctor's appointment management
src/pages/doctor/PatientList.tsx          // Patient records management
```

### **6. Shared Components**
```typescript
src/components/Header.tsx          // Navigation header with language switcher
src/components/Footer.tsx          // Application footer with links
src/components/ProtectedRoute.tsx  // Route authentication wrapper
src/components/WelcomePopup.tsx    // iOS-style welcome notification
```

### **7. Data Services (Backend Integration)**
```typescript
src/services/localDatabase.ts     // IndexedDB browser storage operations
src/services/mysqlAdapter.ts      // MySQL database connection adapter
src/services/ollamaService.ts     // Al-Rāzī AI integration service
```

### **8. Utility Functions**
```typescript
src/lib/utils.ts               // Helper functions and utilities
src/hooks/use-toast.ts         // Toast notification hook
src/hooks/use-mobile.tsx       // Mobile device detection
```

---

## 🎨 Design System & Colors

### **Modern Calm Color Palette**
- **Primary**: Sage Green (`hsl(142 71% 45%)`) - Calming, medical-inspired
- **Secondary**: Soft Blue (`hsl(210 40% 96%)`) - Professional, trustworthy
- **Accent**: Warm Gray (`hsl(215.4 16.3% 46.9%)`) - Subtle, sophisticated
- **Background**: Pure White / Deep Dark (`hsl(0 0% 100%)` / `hsl(0 0% 3.9%)`)

### **Typography**
- **Primary Font**: Inter, SF Pro Display
- **Arabic Font**: Noto Naskh Arabic, Amiri
- **French Font**: Nunito

---

## 🌐 Multilingual Support

### **Supported Languages**
1. **English** (Default) - Left-to-right (LTR)
2. **Arabic (العربية)** - Right-to-left (RTL) support
3. **French (Français)** - Left-to-right (LTR)

### **Language Features**
- Complete UI translation
- RTL layout support for Arabic
- Al-Rāzī AI responds in user's language
- Cultural adaptations for medical terminology

---

## 🔒 Security Features

- **Local-First**: All medical data stays on your device
- **No Data Transmission**: Al-Rāzī runs locally via Ollama
- **Encrypted Storage**: IndexedDB with encryption
- **Authentication**: Secure login system
- **Privacy Compliant**: HIPAA-ready architecture

---

## 🚀 Performance Features

- **Fast Loading**: Vite-powered development
- **Tree Shaking**: Only used code is bundled
- **Code Splitting**: Pages load on demand
- **Local AI**: No internet required for AI features
- **Responsive Design**: Works on all devices

---

## 📱 Browser Support

- **Chrome**: 90+ (Recommended)
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Abu Bakr al-Razi** - The legendary physician who inspired our AI assistant
- **MedLlama2** - Advanced medical language model
- **Ollama** - Local LLM inference platform
- **React & Tailwind** - Modern web development frameworks

---

## 📞 Support

- **Documentation**: [Lovable Docs](https://docs.lovable.dev/)
- **Community**: [Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Issues**: [GitHub Issues](https://github.com/your-username/intelej-hosp/issues)

---

**Made with ❤️ for better healthcare** | **Intelej Hosp © 2024**
