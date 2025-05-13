
// Local database service using IndexedDB
import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "patient" | "doctor";
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  time: string;
  reason: string;
  phoneNumber?: string; // Added phone number field
  status: "scheduled" | "completed" | "cancelled";
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  role: "user" | "bot";
}

// Database initialization
export const initializeLocalDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("IntelEJHospitalDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create users store
      if (!db.objectStoreNames.contains("users")) {
        const usersStore = db.createObjectStore("users", { keyPath: "id" });
        usersStore.createIndex("email", "email", { unique: true });
        usersStore.createIndex("role", "role", { unique: false });
      }

      // Create appointments store
      if (!db.objectStoreNames.contains("appointments")) {
        const appointmentsStore = db.createObjectStore("appointments", { keyPath: "id" });
        appointmentsStore.createIndex("patientId", "patientId", { unique: false });
        appointmentsStore.createIndex("doctorId", "doctorId", { unique: false });
        appointmentsStore.createIndex("date", "date", { unique: false });
      }

      // Create messages store for AI chat
      if (!db.objectStoreNames.contains("messages")) {
        const messagesStore = db.createObjectStore("messages", { keyPath: "id" });
        messagesStore.createIndex("userId", "userId", { unique: false });
        messagesStore.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (event) => {
      console.log("Database initialized successfully");
      const db = (event.target as IDBOpenDBRequest).result;
      // Now we can safely add default users after the database is initialized
      addDefaultUsers(db)
        .then(() => resolve())
        .catch((error) => {
          console.error("Error adding default users:", error);
          resolve(); // Still resolve to allow app to function
        });
    };

    request.onerror = (event) => {
      console.error("Database error:", (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Add default users in a separate function that returns a promise
const addDefaultUsers = (db: IDBDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const transaction = db.transaction("users", "readwrite");
      const usersStore = transaction.objectStore("users");
      
      // Use a counter to track when both user checks are complete
      let checksDone = 0;
      const totalChecks = 2;
      
      // Check if default doctor exists
      const doctorRequest = usersStore.index("email").get("doctor@example.com");
      doctorRequest.onsuccess = () => {
        if (!doctorRequest.result) {
          // Add default doctor
          usersStore.add({
            id: "d1",
            name: "Dr. Sarah Smith",
            email: "doctor@example.com",
            password: "password", // In a real app, this should be hashed
            role: "doctor"
          });
        }
        checksDone++;
        if (checksDone === totalChecks) {
          transaction.oncomplete = () => resolve();
          transaction.onerror = (e) => reject(e);
        }
      };
      
      // Check if default patient exists
      const patientRequest = usersStore.index("email").get("patient@example.com");
      patientRequest.onsuccess = () => {
        if (!patientRequest.result) {
          // Add default patient
          usersStore.add({
            id: "p1",
            name: "John Doe",
            email: "patient@example.com",
            password: "password", // In a real app, this should be hashed
            role: "patient"
          });
        }
        checksDone++;
        if (checksDone === totalChecks) {
          transaction.oncomplete = () => resolve();
          transaction.onerror = (e) => reject(e);
        }
      };
    } catch (error) {
      console.error("Error in addDefaultUsers:", error);
      reject(error);
    }
  });
};

// User operations
export const addUser = (user: Omit<User, "id">): Promise<User> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("users", "readwrite");
      const usersStore = transaction.objectStore("users");
      
      // Check if email already exists
      const emailCheck = usersStore.index("email").get(user.email);
      
      emailCheck.onsuccess = () => {
        if (emailCheck.result) {
          reject(new Error("User with this email already exists"));
          return;
        }
        
        // Add new user with generated ID
        const newUser = {
          ...user,
          id: uuidv4()
        };
        
        const addRequest = usersStore.add(newUser);
        
        addRequest.onsuccess = () => {
          resolve(newUser);
        };
        
        addRequest.onerror = (event) => {
          reject((event.target as IDBRequest).error);
        };
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Login operation
export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("users", "readonly");
      const usersStore = transaction.objectStore("users");
      const emailIndex = usersStore.index("email");
      
      const request = emailIndex.get(email);
      
      request.onsuccess = () => {
        const user = request.result;
        if (user && user.password === password) {
          // In real app, use bcrypt to compare hashed passwords
          resolve(user);
        } else {
          reject(new Error("Invalid email or password"));
        }
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Get users by role
export const getUsersByRole = (role: "patient" | "doctor"): Promise<User[]> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("users", "readonly");
      const usersStore = transaction.objectStore("users");
      const roleIndex = usersStore.index("role");
      
      const request = roleIndex.getAll(role);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Appointment operations
export const addAppointment = (appointment: Omit<Appointment, "id">): Promise<Appointment> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("appointments", "readwrite");
      const appointmentsStore = transaction.objectStore("appointments");
      
      const newAppointment = {
        ...appointment,
        id: uuidv4()
      };
      
      const request = appointmentsStore.add(newAppointment);
      
      request.onsuccess = () => {
        resolve(newAppointment);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Get all appointments
export const getAllAppointments = (): Promise<Appointment[]> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("appointments", "readonly");
      const appointmentsStore = transaction.objectStore("appointments");
      
      const request = appointmentsStore.getAll();
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Get appointments by patient ID
export const getAppointmentsByPatient = (patientId: string): Promise<Appointment[]> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("appointments", "readonly");
      const appointmentsStore = transaction.objectStore("appointments");
      const patientIndex = appointmentsStore.index("patientId");
      
      const request = patientIndex.getAll(patientId);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Get appointments by doctor ID
export const getAppointmentsByDoctor = (doctorId: string): Promise<Appointment[]> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("appointments", "readonly");
      const appointmentsStore = transaction.objectStore("appointments");
      const doctorIndex = appointmentsStore.index("doctorId");
      
      const request = doctorIndex.getAll(doctorId);
      
      request.onsuccess = () => {
        resolve(request.result);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Message operations for AI chat
export const saveMessage = (message: Omit<Message, "id">): Promise<Message> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("messages", "readwrite");
      const messagesStore = transaction.objectStore("messages");
      
      const newMessage = {
        ...message,
        id: uuidv4()
      };
      
      const request = messagesStore.add(newMessage);
      
      request.onsuccess = () => {
        resolve(newMessage);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};

// Get message history by user ID
export const getMessagesByUser = (userId: string): Promise<Message[]> => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open("IntelEJHospitalDB", 1);
    
    dbRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction("messages", "readonly");
      const messagesStore = transaction.objectStore("messages");
      const userIndex = messagesStore.index("userId");
      
      const request = userIndex.getAll(userId);
      
      request.onsuccess = () => {
        // Sort messages by timestamp
        const messages = request.result;
        messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        resolve(messages);
      };
      
      request.onerror = (event) => {
        reject((event.target as IDBRequest).error);
      };
    };
    
    dbRequest.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
};
