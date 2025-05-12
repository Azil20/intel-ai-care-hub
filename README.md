
# Welcome to your Lovable project

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

### 2. Create Database for IntelEJ Hospital

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

**Edit your preferred IDE**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/b93f38e7-cdb4-4939-9d45-efab4d38b1de) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
