import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from '../components/Icons';

export interface AdminTeamMember {
    id: string;
    name: string;
    role: string;
    department?: 'Sales' | 'Mentoring' | 'Admin';
}

export interface AdminMaterial {
    id: string;
    name: string;
    url: string;
}

export interface AdminLesson {
    id: string;
    title: string;
    videoUrl: string;
    task: string;
    materials: AdminMaterial[];
}

export interface Payment {
    id: string;
    date: string;
    method: 'העברה בנקאית' | 'אשראי' | 'פיימנטס' | 'אחר';
    amount: number;
}

export interface StudentEnrollment {
    courseId: string;
    cycleId: string;
    mentorId: string;
    onboardingDate?: string;
    occupation?: string;
    dealAmount?: number;
    paymentStatus?: 'שולם במלואו' | 'שולם חלקית' | 'שולמה מקדמה' | 'לא שולם';
    notes?: string;
    salespersonId?: string;
    welcomeMessageSent?: boolean;
    karinMeetingScheduled?: boolean;
    payments?: Payment[];
    status: 'active' | 'canceled';

    // Karin's Hub fields
    onboardingMeetingDate?: string;
    meetingSummary?: string;
    goals?: string;
    importantInfo?: string;
    summaryForMentor?: string;
    strategyConsultant?: 'אפרת' | 'ארזית' | '';
    strategyMeetingUrgency?: 'דחוף מאוד' | 'עדיפות שניה' | 'לא דחוף' | '';
    strategyMeetingDate?: string;
    strategyMeetingStatus?: 'טרם נקבע' | 'נקבע' | 'ממתין לאישור' | 'לדחות' | '';
    attendance?: { lessonId: string; present: boolean; reason?: string }[];
}

export interface Cycle {
  id: string;
  name:string;
  startDate: string;
  endDate: string;
  status: 'פעיל' | 'הסתיים' | 'מתוכנן';
  students: number;
  mentorIds: string[];
  lessons: AdminLesson[];
}


export interface AdminCourse {
  id: string;
  name: string;
  description: string;
  color: string;
  cyclesData: Cycle[];
  students: number;
}

interface AdminCoursesPageProps {
    courses: AdminCourse[];
    onAddCourse: (course: Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>) => void;
    onEditCourse: (courseId: string) => void;
}

const AddCourseModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (courseData: { name: string, description: string, color: string }) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [color, setColor] = useState('#F97316');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;
        onSave({ name, description, color });
        setName('');
        setDescription('');
        setColor('#F97316');
        onClose();
    };

    const colorOptions = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

    return (
         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">הוספת קורס חדש</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם הקורס</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="לדוגמה: שיווק דיגיטלי"/>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">תיאור קצר</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="תאר את הקורס במשפט"/>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">בחר צבע</label>
                        <div className="flex gap-3">
                            {colorOptions.map(c => (
                                <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-[#243041] ring-white' : ''}`}></button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור קורס</button>
                </div>
            </div>
        </div>
    )
}

export const AdminCoursesPage: React.FC<AdminCoursesPageProps> = ({ courses, onAddCourse, onEditCourse }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
        <div className="text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">ניהול קורסים</h1>
                    <p className="text-slate-400 mt-2">הוספה, עריכה וניהול של כל הקורסים במערכת.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                    <PlusIcon />
                    <span>הוסף קורס חדש</span>
                </button>
            </header>

            <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b-2 border-slate-700 text-sm text-slate-400">
                            <tr>
                                <th className="p-4 font-semibold">שם הקורס</th>
                                <th className="p-4 font-semibold">מחזורים פעילים</th>
                                <th className="p-4 font-semibold">תלמידים רשומים</th>
                                <th className="p-4 font-semibold">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {courses.map(course => (
                                <tr key={course.id} onClick={() => onEditCourse(course.id)} className="hover:bg-slate-800/20 cursor-pointer">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <span style={{ backgroundColor: course.color }} className="w-4 h-4 rounded-full flex-shrink-0"></span>
                                            <span className="font-semibold text-slate-200">{course.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-slate-300">{course.cyclesData.length}</td>
                                    <td className="p-4 text-slate-300">{course.students}</td>
                                    <td className="p-4">
                                        <div className="flex gap-4">
                                            <button onClick={(e) => { e.stopPropagation(); onEditCourse(course.id); }} className="text-slate-400 hover:text-orange-400 transition-colors" title="ערוך קורס">
                                                <PencilIcon />
                                            </button>
                                            <button onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-red-500 transition-colors" title="מחק קורס">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {courses.length === 0 && (
                     <div className="text-center py-12 text-slate-500">
                        <p>עדיין לא נוספו קורסים. לחץ על "הוסף קורס חדש" כדי להתחיל.</p>
                    </div>
                )}
            </div>
        </div>
        <AddCourseModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={onAddCourse}
        />
        </>
    );
};