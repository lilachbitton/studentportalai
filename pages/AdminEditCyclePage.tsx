import React, { useState, useEffect } from 'react';
import { AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment, Payment } from './AdminCoursesPage';
import { AdminStudent } from './AdminStudentsPage';
import { ChevronRightIcon, PlusIcon, PencilIcon, TrashIcon, XIcon, VideoCameraIcon, CheckCircleIcon } from '../components/Icons';

interface AdminEditCyclePageProps {
    course: AdminCourse;
    cycle: Cycle;
    allStudents: AdminStudent[];
    allTeamMembers: AdminTeamMember[];
    onUpdateCycle: (courseId: string, cycleId: string, updatedData: Partial<Omit<Cycle, 'id' | 'students' | 'lessons'>>) => void;
    onBack: () => void;
    onAddLesson: (lessonName: string) => void;
    onSelectLessonToEdit: (lessonId: string) => void;
    onUpdateLessonTitle: (lessonId: string, newTitle: string) => void;
    onDeleteLesson: (lessonId: string) => void;
    onUpdateStudentEnrollmentDetails: (studentId: string, courseId: string, cycleId: string, field: keyof StudentEnrollment, value: any) => void;
    onUpdateStudentDetails: (studentId: string, field: keyof Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' >, value: any) => void;
    onAddNewStudent: (studentData: Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' | 'status'>) => void;
}

const AddStudentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (studentData: Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' | 'status'>) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim() || !email.trim()) return;
        onSave({ name, email, phone });
        setName('');
        setEmail('');
        setPhone('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">הוספת תלמיד חדש למחזור</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם מלא</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="שם התלמיד"/>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">דוא"ל</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="israel@example.com"/>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">טלפון</label>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="050-1234567"/>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור והוסף</button>
                </div>
            </div>
        </div>
    );
};


const PaymentsModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    payments: Payment[];
    onUpdatePayments: (newPayments: Payment[]) => void;
}> = ({ isOpen, onClose, payments, onUpdatePayments }) => {
    const [localPayments, setLocalPayments] = useState(payments);

    useEffect(() => {
        setLocalPayments(payments);
    }, [payments, isOpen]);
    
    if (!isOpen) return null;
    
    const handleAddPayment = () => {
        const newPayment: Payment = {
            id: `p${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            method: 'אשראי',
            amount: 0,
        };
        setLocalPayments([...localPayments, newPayment]);
    };

    const handlePaymentChange = (index: number, field: keyof Payment, value: any) => {
        const updated = [...localPayments];
        const target = updated[index] as any;
        target[field] = value;
        setLocalPayments(updated);
    };

    const handleSave = () => {
        onUpdatePayments(localPayments);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <h3 className="font-bold text-xl mb-6">ניהול תשלומים</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                    {localPayments.map((p, i) => (
                        <div key={p.id} className="grid grid-cols-3 gap-3 p-2 bg-[#1C2434] rounded-lg">
                           <input type="date" value={p.date} onChange={e => handlePaymentChange(i, 'date', e.target.value)} className="p-1 bg-slate-700 rounded text-slate-200"/>
                           <select value={p.method} onChange={e => handlePaymentChange(i, 'method', e.target.value)} className="p-1 bg-slate-700 rounded text-slate-200">
                                <option>אשראי</option>
                                <option>העברה בנקאית</option>
                                <option>פיימנטס</option>
                                <option>אחר</option>
                           </select>
                           <input type="number" value={p.amount} onChange={e => handlePaymentChange(i, 'amount', parseFloat(e.target.value))} className="p-1 bg-slate-700 rounded text-slate-200"/>
                        </div>
                    ))}
                </div>
                <button onClick={handleAddPayment} className="text-sm text-orange-400 hover:underline mt-4 self-start">הוסף תשלום</button>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold">שמור שינויים</button>
                </div>
            </div>
        </div>
    )
}

const EditableCell: React.FC<{ value: string; onChange: (value: string) => void; type?: string;}> = ({ value, onChange, type = 'text' }) => {
    return (
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent p-1 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-[#2a384e] text-slate-200"
        />
    )
}

const EditableNote: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full min-h-[40px] text-xs bg-transparent p-1 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-[#2a384e] resize-y text-slate-200"
            rows={1}
        />
    )
}

const CycleStudentManagementTable: React.FC<{
    studentsInCycle: AdminStudent[];
    cycle: Cycle;
    courseId: string;
    teamMembers: AdminTeamMember[];
    onUpdateStudentEnrollmentDetails: (studentId: string, courseId: string, cycleId: string, field: keyof StudentEnrollment, value: any) => void;
    onUpdateStudentDetails: (studentId: string, field: keyof Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' >, value: any) => void;
    onAddNewStudent: (studentData: Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' | 'status'>) => void;
}> = ({ studentsInCycle, cycle, courseId, teamMembers, onUpdateStudentEnrollmentDetails, onUpdateStudentDetails, onAddNewStudent }) => {
    
    const [paymentsModalOpen, setPaymentsModalOpen] = useState(false);
    const [selectedStudentForPayments, setSelectedStudentForPayments] = useState<AdminStudent | null>(null);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'canceled'>('active');
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'hotlist'>('all');

    const salesTeam = teamMembers.filter(tm => tm.department === 'Sales');
    
    const handleEnrollmentUpdate = (studentId: string, field: keyof StudentEnrollment, value: any) => {
        onUpdateStudentEnrollmentDetails(studentId, courseId, cycle.id, field, value);
    };

     const handleStudentUpdate = (studentId: string, field: keyof Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' >, value: any) => {
        onUpdateStudentDetails(studentId, field, value);
    };

    const openPayments = (student: AdminStudent) => {
        setSelectedStudentForPayments(student);
        setPaymentsModalOpen(true);
    };

    const handleUpdatePayments = (newPayments: Payment[]) => {
        if (selectedStudentForPayments) {
            handleEnrollmentUpdate(selectedStudentForPayments.id, 'payments', newPayments);
        }
    };
    
    const getEnrollmentForStudent = (student: AdminStudent) => {
        return student.enrollments.find(e => e.cycleId === cycle.id && e.courseId === courseId);
    };

    const displayedStudents = studentsInCycle.filter(student => {
        const enrollment = getEnrollmentForStudent(student);
        if (!enrollment || enrollment.status !== activeTab) {
            return false;
        }
        if (paymentFilter === 'hotlist') {
            return enrollment.paymentStatus !== 'שולם במלואו';
        }
        return true;
    });

    const commonInputClass = "w-full bg-[#1C2434] border border-slate-600 rounded p-1 text-slate-200";

    return (
        <>
        <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <div className="flex border-b border-slate-700">
                    <button onClick={() => setActiveTab('active')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'active' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400'}`}>פעילים</button>
                    <button onClick={() => setActiveTab('canceled')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'canceled' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400'}`}>ביטולים</button>
                </div>
                 {activeTab === 'active' && (
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 bg-[#1C2434] p-1.5 rounded-lg">
                            <button onClick={() => setPaymentFilter('all')} className={`px-3 py-1 rounded-md text-xs font-semibold ${paymentFilter === 'all' ? 'bg-slate-600 text-white' : 'text-slate-300'}`}>הכל</button>
                            <button onClick={() => setPaymentFilter('hotlist')} className={`px-3 py-1 rounded-md text-xs font-semibold ${paymentFilter === 'hotlist' ? 'bg-red-500 text-white' : 'text-slate-300'}`}>הוט ליסט</button>
                        </div>
                        <button onClick={() => setIsAddStudentModalOpen(true)} className="bg-orange-600/80 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                            <PlusIcon />
                            <span>הוסף תלמיד חדש</span>
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-right text-sm whitespace-nowrap">
                    <thead className="border-b-2 border-slate-600 text-slate-400">
                        <tr>
                            <th className="p-3">תאריך</th>
                            <th className="p-3">שם מלא</th>
                            <th className="p-3">טלפון</th>
                            <th className="p-3">דוא"ל</th>
                            <th className="p-3">עיסוק</th>
                            <th className="p-3">פירוט תשלומים</th>
                            <th className="p-3">סכום העסקה</th>
                            <th className="p-3">סכום ששולם</th>
                            <th className="p-3">יתרה</th>
                            <th className="p-3">סטטוס תשלום</th>
                            <th className="p-3">איש מכירות</th>
                            <th className="p-3">הערות</th>
                            <th className="p-3">הודעת ברוך הבא</th>
                            <th className="p-3">פגישה עם קרין</th>
                            <th className="p-3">פעולות</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                    {displayedStudents.map(student => {
                        const enrollment = getEnrollmentForStudent(student);
                        if (!enrollment) return null;

                        const paidSoFar = (enrollment.payments || []).reduce((sum, p) => sum + p.amount, 0);
                        const balance = (enrollment.dealAmount || 0) - paidSoFar;
                        
                        return (
                        <tr key={student.id} className="hover:bg-slate-800/40">
                            <td className="p-2"><input type="date" value={enrollment.onboardingDate || ''} onChange={e => handleEnrollmentUpdate(student.id, 'onboardingDate', e.target.value)} className={commonInputClass} /></td>
                            <td className="p-2 font-semibold text-slate-200">{student.name}</td>
                            <td className="p-2"><EditableCell value={student.phone} onChange={value => handleStudentUpdate(student.id, 'phone', value)} /></td>
                            <td className="p-2"><EditableCell value={student.email} onChange={value => handleStudentUpdate(student.id, 'email', value)} type="email" /></td>
                            <td className="p-2"><EditableCell value={enrollment.occupation || ''} onChange={value => handleEnrollmentUpdate(student.id, 'occupation', value)} /></td>
                            <td className="p-2"><button onClick={() => openPayments(student)} className="text-orange-400 hover:underline">צפייה/עריכה</button></td>
                            <td className="p-2"><EditableCell value={(enrollment.dealAmount || 0).toString()} onChange={value => handleEnrollmentUpdate(student.id, 'dealAmount', parseFloat(value))} type="number" /></td>
                            <td className="p-2 text-green-400">{paidSoFar.toLocaleString()} ₪</td>
                            <td className="p-2 text-red-400">{balance.toLocaleString()} ₪</td>
                            <td className="p-2">
                                <select value={enrollment.paymentStatus || ''} onChange={e => handleEnrollmentUpdate(student.id, 'paymentStatus', e.target.value)} className={commonInputClass}>
                                    <option>לא שולם</option>
                                    <option>שולמה מקדמה</option>
                                    <option>שולם חלקית</option>
                                    <option>שולם במלואו</option>
                                </select>
                            </td>
                             <td className="p-2">
                                <select value={enrollment.salespersonId || ''} onChange={e => handleEnrollmentUpdate(student.id, 'salespersonId', e.target.value)} className={commonInputClass}>
                                    <option value="">-- בחר --</option>
                                    {salesTeam.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </td>
                            <td className="p-2 w-40"><EditableNote value={enrollment.notes || ''} onChange={value => handleEnrollmentUpdate(student.id, 'notes', value)} /></td>
                            <td className="p-2 text-center"><input type="checkbox" checked={enrollment.welcomeMessageSent || false} onChange={e => handleEnrollmentUpdate(student.id, 'welcomeMessageSent', e.target.checked)} className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded"/></td>
                            <td className="p-2 text-center"><input type="checkbox" checked={enrollment.karinMeetingScheduled || false} onChange={e => handleEnrollmentUpdate(student.id, 'karinMeetingScheduled', e.target.checked)} className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded"/></td>
                            <td className="p-2">
                                {activeTab === 'active' ? (
                                    <button onClick={() => handleEnrollmentUpdate(student.id, 'status', 'canceled')} className="text-red-400 text-xs hover:underline">בטל רישום</button>
                                ) : (
                                    <button onClick={() => handleEnrollmentUpdate(student.id, 'status', 'active')} className="text-green-400 text-xs hover:underline">החזר לפעילים</button>
                                )}
                            </td>
                        </tr>
                    )})}
                    </tbody>
                </table>
            </div>
        </div>
        {paymentsModalOpen && selectedStudentForPayments && (
            <PaymentsModal 
                isOpen={paymentsModalOpen}
                onClose={() => setPaymentsModalOpen(false)}
                payments={getEnrollmentForStudent(selectedStudentForPayments)?.payments || []}
                onUpdatePayments={handleUpdatePayments}
            />
        )}
        <AddStudentModal
            isOpen={isAddStudentModalOpen}
            onClose={() => setIsAddStudentModalOpen(false)}
            onSave={onAddNewStudent}
        />
        </>
    );
};

const AddLessonModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (lessonName: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name);
        setName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">הוספת שיעור חדש</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם השיעור</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="לדוגמה: שיעור 1: מבוא"/>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור שיעור</button>
                </div>
            </div>
        </div>
    );
};

const EditLessonTitleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (newTitle: string) => void;
    currentTitle: string;
}> = ({ isOpen, onClose, onSave, currentTitle }) => {
    const [name, setName] = useState(currentTitle);

    useEffect(() => {
        if(isOpen) {
            setName(currentTitle);
        }
    }, [isOpen, currentTitle]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim()) return;
        onSave(name);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">עריכת שם שיעור</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם השיעור</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור שינויים</button>
                </div>
            </div>
        </div>
    );
};


const LessonManagementTab: React.FC<{
    lessons: AdminLesson[];
    onAddLesson: () => void;
    onSelectLessonToEdit: (lessonId: string) => void;
    onEditLessonTitle: (lessonId: string) => void;
    onDeleteLesson: (lessonId: string) => void;
}> = ({ lessons, onAddLesson, onSelectLessonToEdit, onEditLessonTitle, onDeleteLesson }) => {
    return (
        <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold">ניהול שיעורים</h2>
                 <button onClick={onAddLesson} className="bg-orange-600/80 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                    <PlusIcon />
                    <span>הוסף שיעור חדש</span>
                </button>
            </div>
            <div className="bg-[#1C2434] rounded-lg">
                <ul className="divide-y divide-slate-700/50">
                    {lessons.map(lesson => (
                        <li key={lesson.id} onClick={() => onSelectLessonToEdit(lesson.id)} className="p-4 flex justify-between items-center hover:bg-slate-800/20 cursor-pointer">
                            <div className="flex items-center gap-3">
                                <VideoCameraIcon />
                                <span className="font-semibold text-slate-200">{lesson.title}</span>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={(e) => { e.stopPropagation(); onEditLessonTitle(lesson.id); }} className="text-slate-400 hover:text-orange-400 transition-colors" title="ערוך שם שיעור"><PencilIcon /></button>
                                <button onClick={(e) => { e.stopPropagation(); onDeleteLesson(lesson.id); }} className="text-slate-400 hover:text-red-500 transition-colors" title="מחק שיעור"><TrashIcon /></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
             {lessons.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    <p>עדיין לא נוספו שיעורים למחזור זה.</p>
                </div>
            )}
        </div>
    )
}

const TabButton: React.FC<{ isActive: boolean; onClick: () => void; children: React.ReactNode; }> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 text-lg font-semibold border-b-2 transition-colors ${
            isActive 
            ? 'text-orange-400 border-orange-400' 
            : 'text-slate-400 border-transparent hover:text-white'
        }`}
    >
        {children}
    </button>
);

export const AdminEditCyclePage: React.FC<AdminEditCyclePageProps> = (props) => {
    const { course, cycle, allStudents, allTeamMembers, onBack, onAddLesson, onSelectLessonToEdit, onUpdateLessonTitle, onDeleteLesson, onUpdateCycle, onUpdateStudentEnrollmentDetails, onAddNewStudent, onUpdateStudentDetails } = props;
    const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false);
    const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [activeTab, setActiveTab] = useState('lessons');

    // State for the cycle details form
    const [name, setName] = useState(cycle.name);
    const [startDate, setStartDate] = useState(cycle.startDate);
    const [endDate, setEndDate] = useState(cycle.endDate);
    const [status, setStatus] = useState(cycle.status);
    const [mentorIds, setMentorIds] = useState(cycle.mentorIds);
    
     useEffect(() => {
        setName(cycle.name);
        setStartDate(cycle.startDate);
        setEndDate(cycle.endDate);
        setStatus(cycle.status);
        setMentorIds(cycle.mentorIds);
    }, [cycle]);

    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000);
    };

    const handleSaveChanges = () => {
        onUpdateCycle(course.id, cycle.id, { name, startDate, endDate, status, mentorIds });
        showFeedback('פרטי המחזור עודכנו בהצלחה!');
    };

    const handleMentorToggle = (mentorId: string) => {
        setMentorIds(prev => prev.includes(mentorId) ? prev.filter(id => id !== mentorId) : [...prev, mentorId]);
    };

    const handleSaveNewLesson = (lessonName: string) => {
        onAddLesson(lessonName);
        setIsAddLessonModalOpen(false);
    }
    
    const handleEditTitle = (lessonId: string) => {
        const lessonToEdit = cycle.lessons.find(l => l.id === lessonId);
        if (lessonToEdit) {
            setEditingLesson(lessonToEdit);
        }
    };

    const handleSaveTitle = (newTitle: string) => {
        if(editingLesson) {
            onUpdateLessonTitle(editingLesson.id, newTitle);
            setEditingLesson(null);
        }
    };

    const handleDelete = (lessonId: string) => {
        if (window.confirm('האם אתה בטוח שברצונך למחוק שיעור זה? לא ניתן לשחזר פעולה זו.')) {
            onDeleteLesson(lessonId);
        }
    };
    
    const studentsInCycle = allStudents.filter(student => 
        student.enrollments.some(e => e.cycleId === cycle.id)
    );
    

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
                    <span>חזרה לקורס: {course.name}</span>
                </button>
                <div>
                    <h1 className="text-4xl font-bold">ניהול מחזור: {cycle.name}</h1>
                </div>
            </header>

            <div className="border-b border-slate-700 mb-8">
                <TabButton isActive={activeTab === 'lessons'} onClick={() => setActiveTab('lessons')}>ניהול שיעורים</TabButton>
                <TabButton isActive={activeTab === 'students'} onClick={() => setActiveTab('students')}>ניהול תלמידים</TabButton>
                {/* Karin's hub is now a separate page */}
            </div>
            
            {activeTab === 'lessons' && (
                <LessonManagementTab 
                    lessons={cycle.lessons} 
                    onAddLesson={() => setIsAddLessonModalOpen(true)}
                    onSelectLessonToEdit={onSelectLessonToEdit}
                    onEditLessonTitle={handleEditTitle}
                    onDeleteLesson={handleDelete}
                />
            )}

            {activeTab === 'students' && (
                <CycleStudentManagementTable
                   studentsInCycle={studentsInCycle}
                   cycle={cycle}
                   courseId={course.id}
                   teamMembers={allTeamMembers}
                   onUpdateStudentEnrollmentDetails={onUpdateStudentEnrollmentDetails}
                   onUpdateStudentDetails={onUpdateStudentDetails}
                   onAddNewStudent={onAddNewStudent}
                />
            )}
            
        </div>
        <AddLessonModal 
            isOpen={isAddLessonModalOpen} 
            onClose={() => setIsAddLessonModalOpen(false)} 
            onSave={handleSaveNewLesson} 
        />
        {editingLesson && (
            <EditLessonTitleModal 
                isOpen={!!editingLesson}
                onClose={() => setEditingLesson(null)}
                onSave={handleSaveTitle}
                currentTitle={editingLesson.title}
            />
        )}
        </>
    );
};