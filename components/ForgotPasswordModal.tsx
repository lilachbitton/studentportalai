import React, { useState } from 'react';
import { api } from '../services/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const result = await api.forgotPassword(email);
    setMessage(result.message);

    setIsLoading(false);
  };

  const handleClose = () => {
    setMessage('');
    setEmail('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" 
      onClick={handleClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-[#1C2434] bg-opacity-95 p-8 rounded-xl shadow-2xl w-full max-w-md text-right relative"
        onClick={e => e.stopPropagation()} // Prevent click from closing modal
      >
        <h2 className="text-white text-2xl font-bold text-center mb-6">איפוס סיסמא</h2>
        
        {message ? (
          <div className="text-center text-green-300 mb-4 py-8">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="reset-email" className="sr-only">דואר אלקטרוני</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="דואר אלקטרוני"
                className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-400"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-gray-500"
            >
              {isLoading ? 'שולח...' : 'שלח מייל לאיפוס סיסמא'}
            </button>
          </form>
        )}

        <div className="text-center mt-4">
          <button
            onClick={handleClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            סגור
          </button>
        </div>
      </div>
    </div>
  );
};