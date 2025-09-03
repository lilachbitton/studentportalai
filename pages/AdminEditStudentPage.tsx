import React, { useState, useEffect } from 'react';
import type { AdminStudent } from './AdminStudentsPage';
import type { AdminCourse, Cycle, AdminTeamMember, StudentEnrollment } from './AdminCoursesPage';
import { Ticket, ConversationMessage } from './TicketsPage';
import { ChevronRightIcon, PlusIcon, XIcon, ChatIcon, PencilIcon } from '../components/Icons';

interface AdminEditStudentPageProps {
    student: AdminStudent;
    allCourses: AdminCourse[];
    allTeamMembers: AdminTeamMember[];
    tickets: Ticket[];
    onBack: () => void;
    onUpdateStudent: (studentId: string, updatedData: Partial<Omit<AdminStudent, 'id'>>) => void;
    onChangeCycle: (studentId: string, courseId: string, newCycleId: string) => void;
    onUpdateEnrollment: (studentId: string, courseId: string, newMentorId: string) => void;
    onAdminReply: (ticketId: string, replyText: string) => void;
}

// Re-using ViewTicketModal for consistency
const ViewTicketModal: React.FC<{ 
    ticket: Ticket | null; 
    onClose: () => void;
    onReply: (ticketId: string, replyText: string) => void;
}> = ({ ticket, onClose, onReply }) => {
    const [reply, setReply] = useState('');
    const [currentTicket, setCurrentTicket] = useState(ticket);

    useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    if (!currentTicket) return null;

    const handleReply = () => {
        if (!reply.trim()) return;
        
        onReply(currentTicket.id, reply);

        // Optimistically update UI
        const newReplyMessage: ConversationMessage = {
            sender: 'you',
            name: 'מנהל מערכת',
            text: reply,
            time: new Date().toLocaleString('he-IL'),
        };
        setCurrentTicket(prev => {
            if (!prev) return null;
            return {
                ...prev,
                conversation: [...prev.conversation, newReplyMessage]
            };
        });
        
        setReply('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6 h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">{currentTicket.subject}</h3>
                        <p className="text-sm text-slate-400">פנייה מס' {currentTicket.id} מאת {currentTicket.conversation[0]?.name || 'תלמיד'}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-[#1C2434] rounded-lg">
                    {currentTicket.conversation.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-3 ${msg.sender === 'you' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-3 rounded-xl max-w-lg ${msg.sender === 'you' ? 'bg-orange-600' : 'bg-slate-700'}`}>
                                <p className="font-bold text-sm mb-1">{msg.name}</p>
                                <p className="text-slate-200">{msg.text}</p>
                                <p className="text-xs text-slate-400 mt-2 text-left">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mt-4 pt-4 border-t border-slate-700 flex-shrink-0">
                    <textarea 
                        rows={3} 
                        className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg" 
                        placeholder="הוסף תגובה..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                    />
                    <div className="flex justify-end mt-3">
                         <button onClick={handleReply} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold">שלח תגובה</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ViewTaskModal: React.FC<{ task: any | null; onClose: () => void; }> = ({ task, onClose }) => {
    if (!task) return null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6 h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                 <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">{task.title}</h3>
                        <p className="text-sm text-slate-400">סטטוס: {task.status}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-[#1C2434] rounded-lg">
                    <div>
                        <h4 className="font-semibold text-orange-400 mb-2">הגשת התלמיד</h4>
                        <p className="text-slate-300 p-4 bg-slate-700/50 rounded-lg whitespace-pre-wrap">{task.submission || 'התלמיד עדיין לא הגיש משימה זו.'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-orange-400 mb-2">משוב המלווה</h4>
                        <p className="text-slate-300 p-4 bg-slate-700/50 rounded-lg whitespace-pre-wrap">{task.feedback || 'טרם ניתן משוב.'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const ChangeCycleModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCycleId: string) => void;
    course: AdminCourse;
    currentCycleId: string;
}> = ({ isOpen, onClose, onSave, course, currentCycleId }) => {
    const [selectedCycleId, setSelectedCycleId] = useState(currentCycleId);
    
    if(!isOpen) return null;

    const handleSave = () => {
        if (!selectedCycleId) return;
        onSave(selectedCycleId);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">העברת מחזור עבור {course.name}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">בחר מחזור חדש</label>
                        <select value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option value="" disabled>-- בחר מחזור --</option>
                           {course.cyclesData.map(cy => <option key={cy.id} value={cy.id}>{cy.name}</option>)}
                        </select>
                    </div>
                </div>
                 <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור שינוי</button>
                </div>
            </div>
        </div>
    )
}

const EnrollStudentModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onEnroll: (courseId: string, cycleId: string) => void;
    allCourses: AdminCourse[];
    studentEnrollments: StudentEnrollment[];
}> = ({ isOpen, onClose, onEnroll, allCourses, studentEnrollments }) => {
    const studentEnrolledCourseIds = studentEnrollments.map(e => e.courseId);
    const availableCourses = allCourses.filter(c => !studentEnrolledCourseIds.includes(c.id));
    const [selectedCourseId, setSelectedCourseId] = useState(availableCourses[0]?.id || '');
    const [selectedCycleId, setSelectedCycleId] = useState('');
    
    const selectedCourse = allCourses.find(c => c.id === selectedCourseId);

    useEffect(() => {
        if(isOpen && availableCourses.length > 0 && !selectedCourseId) {
            setSelectedCourseId(availableCourses[0].id);
        }
    }, [isOpen, availableCourses, selectedCourseId]);

    useEffect(() => {
        setSelectedCycleId('');
    }, [selectedCourseId]);
    
    if(!isOpen) return null;

    const handleEnroll = () => {
        if (!selectedCourseId || !selectedCycleId) return;
        onEnroll(selectedCourseId, selectedCycleId);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">שיוך לקורס ומחזור</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">בחר קורס</label>
                        <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option value="" disabled>-- בחר קורס --</option>
                           {availableCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                     {selectedCourse && selectedCourse.cyclesData.length > 0 && (
                         <div>
                            <label className="text-sm font-semibold text-slate-300 mb-2 block">בחר מחזור</label>
                            <select value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                               <option value="" disabled>-- בחר מחזור --</option>
                               {selectedCourse.cyclesData.map(cy => <option key={cy.id} value={cy.id}>{cy.name}</option>)}
                            </select>
                        </div>
                     )}
                     {selectedCourse && selectedCourse.cyclesData.length === 0 && (
                         <p className="text-sm text-yellow-400 text-center p-2 bg-yellow-400/10 rounded-lg">לקורס זה לא קיימים מחזורים.</p>
                     )}
                </div>
                 <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleEnroll} disabled={!selectedCycleId} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors disabled:bg-slate-500 disabled:cursor-not-allowed">שייך תלמיד</button>
                </div>
            </div>
        </div>
    )
}


export const AdminEditStudentPage: React.FC<AdminEditStudentPageProps> = ({ student, allCourses, allTeamMembers, tickets, onBack, onUpdateStudent, onChangeCycle, onUpdateEnrollment, onAdminReply }) => {
    const [name, setName] = useState(student.name);
    const [email, setEmail] = useState(student.email);
    const [phone, setPhone] = useState(student.phone);
    const [status, setStatus] = useState(student.status);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [isChangeCycleModalOpen, setIsChangeCycleModalOpen] = useState(false);
    const [selectedCourseForCycleChange, setSelectedCourseForCycleChange] = useState<AdminCourse | null>(null);
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
    const [viewingTask, setViewingTask] = useState<any | null>(null);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000); // Hide after 3 seconds
    };

    const handleSaveChanges = () => {
        onUpdateStudent(student.id, { name, email, phone, status });
        showFeedback('הפרטים נשמרו בהצלחה!');
    };
    
    const handleResetPassword = () => {
        // No confirmation needed as per user request, direct action
        console.log(`Resetting password for ${student.name} to 12345678`);
        showFeedback(`הסיסמה עבור ${student.name} אופסה ל- '12345678'.`);
    };
    
    const handleEnroll = (courseId: string, cycleId: string) => {
        const cycle = allCourses.find(c => c.id === courseId)?.cyclesData.find(cy => cy.id === cycleId);
        const defaultMentorId = cycle?.mentorIds[0] || '';
        
        const newEnrollment: StudentEnrollment = { courseId, cycleId, mentorId: defaultMentorId, status: 'active' };
        const updatedEnrollments = [...student.enrollments, newEnrollment];
        onUpdateStudent(student.id, { enrollments: updatedEnrollments });
    };
    
    const openChangeCycleModal = (course: AdminCourse) => {
        setSelectedCourseForCycleChange(course);
        setIsChangeCycleModalOpen(true);
    };

    const handleSaveCycleChange = (newCycleId: string) => {
        if(selectedCourseForCycleChange) {
            onChangeCycle(student.id, selectedCourseForCycleChange.id, newCycleId);
            setIsChangeCycleModalOpen(false);
            setSelectedCourseForCycleChange(null);
        }
    };

    const enrolledCourseDetails = student.enrollments
        .map(enrollment => {
            const course = allCourses.find(c => c.id === enrollment.courseId);
            if (!course) return null;
            const cycle = course.cyclesData.find(cy => cy.id === enrollment.cycleId);
            const mentor = allTeamMembers.find(tm => tm.id === enrollment.mentorId);
            const availableMentors = allTeamMembers.filter(tm => cycle?.mentorIds.includes(tm.id));
            return { course, cycle, mentor, availableMentors };
        })
        .filter((item): item is { course: AdminCourse; cycle: Cycle | undefined, mentor: AdminTeamMember | undefined, availableMentors: AdminTeamMember[] } => !!item);
        
    const mockTasks = [
        {title: 'מחקר מילות מפתח', status: 'ממתין למשוב', submission: 'הגשה לדוגמה...\nשלום,\nזוהי הגשת המשימה שלי בנושא מחקר מילות מפתח.\nמקווה שזה בסדר.\n\nתודה,\nישראל', feedback: 'עבודה טובה! רק צריך להרחיב את המחקר גם למילות מפתח ארוכות זנב.'},
        {title: 'הכנת פוסט לפייסבוק', status: 'יש משוב', submission: 'טקסט הפוסט מצורף כאן.', feedback: 'היי, המשוב שלי הוא...'},
        {title: 'בניית דף נחיתה', status: 'הושלם', submission: 'הדף באוויר, הלינק מצורף.', feedback: 'נראה מעולה! כל הכבוד.'},
    ];
    
    const statusStyles: { [key: string]: string } = { 'פתוחה': 'text-green-400', 'סגורה': 'text-slate-400', };


    return (
        <>
            <div className="text-white relative">
                {feedbackMessage && (
                    <div className="absolute top-0 right-0 bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg animate-pulse z-50">
                        {feedbackMessage}
                    </div>
                )}

                <header className="mb-8">
                    <button onClick={onBack} className="flex items-center text-sm text-slate-400 hover:text-orange-400 transition-colors mb-4">
                        <ChevronRightIcon />
                        <span>חזרה לכל התלמידים</span>
                    </button>
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-4xl font-bold">כרטיס תלמיד: {student.name}</h1>
                            <p className="text-slate-400 mt-2">תלמיד/ה מאז: {new Date(student.joinDate).toLocaleDateString('he-IL')}</p>
                        </div>
                         <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2 transition-transform hover:scale-105">
                            <ChatIcon />
                            <span>מעבר לצ'אט</span>
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Details & Actions */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                            <h2 className="text-2xl font-bold mb-6">פרטים אישיים</h2>
                            <div className="flex flex-col items-center mb-6">
                                <img 
                                    src={student.imageUrl || 'https://via.placeholder.com/150'} 
                                    alt={`תמונת פרופיל של ${student.name}`}
                                    className="w-32 h-32 rounded-full ring-4 ring-slate-600 object-cover"
                                />
                                <button className="mt-4 text-sm text-orange-400 hover:underline">
                                    שנה תמונה
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">שם מלא</label>
                                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">דוא"ל</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">טלפון</label>
                                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg"/>
                                </div>
                                 <div>
                                    <label className="text-sm font-semibold text-slate-300 mb-2 block">סטטוס</label>
                                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg">
                                       <option value="פעיל">פעיל</option>
                                       <option value="לא פעיל">לא פעיל</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-slate-700 flex flex-col gap-3">
                                <button onClick={handleSaveChanges} className="w-full bg-orange-600 hover:bg-orange-700 font-bold py-2 rounded-lg">שמור שינויים</button>
                                <button onClick={handleResetPassword} className="w-full bg-slate-600 hover:bg-slate-700 py-2 rounded-lg">אפס סיסמא</button>
                            </div>
                        </div>
                    </div>

                     {/* Right Column - Enrollments & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold">קורסים רשומים</h2>
                                <button onClick={() => setIsEnrollModalOpen(true)} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                                    <PlusIcon />
                                    <span>שייך לקורס חדש</span>
                                </button>
                            </div>
                             <div className="space-y-3">
                                {enrolledCourseDetails.map(({ course, cycle, mentor, availableMentors }) => (
                                    <div key={course.id} className="bg-[#1C2434] p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span style={{ backgroundColor: course.color }} className="w-4 h-4 rounded-full flex-shrink-0"></span>
                                            <div>
                                                <span className="font-semibold">{course.name}</span>
                                                <span className="block text-xs text-slate-400">מחזור: {cycle ? cycle.name : 'לא משויך'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full sm:w-auto">
                                            <select
                                                value={mentor?.id || ''}
                                                onChange={(e) => onUpdateEnrollment(student.id, course.id, e.target.value)}
                                                className="w-full sm:w-auto text-xs bg-[#243041] border border-slate-600 rounded-md p-1 focus:ring-orange-500 focus:border-orange-500"
                                            >
                                                <option value="" disabled>שייך מלווה</option>
                                                {availableMentors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                            <button onClick={() => openChangeCycleModal(course)} className="text-xs text-orange-400 hover:text-orange-300 font-semibold border border-orange-400/50 rounded-md px-3 py-1 flex-shrink-0">העבר מחזור</button>
                                        </div>
                                    </div>
                                ))}
                                {enrolledCourseDetails.length === 0 && <p className="text-center text-slate-500 py-6">התלמיד אינו רשום לאף קורס.</p>}
                             </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                               <h2 className="text-2xl font-bold mb-4">משימות אחרונות</h2>
                               <div className="space-y-2">
                                    {mockTasks.map((task, i) => (
                                    <div key={i} onClick={() => setViewingTask(task)} className="text-slate-300 p-2 rounded-md bg-[#1C2434] flex justify-between hover:bg-slate-700/50 cursor-pointer">
                                        <span>{task.title}</span>
                                        <span className="text-xs text-slate-400">{task.status}</span>
                                    </div>))}
                               </div>
                           </div>
                            <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                               <h2 className="text-2xl font-bold mb-4">פניות אחרונות</h2>
                                <div className="space-y-2">
                                    {tickets.map((ticket) => (
                                        <div key={ticket.id} onClick={() => setViewingTicket(ticket)} className="text-slate-300 p-2 rounded-md bg-[#1C2434] flex justify-between hover:bg-slate-700/50 cursor-pointer">
                                            <span>{ticket.subject}</span>
                                            <span className={`text-xs font-semibold ${statusStyles[ticket.status]}`}>{ticket.status}</span>
                                        </div>
                                    ))}
                                    {tickets.length === 0 && <p className="text-center text-sm text-slate-500 py-4">אין פניות להצגה.</p>}
                               </div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
            <EnrollStudentModal 
                isOpen={isEnrollModalOpen} 
                onClose={() => setIsEnrollModalOpen(false)} 
                onEnroll={handleEnroll}
                allCourses={allCourses}
                studentEnrollments={student.enrollments}
            />
            {selectedCourseForCycleChange && (
                 <ChangeCycleModal
                    isOpen={isChangeCycleModalOpen}
                    onClose={() => setIsChangeCycleModalOpen(false)}
                    onSave={handleSaveCycleChange}
                    course={selectedCourseForCycleChange}
                    currentCycleId={student.enrollments.find(e => e.courseId === selectedCourseForCycleChange.id)?.cycleId || ''}
                 />
            )}
            <ViewTicketModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} onReply={onAdminReply} />
            <ViewTaskModal task={viewingTask} onClose={() => setViewingTask(null)} />
        </>
    );
};