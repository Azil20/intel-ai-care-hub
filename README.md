
# Welcome to Intelej Hosp

## Project info

**URL**: https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de

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

## Setting up Ollama with Phi Model

Intelej Hosp uses [Ollama](https://ollama.com/) for local AI inference with Microsoft's Phi model. This allows the AI chat assistant to work completely locally without sending data to external services.

### 1. Install Ollama

#### Windows
1. Download and install Ollama from [the official website](https://ollama.com/download/windows)
2. Follow the installation instructions

#### macOS
1. Download and install Ollama from [the official website](https://ollama.com/download/mac)
2. Or use Homebrew: `brew install ollama`

#### Linux
1. Run the following command:
```sh
curl -fsSL https://ollama.com/install.sh | sh
```

### 2. Pull the Phi Model

After installing Ollama:

1. Open a terminal/command prompt
2. Run the following command to download Microsoft's Phi model:
```sh
ollama pull phi
```
3. Wait for the download to complete (approx. 1.8GB)

### 3. Start the Ollama Service

Make sure Ollama is running in the background:

- **Windows**: It should start automatically after installation
- **macOS/Linux**: Run `ollama serve` in a terminal window

### 4. Test the Connection

Once Ollama is running with the Phi model:

1. Start the Intelej Hosp application
2. Navigate to the Patient Dashboard
3. Use the AI Chat Assistant to send a test message
4. You should receive a response generated locally by the Phi model

### 5. Troubleshooting

If you experience issues:
- Ensure Ollama is running (look for the Ollama icon in your system tray)
- Verify the Phi model was downloaded successfully with `ollama list`
- Check that Ollama is listening on the default port: http://localhost:11434
- Look at the browser's console logs for any connection errors

## Setting up MySQL Database Locally

To use MySQL locally with this application, follow these steps:

### 1. Install MySQL Server

#### Windows
1. Download MySQL Installer from [MySQL official website](https://dev.mysql.com/downloads/installer/)
2. Run the installer and follow the installation wizard
3. Select "Developer Default" or "Server only" option
4. Complete the setup and make note of your root password

#### macOS
1. Using Homebrew: `brew install mysql`
2. Start MySQL: `brew services start mysql`
3. Secure the installation: `mysql_secure_installation`

#### Linux (Ubuntu/Debian)
```sh
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### 2. Create Database for Intelej Hosp

1. Log in to MySQL:
```sh
mysql -u root -p
```

2. Create a database:
```sql
CREATE DATABASE intelej_hospital;
```

3. Create a user for the application:
```sql
CREATE USER 'intelej_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON intelej_hospital.* TO 'intelej_user'@'localhost';
FLUSH PRIVILEGES;
```

4. Create necessary tables:
```sql
USE intelej_hospital;

CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient', 'doctor') NOT NULL
);

CREATE TABLE appointments (
  id VARCHAR(36) PRIMARY KEY,
  patientId VARCHAR(36) NOT NULL,
  doctorId VARCHAR(36) NOT NULL,
  date DATETIME NOT NULL,
  reason TEXT,
  status ENUM('scheduled', 'completed', 'cancelled') DEFAULT 'scheduled',
  FOREIGN KEY (patientId) REFERENCES users(id),
  FOREIGN KEY (doctorId) REFERENCES users(id)
);

CREATE TABLE messages (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  content TEXT NOT NULL,
  isAi BOOLEAN DEFAULT FALSE,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Insert default users
INSERT INTO users (id, name, email, password, role) VALUES
('d1', 'Dr. Sarah Smith', 'doctor@example.com', 'password', 'doctor'),
('p1', 'John Doe', 'patient@example.com', 'password', 'patient');
```

### 3. Configure Application for MySQL

Currently, the application uses IndexedDB for local storage. To switch to MySQL, you'll need to:

1. Install a MySQL client for Node.js/TypeScript
2. Update the database service layer

Note: In a production environment, you should never store passwords as plain text. Always use proper password hashing algorithms.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Ollama (for local AI inference)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
