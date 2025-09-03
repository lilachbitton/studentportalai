import React, { useState, useEffect } from 'react';
import type { AdminCourse, Cycle, AdminTeamMember } from './AdminCoursesPage';
import { ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon, XIcon } from '../components/Icons';

interface AdminEditCoursePageProps {
    course: AdminCourse;
    allTeamMembers: AdminTeamMember[];
    onUpdateCourse: (courseId: string, updatedData: Partial<Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>>) => void;
    onAddCycle: (courseId: string, cycleData: Omit<Cycle, 'id' | 'students' | 'lessons'>) => void;
    onUpdateCycle: (courseId: string, cycleId: string, updatedData: Partial<Omit<Cycle, 'id' | 'students' | 'lessons'>>) => void;
    onEditCycle: (cycleId: string) => void;
    onBack: () => void;
}

const CycleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (cycleData: any) => void; // Can be new or update data
    cycleToEdit?: Cycle | null;
    teamMembers: AdminTeamMember[];
}> = ({ isOpen, onClose, onSave, cycleToEdit, teamMembers }) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [status, setStatus] = useState<'פעיל' | 'הסתיים' | 'מתוכנן'>('מתוכנן');
    const [mentorIds, setMentorIds] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && cycleToEdit) {
            setName(cycleToEdit.name);
            setStartDate(cycleToEdit.startDate);
            setEndDate(cycleToEdit.endDate);
            setStatus(cycleToEdit.status);
            setMentorIds(cycleToEdit.mentorIds || []);
        } else if (isOpen) {
            // Reset for "add new"
            setName('');
            setStartDate('');
            setEndDate('');
            setStatus('מתוכנן');
            setMentorIds([]);
        }
    }, [isOpen, cycleToEdit]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim() || !startDate || !endDate) return;
        onSave({ name, startDate, endDate, status, mentorIds });
        onClose();
    };

    const handleMentorToggle = (mentorId: string) => {
        setMentorIds(prev => prev.includes(mentorId) ? prev.filter(id => id !== mentorId) : [...prev, mentorId]);
    };

    const isEditing = !!cycleToEdit;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">{isEditing ? 'עריכת מחזור' : 'הוספת מחזור חדש'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                     <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם המחזור</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="לדוגמה: מחזור ינואר 2025"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">תאריך התחלה</label>
                            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">תאריך סיום</label>
                            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">סטטוס</label>
                        <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           <option value="מתוכנן">מתוכנן</option>
                           <option value="פעיל">פעיל</option>
                           <option value="הסתיים">הסתיים</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שייך מלווים למחזור</label>
                        <div className="p-2 bg-[#1C2434] border border-slate-600 rounded-lg max-h-40 overflow-y-auto">
                            {teamMembers.map(member => (
                                <div key={member.id} className="flex items-center p-2 rounded hover:bg-slate-700/50">
                                    <input 
                                        type="checkbox" 
                                        id={`mentor-${member.id}`} 
                                        checked={mentorIds.includes(member.id)} 
                                        onChange={() => handleMentorToggle(member.id)}
                                        className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
                                    />
                                    <label htmlFor={`mentor-${member.id}`} className="mr-3 text-slate-200">{member.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">{isEditing ? 'שמור שינויים' : 'שמור מחזור'}</button>
                </div>
            </div>
        </div>
    );
}

const CyclesManagement: React.FC<{
    cycles: Cycle[];
    onAddCycle: () => void;
    onEditCycleDetails: (cycle: Cycle) => void;
    onSelectCycle: (cycleId: string) => void;
}> = ({ cycles, onAddCycle, onEditCycleDetails, onSelectCycle }) => {
    const statusStyles: { [key: string]: string } = { 'פעיל': 'bg-green-500/20 text-green-400', 'הסתיים': 'bg-slate-500/20 text-slate-400', 'מתוכנן': 'bg-blue-500/20 text-blue-400' };
    
    return (
        <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">ניהול מחזורים</h2>
                 <button onClick={onAddCycle} className="bg-orange-600/80 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusIcon />
                    <span>הוסף מחזור חדש</span>
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="border-b-2 border-slate-600 text-sm text-slate-400">
                        <tr>
                            <th className="p-3 font-semibold">שם המחזור</th>
                            <th className="p-3 font-semibold">תאריך התחלה</th>
                            <th className="p-3 font-semibold">תאריך סיום</th>
                            <th className="p-3 font-semibold">תלמידים</th>
                            <th className="p-3 font-semibold">סטטוס</th>
                            <th className="p-3 font-semibold">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {cycles.map(cycle => (
                            <tr key={cycle.id} onClick={() => onSelectCycle(cycle.id)} className="hover:bg-slate-800/40 cursor-pointer">
                                <td className="p-3 font-semibold text-slate-200">{cycle.name}</td>
                                <td className="p-3 text-slate-300">{new Date(cycle.startDate).toLocaleDateString('he-IL')}</td>
                                <td className="p-3 text-slate-300">{new Date(cycle.endDate).toLocaleDateString('he-IL')}</td>
                                <td className="p-3 text-slate-300">{cycle.students}</td>
                                <td className="p-3">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[cycle.status]}`}>
                                        {cycle.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="flex gap-4">
                                        <button onClick={(e) => { e.stopPropagation(); onEditCycleDetails(cycle);}} className="text-slate-400 hover:text-orange-400 transition-colors" title="ערוך פרטי מחזור"><PencilIcon /></button>
                                        <button onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-red-500 transition-colors" title="מחק מחזור"><TrashIcon /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
             {cycles.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    <p>עדיין לא נוספו מחזורים לקורס זה.</p>
                </div>
            )}
        </div>
    );
};

export const AdminEditCoursePage: React.FC<AdminEditCoursePageProps> = ({ course, allTeamMembers, onUpdateCourse, onBack, onAddCycle, onUpdateCycle, onEditCycle }) => {
    const [name, setName] = useState(course.name);
    const [description, setDescription] = useState(course.description);
    const [color, setColor] = useState(course.color);
    const [isCycleModalOpen, setIsCycleModalOpen] = useState(false);
    const [cycleToEdit, setCycleToEdit] = useState<Cycle | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');


    useEffect(() => {
        setName(course.name);
        setDescription(course.description);
        setColor(course.color);
    }, [course]);

    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000); // Hide after 3 seconds
    };

    const handleSaveChanges = () => {
        onUpdateCourse(course.id, { name, description, color });
        showFeedback('פרטי הקורס עודכנו בהצלחה!');
    };
    
    const openAddCycleModal = () => {
        setCycleToEdit(null);
        setIsCycleModalOpen(true);
    };

    const openEditCycleModal = (cycle: Cycle) => {
        setCycleToEdit(cycle);
        setIsCycleModalOpen(true);
    };

    const handleSaveCycle = (cycleData: any) => {
        if (cycleToEdit) {
            onUpdateCycle(course.id, cycleToEdit.id, cycleData);
        } else {
            onAddCycle(course.id, cycleData);
        }
        setIsCycleModalOpen(false);
        setCycleToEdit(null);
    };

    const colorOptions = ['#F97316', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

    return (
        <>
            <div className="text-white space-y-8 relative">
                 {feedbackMessage && (
                    <div className="absolute -top-4 right-0 bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg animate-pulse z-50">
                        {feedbackMessage}
                    </div>
                )}
                <header className="mb-8">
                    <button onClick={onBack} className="flex items-center text-sm text-slate-400 hover:text-orange-400 transition-colors mb-4">
                        <ChevronRightIcon />
                        <span>חזרה לכל הקורסים</span>
                    </button>
                    <div>
                        <h1 className="text-4xl font-bold">עריכת קורס: {course.name}</h1>
                        <p className="text-slate-400 mt-2">עדכן את פרטי הקורס ונהל את המחזורים המשוייכים אליו.</p>
                    </div>
                </header>
                
                {/* General Details Form */}
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">פרטים כלליים</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-2 block">שם הקורס</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                             <div>
                                <label className="text-sm font-semibold text-slate-300 mb-2 block">תיאור קצר</label>
                                <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                        </div>
                         <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-300 mb-2 block">צבע הקורס</label>
                                <div className="flex gap-3">
                                    {colorOptions.map(c => (
                                        <button key={c} onClick={() => setColor(c)} style={{ backgroundColor: c }} className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${color === c ? 'ring-2 ring-offset-2 ring-offset-[#243041] ring-white' : ''}`}></button>
                                    ))}
                                </div>
                            </div>
                             <div className="flex justify-end">
                                <button onClick={handleSaveChanges} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg transition-transform hover:scale-105">
                                    שמור שינויים בפרטים
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cycles Management */}
                <CyclesManagement 
                    cycles={course.cyclesData} 
                    onAddCycle={openAddCycleModal} 
                    onEditCycleDetails={openEditCycleModal} 
                    onSelectCycle={onEditCycle}
                />
            </div>
            <CycleModal 
                isOpen={isCycleModalOpen} 
                onClose={() => setIsCycleModalOpen(false)} 
                onSave={handleSaveCycle}
                cycleToEdit={cycleToEdit}
                teamMembers={allTeamMembers}
            />
        </>
    );
};
