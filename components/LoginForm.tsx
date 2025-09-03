import React, { useState } from 'react';
import { api } from '../services/api';

// Helper component for the logo, using the image from the public folder.
const Logo: React.FC = () => (
    <img src="/logo.png" alt="לוגו ביזנס אקספרס" className="w-48" />
);

export const LoginForm: React.FC<{ 
  onNavigateToRegister: () => void; 
  onForgotPassword: () => void;
  onLoginSuccess: (role: 'student' | 'admin') => void;
}> = ({ onNavigateToRegister, onForgotPassword, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await api.login(email, password, rememberMe);
      if (result.success) {
        // Fix: Cast result.role to the specific string literal type expected by onLoginSuccess.
        onLoginSuccess(result.role as 'student' | 'admin');
      } else {
        setError(result.message || 'שם משתמש או סיסמא שגויים.');
      }
    } catch (err) {
      setError('אירעה שגיאה. נסה שוב מאוחר יותר.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1C2434] bg-opacity-95 p-8 rounded-xl shadow-2xl w-full text-right">
      <div className="flex justify-center mb-6">
        <Logo />
      </div>
      
      <h1 className="text-white text-3xl font-bold text-center mb-6">כניסה</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="דואר אלקטרוני / שם משתמש"
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-500"
            required
            aria-label="Email Address or Username"
          />
        </div>
        <div>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמא"
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-500"
            required
            aria-label="Password"
          />
        </div>
        
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        
        <div className="flex justify-end items-center text-sm">
          <div className="flex items-center">
             <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="rememberMe" className="mr-2 text-gray-300">זכור אותי</label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'מתחבר...' : 'כניסה'}
        </button>
      </form>

      <div className="text-center mt-6 space-y-2">
        <button onClick={onNavigateToRegister} className="text-sm text-gray-400 hover:text-orange-400 transition duration-300">
          אין לך עדיין חשבון? הירשם כאן
        </button>
        <br />
        <button onClick={onForgotPassword} className="text-sm text-gray-400 hover:text-orange-400 transition duration-300">
          שכחת סיסמא? לחץ כאן
        </button>
      </div>
    </div>
  );
};