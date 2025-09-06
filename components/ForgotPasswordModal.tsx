import React, { useState } from 'react';
import { XIcon } from './Icons';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSendResetLink: (email: string) => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, onSendResetLink }) => {
    const [email, setEmail] = useState('');

    if (!isOpen) {
        return null;
    }

    const handleSendLink = () => {
        if (!email.trim()) return;
        onSendResetLink(email);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col p-8" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">איפוס סיסמה</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <p className="text-slate-400 mb-6">נא להזין את כתובת הדוא"ל המשויכת לחשבונך. אנו נשלח לך קישור לאיפוס הסיסמה.</p>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="reset-email" className="text-sm font-semibold text-slate-300 mb-2 block">כתובת דוא"ל</label>
                        <input
                            type="email"
                            id="reset-email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="israel@example.com"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSendLink} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שלח קישור</button>
                </div>
            </div>
        </div>
    );
};
