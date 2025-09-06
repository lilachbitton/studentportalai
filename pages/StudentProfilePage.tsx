import React, { useState } from 'react';

interface StudentProfilePageProps {
    student: {
        name: string;
        email: string;
    }
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ student }) => {
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock update logic
        console.log("Updating profile:", { name, email });
        alert("הפרופיל עודכן בהצלחה!");
    };
    
    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("הסיסמאות החדשות אינן תואמות.");
            return;
        }
        // Mock password change logic
        console.log("Changing password...");
        alert("הסיסמה שונתה בהצלחה!");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    return (
        <div>
             <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">הפרופיל שלי</h1>
                <p className="text-slate-400 mt-2">עדכני את הפרטים האישיים והסיסמה שלך.</p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-6">פרטים אישיים</h2>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">שם מלא</label>
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">דוא"ל</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                        </div>
                        <div className="pt-2">
                             <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold">שמור שינויים</button>
                        </div>
                    </form>
                </div>
                 <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-6">שינוי סיסמה</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">סיסמה נוכחית</label>
                            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">סיסמה חדשה</label>
                            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">אימות סיסמה חדשה</label>
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                        </div>
                        <div className="pt-2">
                             <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold">שנה סיסמה</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
