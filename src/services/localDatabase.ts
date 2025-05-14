
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'patient' | 'doctor';
  phoneNumber?: string;
  avatar?: string;
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhoneNumber?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  reason?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface Message {
  id: string;
  userId: string;
  content: string;
  isAi: boolean;
  timestamp: Date;
}

// Initialize the database
export const initializeLocalDatabase = async () => {
  // Check if the database has been initialized
  if (!localStorage.getItem('db_initialized')) {
    console.log('Initializing local database...');

    // Create default users
    const users: User[] = [
      {
        id: 'd1',
        name: 'Dr. Sarah Smith',
        email: 'doctor@example.com',
        password: 'password',
        role: 'doctor',
        avatar: '/profile-placeholder.png'
      },
      {
        id: 'p1',
        name: 'John Doe',
        email: 'patient@example.com',
        password: 'password',
        role: 'patient',
        phoneNumber: '555-123-4567',
        avatar: '/profile-placeholder.png'
      },
      {
        id: 'd2',
        name: 'Dr. Ahmed Al-Mansoori',
        email: 'doctor2@example.com',
        password: 'password',
        role: 'doctor',
        avatar: '/profile-placeholder.png'
      }
    ];

    // Create default appointments
    const appointments: Appointment[] = [
      {
        id: 'a1',
        patientId: 'p1',
        patientName: 'John Doe',
        patientPhoneNumber: '555-123-4567',
        doctorId: 'd1',
        doctorName: 'Dr. Sarah Smith',
        date: '2025-05-20',
        time: '10:00',
        reason: 'Regular checkup',
        status: 'scheduled'
      }
    ];

    // Save to local storage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('messages', JSON.stringify([]));
    localStorage.setItem('db_initialized', 'true');

    console.log('Database initialized with default data');
  } else {
    console.log('Database already initialized');
    
    // Check if we need to update the appointment structure to include patient names
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    let updated = false;
    
    for (let i = 0; i < appointments.length; i++) {
      // Add patient name if missing
      if (!appointments[i].patientName) {
        const patient = users.find((u: User) => u.id === appointments[i].patientId);
        if (patient) {
          appointments[i].patientName = patient.name;
          updated = true;
        }
      }
      
      // Add doctor name if missing
      if (!appointments[i].doctorName) {
        const doctor = users.find((u: User) => u.id === appointments[i].doctorId);
        if (doctor) {
          appointments[i].doctorName = doctor.name;
          updated = true;
        }
      }
      
      // Ensure all users have an avatar
      users.forEach((user: User) => {
        if (!user.avatar) {
          user.avatar = '/profile-placeholder.png';
          updated = true;
        }
      });
    }
    
    if (updated) {
      localStorage.setItem('appointments', JSON.stringify(appointments));
      localStorage.setItem('users', JSON.stringify(users));
      console.log('Updated appointment structure to include names');
    }
  }
};

// User Management
export const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem('users') || '[]');
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const createUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: uuidv4()
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | undefined => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  
  if (index !== -1) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem('users', JSON.stringify(users));
    return users[index];
  }
  return undefined;
};

export const deleteUser = (id: string): boolean => {
  const users = getUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (users.length !== filteredUsers.length) {
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    return true;
  }
  return false;
};

// Appointment Management
export const getAppointments = (): Appointment[] => {
  return JSON.parse(localStorage.getItem('appointments') || '[]');
};

export const getAppointmentsByPatientId = (patientId: string): Appointment[] => {
  const appointments = getAppointments();
  return appointments.filter(appointment => appointment.patientId === patientId);
};

export const getAppointmentsByDoctorId = (doctorId: string): Appointment[] => {
  const appointments = getAppointments();
  return appointments.filter(appointment => appointment.doctorId === doctorId);
};

export const createAppointment = (appointment: Omit<Appointment, 'id' | 'patientName' | 'doctorName'>): Appointment => {
  const appointments = getAppointments();
  const users = getUsers();
  
  // Get patient name
  const patient = users.find(user => user.id === appointment.patientId);
  const patientName = patient ? patient.name : 'Unknown Patient';
  const patientPhoneNumber = patient?.phoneNumber;
  
  // Get doctor name
  const doctor = users.find(user => user.id === appointment.doctorId);
  const doctorName = doctor ? doctor.name : 'Unknown Doctor';
  
  const newAppointment: Appointment = {
    ...appointment,
    id: uuidv4(),
    patientName,
    patientPhoneNumber,
    doctorName,
  };
  
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));
  return newAppointment;
};

export const updateAppointment = (id: string, updates: Partial<Appointment>): Appointment | undefined => {
  const appointments = getAppointments();
  const index = appointments.findIndex(appointment => appointment.id === id);
  
  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    localStorage.setItem('appointments', JSON.stringify(appointments));
    return appointments[index];
  }
  return undefined;
};

export const deleteAppointment = (id: string): boolean => {
  const appointments = getAppointments();
  const filteredAppointments = appointments.filter(appointment => appointment.id !== id);
  
  if (appointments.length !== filteredAppointments.length) {
    localStorage.setItem('appointments', JSON.stringify(filteredAppointments));
    return true;
  }
  return false;
};

// Message Management
export const getMessages = (): Message[] => {
  return JSON.parse(localStorage.getItem('messages') || '[]');
};

export const getMessagesByUserId = (userId: string): Message[] => {
  const messages = getMessages();
  return messages.filter(message => message.userId === userId);
};

export const createMessage = (message: Omit<Message, 'id'>): Message => {
  const messages = getMessages();
  const newMessage: Message = {
    ...message,
    id: uuidv4()
  };
  messages.push(newMessage);
  localStorage.setItem('messages', JSON.stringify(messages));
  return newMessage;
};

export const deleteAllMessagesForUser = (userId: string): boolean => {
  const messages = getMessages();
  const filteredMessages = messages.filter(message => message.userId !== userId);
  
  if (messages.length !== filteredMessages.length) {
    localStorage.setItem('messages', JSON.stringify(filteredMessages));
    return true;
  }
  return false;
};

// Authentication
export const authenticateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};
