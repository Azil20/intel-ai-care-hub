
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Set page title
document.title = "Intelej Hosp";

createRoot(document.getElementById("root")!).render(<App />);
