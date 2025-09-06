import React, { useState } from 'react';

interface RegistrationFormProps {
    onRegister: (name: string, email: string, password: string) => void;
    onSwitchToLogin: () => void;
    error?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, onSwitchToLogin, error }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }
        setPasswordsMatch(true);
        onRegister(name, email, password);
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-[#243041] rounded-2xl shadow-lg text-white">
            <div className="text-center">
                <img src="/logo.png" alt="Business Express Logo" className="w-48 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">יצירת חשבון חדש</h2>
                <p className="text-slate-400">מלאו את הפרטים כדי להצטרף אלינו.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name" className="text-sm font-bold text-slate-300 block mb-2">שם מלא</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="ישראל ישראלי"
                    />
                </div>
                <div>
                    <label htmlFor="email-register" className="text-sm font-bold text-slate-300 block mb-2">כתובת דוא"ל</label>
                    <input
                        id="email-register"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="israel@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password-register" className="text-sm font-bold text-slate-300 block mb-2">סיסמה</label>
                    <input
                        id="password-register"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="לפחות 8 תווים"
                    />
                </div>
                <div>
                    <label htmlFor="confirm-password" className="text-sm font-bold text-slate-300 block mb-2">אימות סיסמה</label>
                    <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`w-full px-3 py-2 bg-[#1C2434] border rounded-lg focus:outline-none focus:ring-2 ${passwordsMatch ? 'border-slate-600 focus:ring-orange-500' : 'border-red-500 focus:ring-red-500'}`}
                        placeholder="••••••••"
                    />
                    {!passwordsMatch && <p className="text-xs text-red-400 mt-1">הסיסמאות אינן תואמות.</p>}
                </div>

                {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg text-center">{error}</p>}

                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-800 transition-colors">
                        הרשמה
                    </button>
                </div>
            </form>
            <p className="text-sm text-center text-slate-400">
                יש לך כבר חשבון?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="font-medium text-orange-400 hover:text-orange-300">
                    התחבר כאן
                </a>
            </p>
        </div>
    );
};
