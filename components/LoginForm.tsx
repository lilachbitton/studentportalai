import React, { useState } from 'react';
import { api } from '../services/api';

// Helper component for the logo, using the image from the public folder.
const Logo: React.FC = () => (
    <div className="text-white text-3xl font-bold">Business Express</div>
);

const EyeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeSlashIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 1.274-4.057 5.064 7 9.542 7 .847 0 1.67 .111 2.458 .317M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 2a9.954 9.954 0 01-1.666 3.333M3 3l18 18" />
  </svg>
);


export const LoginForm: React.FC<{ 
  onNavigateToRegister: () => void; 
  onForgotPassword: () => void;
  onLoginSuccess: (role: 'student' | 'admin') => void;
}> = ({ onNavigateToRegister, onForgotPassword, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
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
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="דואר אלקטרוני"
            className="w-full p-3 bg-gray-100 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-500"
            required
            aria-label="Email Address"
          />
        </div>
        <div className="relative">
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמא"
            className="w-full p-3 pl-10 bg-gray-100 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-500"
            required
            aria-label="Password"
          />
           <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 left-0 pl-3 flex items-center" aria-label="Show password">
              {passwordVisible ? <EyeSlashIcon/> : <EyeIcon/>}
            </button>
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