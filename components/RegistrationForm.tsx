import React, { useState } from 'react';
import { api } from '../services/api';

// Helper component for the logo, using a text-based logo for consistency.
const Logo: React.FC = () => (
    <div className="text-white text-3xl font-bold">Business Express</div>
);

// Helper component for a single form input field to reduce repetition.
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

const FormInput: React.FC<FormInputProps> = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="sr-only">{label}</label>
    <input
      id={id}
      className="w-full p-3 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-400"
      placeholder={label}
      {...props}
    />
  </div>
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


export const RegistrationForm: React.FC<{ onNavigateToLogin: () => void; onRegistrationSuccess: () => void; }> = ({ onNavigateToLogin, onRegistrationSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isRegistrationSuccessful, setRegistrationSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');


  const [errors, setErrors] = useState({
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    const newErrors = { phone: '', password: '', confirmPassword: ''};
    let isValid = true;

    // Phone validation: digits only
    if (phone && !/^\d+$/.test(phone)) {
      newErrors.phone = 'מספר טלפון יכול להכיל ספרות בלבד.';
      isValid = false;
    }

    // Password validation: min 8 chars, no hebrew letters.
    if (password.length < 8) {
      newErrors.password = 'הסיסמה חייבת להכיל לפחות 8 תווים.';
      isValid = false;
    } else if (/[א-ת]/.test(password)) { // Check for Hebrew letters
      newErrors.password = 'הסיסמה יכולה להכיל אותיות באנגלית, מספרים ותווים מיוחדים בלבד.';
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות.';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');
    if (validateForm()) {
      setIsLoading(true);
      try {
        // Fix: Explicitly type the result from the API call to allow for an optional `message` property on failure.
        const result: { success: boolean; message?: string } = await api.register({ fullName, email, phone, password });
        if (result.success) {
          setRegistrationSuccessful(true);
        } else {
          setApiError(result.message || 'הרשמה נכשלה. ייתכן שהמייל כבר קיים במערכת.');
        }
      } catch (err) {
        setApiError('אירעה שגיאת רשת. נסה שוב מאוחר יותר.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isRegistrationSuccessful) {
    return (
      <div className="bg-[#1C2434] bg-opacity-95 p-8 rounded-xl shadow-2xl w-full text-center">
        <div className="flex justify-center mb-6">
            <Logo />
        </div>
        <h1 className="text-white text-2xl font-bold mb-4">הרשמה הושלמה בהצלחה!</h1>
        <p className="text-gray-300 mb-8">
            כעת ניתן להתחבר לחשבונך באמצעות המייל והסיסמא שהזנת.
        </p>
        <button
            onClick={onRegistrationSuccess}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
        >
            מעבר להתחברות
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1C2434] bg-opacity-95 p-8 rounded-xl shadow-2xl w-full text-right">
      <div className="flex justify-center mb-4">
        <Logo />
      </div>
      
      <h1 className="text-white text-xl font-bold text-center mb-6">הרשמה לתכנית המעשית - עסק טיטאנים</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput 
            id="fullName" 
            label="שם מלא" 
            type="text" 
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)} 
            required 
        />
        <FormInput 
            id="email" 
            label="דואר אלקטרוני" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
        />
        <div>
            <FormInput 
                id="phone" 
                label="טלפון נייד" 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
            />
            {errors.phone && <p className="text-red-400 text-xs mt-1 text-right">{errors.phone}</p>}
        </div>
        
        <div>
          <div className="relative">
             <label htmlFor="password" className="sr-only">סיסמא</label>
             <input 
                id="password" 
                placeholder="סיסמא" 
                type={passwordVisible ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full p-3 pl-10 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-400"
            />
            <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 left-0 pl-3 flex items-center" aria-label="Show password">
              {passwordVisible ? <EyeSlashIcon/> : <EyeIcon/>}
            </button>
          </div>
          {errors.password && <p className="text-red-400 text-xs mt-1 text-right">{errors.password}</p>}
        </div>

        <div>
          <div className="relative">
             <label htmlFor="confirmPassword" className="sr-only">אימות סיסמא</label>
             <input 
                id="confirmPassword" 
                placeholder="אימות סיסמא" 
                type={confirmPasswordVisible ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full p-3 pl-10 bg-gray-700/50 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-right placeholder:text-gray-400"
            />
            <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute inset-y-0 left-0 pl-3 flex items-center" aria-label="Show confirm password">
              {confirmPasswordVisible ? <EyeSlashIcon/> : <EyeIcon/>}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 text-right">{errors.confirmPassword}</p>}
        </div>
        
        {apiError && <p className="text-red-400 text-sm text-center">{apiError}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 ease-in-out transform hover:scale-105 mt-6 !mt-8 disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          {isLoading ? 'רושם...' : 'הרשמה'}
        </button>
      </form>

      <div className="text-center mt-6">
        <button onClick={onNavigateToLogin} className="text-sm text-gray-400 hover:text-orange-400 transition duration-300">
          יש לך כבר חשבון? התחבר כאן
        </button>
      </div>
    </div>
  );
};