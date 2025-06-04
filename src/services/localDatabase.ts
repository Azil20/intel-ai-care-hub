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

interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medication: string;
  dosage: string;
  frequency: string;
  date: string;
  notes?: string;
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

    // Create default prescriptions
    const prescriptions: Prescription[] = [
      {
        id: 'pr1',
        patientId: 'p1',
        doctorId: 'd1',
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: '3x daily',
        date: '2025-05-01',
        notes: 'Take with food'
      },
      {
        id: 'pr2',
        patientId: 'p1',
        doctorId: 'd1',
        medication: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'As needed',
        date: '2025-05-01',
        notes: 'For pain relief'
      }
    ];

    // Save to local storage
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('appointments', JSON.stringify(appointments));
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    localStorage.setItem('messages', JSON.stringify([]));
    localStorage.setItem('db_initialized', 'true');

    console.log('Database initialized with default data');
  } else {
    console.log('Database already initialized');
    
    // Check if we need to add prescriptions table
    if (!localStorage.getItem('prescriptions')) {
      const prescriptions: Prescription[] = [
        {
          id: 'pr1',
          patientId: 'p1',
          doctorId: 'd1',
          medication: 'Amoxicillin',
          dosage: '500mg',
          frequency: '3x daily',
          date: '2025-05-01',
          notes: 'Take with food'
        },
        {
          id: 'pr2',
          patientId: 'p1',
          doctorId: 'd1',
          medication: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'As needed',
          date: '2025-05-01',
          notes: 'For pain relief'
        }
      ];
      localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
      console.log('Added prescriptions table to existing database');
    }
    
    // Check if we need to update the appointment structure to include names
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
    id: uuidv4(),
    avatar: user.avatar || '/profile-placeholder.png'
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  console.log('New user created and added to database:', newUser);
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

// Prescription Management
export const getPrescriptions = (): Prescription[] => {
  return JSON.parse(localStorage.getItem('prescriptions') || '[]');
};

export const getPrescriptionsByPatientId = (patientId: string): Prescription[] => {
  const prescriptions = getPrescriptions();
  return prescriptions.filter(prescription => prescription.patientId === patientId);
};

export const getPrescriptionsByDoctorId = (doctorId: string): Prescription[] => {
  const prescriptions = getPrescriptions();
  return prescriptions.filter(prescription => prescription.doctorId === doctorId);
};

export const createPrescription = (prescription: Omit<Prescription, 'id'>): Prescription => {
  const prescriptions = getPrescriptions();
  const newPrescription: Prescription = {
    ...prescription,
    id: uuidv4()
  };
  prescriptions.push(newPrescription);
  localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  return newPrescription;
};

export const updatePrescription = (id: string, updates: Partial<Prescription>): Prescription | undefined => {
  const prescriptions = getPrescriptions();
  const index = prescriptions.findIndex(prescription => prescription.id === id);
  
  if (index !== -1) {
    prescriptions[index] = { ...prescriptions[index], ...updates };
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    return prescriptions[index];
  }
  return undefined;
};

export const deletePrescription = (id: string): boolean => {
  const prescriptions = getPrescriptions();
  const filteredPrescriptions = prescriptions.filter(prescription => prescription.id !== id);
  
  if (prescriptions.length !== filteredPrescriptions.length) {
    localStorage.setItem('prescriptions', JSON.stringify(filteredPrescriptions));
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

// Authentication - now creates user if doesn't exist
export const authenticateUser = (email: string, password: string): User | null => {
  let user = getUserByEmail(email);
  
  // If user doesn't exist, create a new one (for dynamic sign-in)
  if (!user) {
    console.log('User not found, creating new user for:', email);
    const newUser = createUser({
      name: email.split('@')[0], // Use email prefix as default name
      email,
      password,
      role: email.includes('doctor') ? 'doctor' : 'patient', // Simple role detection
      phoneNumber: undefined,
      avatar: '/profile-placeholder.png'
    });
    return newUser;
  }
  
  // If user exists, check password
  if (user.password === password) {
    return user;
  }
  
  return null;
};
