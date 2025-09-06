import React, { useState } from 'react';

interface LoginFormProps {
    onLogin: (email: string, password: string) => void;
    onForgotPassword: () => void;
    onSwitchToRegister: () => void;
    error?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onForgotPassword, onSwitchToRegister, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="w-full max-w-md p-8 space-y-8 bg-[#243041] rounded-2xl shadow-lg text-white">
            <div className="text-center">
                <img src="/logo.png" alt="Business Express Logo" className="w-48 mx-auto mb-4" />
                <h2 className="text-2xl font-bold">התחברות למערכת</h2>
                <p className="text-slate-400">ברוכים השבים! אנא הזינו את פרטיכם.</p>
            </div>
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="text-sm font-bold text-slate-300 block mb-2">כתובת דוא"ל</label>
                    <input
                        id="email"
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
                    <label htmlFor="password" className="text-sm font-bold text-slate-300 block mb-2">סיסמה</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-500 rounded bg-gray-700" />
                        <label htmlFor="remember-me" className="mr-2 block text-sm text-slate-300">זכור אותי</label>
                    </div>
                    <div className="text-sm">
                        <a href="#" onClick={(e) => { e.preventDefault(); onForgotPassword(); }} className="font-medium text-orange-400 hover:text-orange-300">שכחת סיסמה?</a>
                    </div>
                </div>
                
                {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-lg text-center">{error}</p>}

                <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-gray-800 transition-colors">
                        התחברות
                    </button>
                </div>
            </form>
            <p className="text-sm text-center text-slate-400">
                אין לך חשבון?{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }} className="font-medium text-orange-400 hover:text-orange-300">
                    הירשם כאן
                </a>
            </p>
        </div>
    );
};
