import React from 'react';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const handleLogout = () => {
    // In a real application, this would handle clearing authentication tokens, etc.
    alert("Logout functionality is not fully implemented in this mock setup.");
  }
  
  return (
    // The AdminDashboard is rendered directly as it's the main component
    // for which code is available. A real application would have routing
    // and authentication logic here.
    <div>
      <AdminDashboard onLogout={handleLogout} />
    </div>
  );
}

export default App;
