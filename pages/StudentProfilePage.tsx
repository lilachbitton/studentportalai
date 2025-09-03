import React, { useState } from 'react';
import { CameraIcon } from '../components/Icons';

export interface StudentProfileData {
    personal: {
        name: string;
        email: string;
        phone: string;
        imageUrl: string;
    };
    professional: {
        title: string;
        company: string;
        bio: string;
    };
}

interface StudentProfilePageProps {
    profile: StudentProfileData;
    onUpdateProfile: (newProfileData: StudentProfileData) => void;
}

type ActiveTab = 'personal' | 'professional' | 'security';

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode; }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold rounded-t-lg border-b-2 transition-colors ${
            isActive 
            ? 'text-orange-400 border-orange-400' 
            : 'text-slate-400 border-transparent hover:text-white hover:border-slate-500'
        }`}
    >
        {children}
    </button>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string; id: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-300 mb-2 block">{label}</label>
        <input id={id} {...props} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; id: string; }> = ({ label, id, ...props }) => (
    <div>
        <label htmlFor={id} className="text-sm font-semibold text-slate-300 mb-2 block">{label}</label>
        <textarea id={id} {...props} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
    </div>
);

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ profile, onUpdateProfile }) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('personal');
    const [personalDetails, setPersonalDetails] = useState(profile.personal);
    const [professionalDetails, setProfessionalDetails] = useState(profile.professional);
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');

    const handlePersonalSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile({ ...profile, personal: personalDetails });
        // Add success message
    };

    const handleProfessionalSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdateProfile({ ...profile, professional: professionalDetails });
        // Add success message
    };

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');
        if (passwords.new !== passwords.confirm) {
            setPasswordError('הסיסמאות החדשות אינן תואמות.');
            return;
        }
        if (passwords.new.length < 8) {
             setPasswordError('הסיסמה החדשה חייבת להכיל לפחות 8 תווים.');
            return;
        }
        // Logic to change password
        console.log("Changing password...");
        setPasswords({ current: '', new: '', confirm: '' });
        // Add success message
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'personal': return (
                <form onSubmit={handlePersonalSave} className="space-y-4">
                    <FormInput label="שם מלא" id="name" type="text" value={personalDetails.name} onChange={e => setPersonalDetails({...personalDetails, name: e.target.value})} />
                    <FormInput label='כתובת דוא"ל' id="email" type="email" value={personalDetails.email} onChange={e => setPersonalDetails({...personalDetails, email: e.target.value})} />
                    <FormInput label="מספר טלפון" id="phone" type="tel" value={personalDetails.phone} onChange={e => setPersonalDetails({...personalDetails, phone: e.target.value})} />
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור שינויים</button>
                    </div>
                </form>
            );
            case 'professional': return (
                 <form onSubmit={handleProfessionalSave} className="space-y-4">
                    <FormInput label="תפקיד" id="title" type="text" value={professionalDetails.title} onChange={e => setProfessionalDetails({...professionalDetails, title: e.target.value})} />
                    <FormInput label="חברה/עסק" id="company" type="text" value={professionalDetails.company} onChange={e => setProfessionalDetails({...professionalDetails, company: e.target.value})} />
                    <FormTextarea label="ביו קצר" id="bio" rows={4} value={professionalDetails.bio} onChange={e => setProfessionalDetails({...professionalDetails, bio: e.target.value})} />
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור שינויים</button>
                    </div>
                </form>
            );
            case 'security': return (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <FormInput label="סיסמה נוכחית" id="current-password" type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} />
                    <FormInput label="סיסמה חדשה" id="new-password" type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} />
                    <FormInput label="אימות סיסמה חדשה" id="confirm-password" type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} />
                    {passwordError && <p className="text-red-400 text-sm text-right">{passwordError}</p>}
                    <div className="flex justify-end pt-4">
                        <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שנה סיסמה</button>
                    </div>
                </form>
            );
            default: return null;
        }
    };
    
    return (
        <div className="text-white max-w-4xl mx-auto">
            <h1 className="text-5xl font-extrabold mb-8 text-center">הפרופיל שלי</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left side: Profile picture */}
                <div className="md:col-span-1">
                    <div className="bg-[#243041] p-6 rounded-2xl shadow-lg flex flex-col items-center">
                        <div className="relative mb-4">
                            <img src={personalDetails.imageUrl} alt="תמונת פרופיל" className="w-40 h-40 rounded-full object-cover ring-4 ring-slate-600"/>
                            <button className="absolute bottom-2 right-2 bg-orange-600 hover:bg-orange-700 p-3 rounded-full transition-transform hover:scale-110">
                                <CameraIcon />
                                <span className="sr-only">שנה תמונה</span>
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{personalDetails.name}</h2>
                        <p className="text-slate-400">{professionalDetails.title}</p>
                    </div>
                </div>

                {/* Right side: Tabs and forms */}
                <div className="md:col-span-2">
                    <div className="bg-[#243041] rounded-2xl shadow-lg">
                        <div className="border-b border-slate-700 px-6">
                            <TabButton isActive={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>פרטים אישיים</TabButton>
                            <TabButton isActive={activeTab === 'professional'} onClick={() => setActiveTab('professional')}>פרטים מקצועיים</TabButton>
                            <TabButton isActive={activeTab === 'security'} onClick={() => setActiveTab('security')}>אבטחה</TabButton>
                        </div>
                        <div className="p-8">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};