
# IntelEJ Medical Center - Healthcare Management System

![IntelEJ Logo](public/lovable-uploads/43612f72-7738-4bf9-9695-426ddabfecaf.png)

## 🏥 What is IntelEJ Medical Center?

**IntelEJ Medical Center** is a modern healthcare management system that helps hospitals manage patients, appointments, and medical records. It features **Al-Rāzī**, an AI medical assistant that can answer health questions in Arabic, English, and French.

---

## 🎯 What You'll Learn Building This Project

### **1. Frontend Web Development**
- **HTML/CSS**: Structure and styling of web pages
- **JavaScript**: Programming logic and interactivity
- **TypeScript**: Type-safe JavaScript for better code quality
- **React**: Modern library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework for fast styling

### **2. Database Management**
- **SQL**: Database query language for storing and retrieving data
- **MySQL**: Relational database for production applications
- **IndexedDB**: Browser-based database for offline functionality

### **3. AI Integration**
- **Ollama**: Local AI model runner
- **MedLlama2**: Medical AI language model
- **API Integration**: Connecting frontend to AI services

### **4. Modern Development Tools**
- **Git**: Version control system
- **Vite**: Fast build tool for development
- **Node.js**: JavaScript runtime for development tools

---

## 🚀 How to Run This Project

### **Step 1: Install Node.js**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Install version 18 or higher
3. Verify installation: Open terminal and type `node --version`

### **Step 2: Download the Project**
```bash
# If you have Git installed
git clone [your-project-url]
cd intelej-medical-center

# Or download as ZIP and extract
```

### **Step 3: Install Dependencies**
```bash
# Open terminal in project folder
npm install
```

### **Step 4: Start the Development Server**
```bash
npm run dev
```
The website will open at `http://localhost:5173`

---

## 🤖 Setting Up Al-Rāzī AI Assistant

Al-Rāzī is our medical AI assistant that runs completely on your computer (no internet required after setup).

### **For Windows:**

#### **Step 1: Download Ollama**
1. Go to [ollama.com/download](https://ollama.com/download)
2. Download the Windows installer
3. Run the installer as Administrator
4. Follow the installation steps

#### **Step 2: Install the Medical AI Model**
```cmd
# Open Command Prompt (Press Win + R, type 'cmd', press Enter)
ollama pull medllama2
```
**Note**: This downloads about 4-7GB. Make sure you have good internet and enough storage space.

#### **Step 3: Start Ollama**
```cmd
# In Command Prompt
ollama serve
```
**Keep this window open** while using the AI assistant.

#### **Step 4: Test the AI**
```cmd
# Open a new Command Prompt window
ollama run medllama2 "Hello, I am Al-Rāzī"
```

### **For Mac:**
```bash
# Install Ollama
brew install ollama

# Start Ollama service
ollama serve

# In a new terminal, install the medical model
ollama pull medllama2
```

### **For Linux:**
```bash
# Install Ollama
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama
ollama serve

# Install medical model
ollama pull medllama2
```

---

## 🗄️ Setting Up MySQL Database (Optional)

For production use, you can connect a MySQL database instead of using browser storage.

### **Step 1: Install MySQL**

#### **Windows:**
1. Download MySQL Installer from [dev.mysql.com](https://dev.mysql.com/downloads/installer/)
2. Choose "Server only" installation
3. Set a root password (remember this!)
4. Complete the installation

#### **Mac:**
```bash
# Install using Homebrew
brew install mysql

# Start MySQL
brew services start mysql

# Secure installation
mysql_secure_installation
```

#### **Linux (Ubuntu):**
```bash
# Install MySQL
sudo apt update
sudo apt install mysql-server

# Secure installation
sudo mysql_secure_installation
```

### **Step 2: Create the Database**
```sql
# Open MySQL Command Line Client
mysql -u root -p

# Create database
CREATE DATABASE intelejmedical;
USE intelejmedical;

# Create users table
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

# Create appointments table
CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36) NOT NULL,
  patientName VARCHAR(100) NOT NULL,
  doctorId VARCHAR(36) NOT NULL,
  doctorName VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Insert sample data
INSERT INTO users (id, name, email, password, role) VALUES 
('doc1', 'Dr. Sarah Johnson', 'doctor@intelejmedical.com', 'password123', 'doctor'),
('pat1', 'Ahmed Al-Mahmoud', 'patient@intelejmedical.com', 'password123', 'patient');
```

### **Step 3: Create Backend API**
```bash
# Create new folder for backend
mkdir intelej-backend
cd intelej-backend

# Initialize Node.js project
npm init -y

# Install required packages
npm install express cors mysql2 dotenv
```

Create `server.js`:
```javascript
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_mysql_password_here',
  database: 'intelejmedical',
  waitForConnections: true,
  connectionLimit: 10
});

// Test endpoint
app.get('/api/health', async (req, res) => {
  try {
    const [result] = await pool.query('SELECT 1 as healthy');
    res.json({ status: 'Connected to MySQL', data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all appointments
app.get('/api/appointments', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM appointments ORDER BY date DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
```

### **Step 4: Start the Backend**
```bash
# In the intelej-backend folder
node server.js
```

---

## 🌐 Languages Supported

The system supports three languages:
- **English** (Default)
- **Arabic (العربية)** - Full right-to-left support
- **French (Français)**

Users can switch languages using the globe icon in the header.

---

## 🔒 Security & Privacy

- **Local-First**: All data stays on your computer by default
- **No Data Transmission**: AI runs locally, no internet required
- **Encrypted Storage**: All sensitive data is encrypted
- **HIPAA-Ready**: Built with medical privacy standards in mind

---

## 📱 System Requirements

### **Minimum Requirements:**
- **OS**: Windows 10, macOS 10.15, or Linux Ubuntu 18.04+
- **RAM**: 8GB (16GB recommended for AI features)
- **Storage**: 10GB free space
- **Internet**: Required for initial setup only

### **Browser Support:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 🎓 Learning Path Recommendation

### **Beginner (1-2 months):**
1. Learn HTML & CSS basics
2. Learn JavaScript fundamentals
3. Understand how websites work
4. Practice with simple projects

### **Intermediate (2-3 months):**
1. Learn React fundamentals
2. Understand TypeScript basics
3. Learn about databases (SQL)
4. Build small web applications

### **Advanced (3-6 months):**
1. Master React and TypeScript
2. Learn backend development with Node.js
3. Understand AI integration
4. Build full-stack applications

### **Recommended Resources:**
- **Free**: freeCodeCamp, MDN Web Docs, W3Schools
- **Paid**: Udemy, Coursera, Pluralsight
- **Practice**: CodePen, GitHub, personal projects

---

## 🚀 Deployment Options

### **Option 1: Local Deployment**
- Run on your computer
- Access via `localhost:5173`
- Perfect for testing and development

### **Option 2: Cloud Deployment**
- Deploy to Vercel, Netlify, or similar
- Available worldwide via internet
- Requires additional setup for database

### **Option 3: Hospital Server**
- Deploy on hospital's internal network
- Secure and private
- Requires IT support for setup

---

## 🤝 Getting Help

### **Common Issues:**
- **AI not working**: Make sure Ollama is running (`ollama serve`)
- **Database errors**: Check MySQL is installed and running
- **Build errors**: Delete `node_modules` folder and run `npm install` again

### **Support Resources:**
- **Documentation**: Check the project files for examples
- **Community**: Search online forums like Stack Overflow
- **YouTube**: Watch tutorial videos for React and Node.js

---

## 📄 Project Structure

```
intelej-medical-center/
├── src/                    # Main source code
│   ├── components/         # Reusable UI components
│   ├── pages/             # Website pages
│   ├── contexts/          # App-wide state management
│   └── services/          # Database and AI connections
├── public/                # Static files (images, etc.)
├── package.json           # Project dependencies
└── README.md             # This file
```

---

## 🎯 Future Enhancements

- Add video calling for telemedicine
- Implement electronic prescriptions
- Add medical record scanning
- Mobile app development
- Integration with hospital equipment

---

**Made with ❤️ for better healthcare** | **IntelEJ Medical Center © 2024**

---

### 📞 Need Help?

If you encounter any issues:
1. Check this README file thoroughly
2. Search for error messages online
3. Ask in programming communities
4. Review the project code for examples

**Remember**: Learning to code takes time and practice. Don't give up! 🚀
