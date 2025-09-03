import React, { useState, useMemo, useEffect } from 'react';
import { AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment, Payment } from './AdminCoursesPage';
import { AdminStudent } from './AdminStudentsPage';

interface KarinHubPageProps {
    allCourses: AdminCourse[];
    allStudents: AdminStudent[];
    allTeamMembers: AdminTeamMember[];
    onUpdateStudentEnrollmentDetails: (studentId: string, courseId: string, cycleId: string, field: keyof StudentEnrollment, value: any) => void;
}

// Re-using EditableCell components from AdminEditCyclePage might be a good idea in a real project
const EditableCell: React.FC<{ value: any; onChange: (value: any) => void; type?: string; options?: any[]; className?: string }> = ({ value, onChange, type = 'text', options, className }) => {
    const commonClass = "w-full bg-transparent p-1 rounded focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-[#2a384e] text-slate-200";
    if (type === 'select') {
        return (
            <select value={value || ''} onChange={e => onChange(e.target.value)} className={`${commonClass} ${className}`}>
                {options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
        );
    }
    if (type === 'checkbox') {
        return <div className="flex justify-center"><input type="checkbox" checked={!!value} onChange={e => onChange(e.target.checked)} className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600 rounded"/></div>
    }
    return <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className={`${commonClass} ${className}`} />;
}

const OnboardingTable: React.FC<{ students: AdminStudent[], cycleId: string, onUpdate: Function, teamMembers: AdminTeamMember[] }> = ({ students, cycleId, onUpdate, teamMembers }) => {
    const mentors = teamMembers.filter(tm => tm.department === 'Mentoring');
    const strategyConsultants = [{value: 'אפרת', label: 'אפרת'}, {value: 'ארזית', label: 'ארזית'}];

    return (
        <table className="w-full text-right text-sm whitespace-nowrap">
            <thead className="border-b-2 border-slate-600 text-slate-400">
                <tr>
                    <th className="p-3">שם מלא</th>
                    <th className="p-3">עיסוק</th>
                    <th className="p-3">הודעת ברוך הבא</th>
                    <th className="p-3">פגישה עם קרין</th>
                    <th className="p-3">תאריך פגישת הכרות</th>
                    <th className="p-3">מלווה משוייך</th>
                    <th className="p-3">סיכום פגישה</th>
                    <th className="p-3">מטרות</th>
                    <th className="p-3">מידע חשוב</th>
                    <th className="p-3">הערות</th>
                    <th className="p-3">סיכום למלווה</th>
                    <th className="p-3">פגישת אסטרטגיה</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {students.map(s => {
                    const enrollment = s.enrollments.find(e => e.cycleId === cycleId);
                    if (!enrollment) return null;
                    return (
                        <tr key={s.id}>
                            <td className="p-2 font-semibold text-slate-200">{s.name}</td>
                            <td className="p-2 text-slate-300">{enrollment.occupation}</td>
                            <td className="p-2"><EditableCell type="checkbox" value={enrollment.welcomeMessageSent} onChange={val => onUpdate(s.id, 'welcomeMessageSent', val)} /></td>
                            <td className="p-2"><EditableCell type="checkbox" value={enrollment.karinMeetingScheduled} onChange={val => onUpdate(s.id, 'karinMeetingScheduled', val)} /></td>
                            <td className="p-2"><EditableCell type="date" value={enrollment.onboardingMeetingDate} onChange={val => onUpdate(s.id, 'onboardingMeetingDate', val)} /></td>
                            <td className="p-2"><EditableCell type="select" value={enrollment.mentorId} onChange={val => onUpdate(s.id, 'mentorId', val)} options={[{value: '', label: '-- בחר --'}, ...mentors.map(m => ({value: m.id, label: m.name}))]} /></td>
                            <td className="p-2"><EditableCell value={enrollment.meetingSummary} onChange={val => onUpdate(s.id, 'meetingSummary', val)} /></td>
                            <td className="p-2"><EditableCell value={enrollment.goals} onChange={val => onUpdate(s.id, 'goals', val)} /></td>
                            <td className="p-2"><EditableCell value={enrollment.importantInfo} onChange={val => onUpdate(s.id, 'importantInfo', val)} /></td>
                            <td className="p-2"><EditableCell value={enrollment.notes} onChange={val => onUpdate(s.id, 'notes', val)} /></td>
                            <td className="p-2"><EditableCell value={enrollment.summaryForMentor} onChange={val => onUpdate(s.id, 'summaryForMentor', val)} /></td>
                            <td className="p-2"><EditableCell type="select" value={enrollment.strategyConsultant} onChange={val => onUpdate(s.id, 'strategyConsultant', val)} options={[{value: '', label: '-- בחר --'}, ...strategyConsultants]} /></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    );
};

const StrategyMeetingsTable: React.FC<{ students: AdminStudent[], cycleId: string, onUpdate: Function }> = ({ students, cycleId, onUpdate }) => {
    // Similar implementation to OnboardingTable, but with different columns
    const urgencyOptions = [{value: '', label: 'בחר'},{value: 'דחוף מאוד', label: 'דחוף מאוד'}, {value: 'עדיפות שניה', label: 'עדיפות שניה'}, {value: 'לא דחוף', label: 'לא דחוף'}];
    const statusOptions = [{value: '', label: 'בחר'},{value: 'טרם נקבע', label: 'טרם נקבע'}, {value: 'נקבע', label: 'נקבע'}, {value: 'ממתין לאישור', label: 'ממתין לאישור'}, {value: 'לדחות', label: 'לדחות'}];

     return (
        <table className="w-full text-right text-sm whitespace-nowrap">
            <thead className="border-b-2 border-slate-600 text-slate-400">
                <tr>
                    <th className="p-3">שם מלא</th>
                    <th className="p-3">עיסוק</th>
                    <th className="p-3">מלווה</th>
                    <th className="p-3">פגישת אסטרטגיה</th>
                    <th className="p-3">דחיפות</th>
                    <th className="p-3">תאריך ושעה</th>
                    <th className="p-3">סטטוס</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                 {students.map(s => {
                    const enrollment = s.enrollments.find(e => e.cycleId === cycleId);
                    if (!enrollment) return null;
                    return (
                        <tr key={s.id}>
                            <td className="p-2 font-semibold text-slate-200">{s.name}</td>
                            <td className="p-2 text-slate-300">{enrollment.occupation}</td>
                            <td className="p-2 text-slate-300">{'שם מלווה'}</td>
                            <td className="p-2 text-slate-300">{enrollment.strategyConsultant}</td>
                            <td className="p-2"><EditableCell type="select" options={urgencyOptions} value={enrollment.strategyMeetingUrgency} onChange={val => onUpdate(s.id, 'strategyMeetingUrgency', val)} /></td>
                            <td className="p-2"><EditableCell type="datetime-local" value={enrollment.strategyMeetingDate} onChange={val => onUpdate(s.id, 'strategyMeetingDate', val)} /></td>
                            <td className="p-2"><EditableCell type="select" options={statusOptions} value={enrollment.strategyMeetingStatus} onChange={val => onUpdate(s.id, 'strategyMeetingStatus', val)} /></td>
                        </tr>
                    )
                 })}
            </tbody>
        </table>
    );
};

const AttendanceTable: React.FC<{ students: AdminStudent[], cycle: Cycle | undefined, onUpdate: Function }> = ({ students, cycle, onUpdate }) => {
    if (!cycle) return null;
    return (
        <table className="w-full text-right text-sm whitespace-nowrap">
            <thead className="border-b-2 border-slate-600 text-slate-400">
                <tr>
                    <th className="p-3">שם מלא</th>
                    <th className="p-3">מקצוע</th>
                    {cycle.lessons.map(l => <th key={l.id} className="p-3">{l.title}</th>)}
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
                {students.map(s => {
                    const enrollment = s.enrollments.find(e => e.cycleId === cycle.id);
                    return (
                    <tr key={s.id}>
                        <td className="p-2 font-semibold text-slate-200">{s.name}</td>
                        <td className="p-2 text-slate-300">{enrollment?.occupation}</td>
                        {cycle.lessons.map(l => {
                            const attendance = enrollment?.attendance?.find(a => a.lessonId === l.id);
                            return (
                                <td key={l.id} className="p-2 text-center" title={attendance?.reason}>
                                    {attendance?.present ? <span className="text-green-400">V</span> : <span className="text-red-400">X</span>}
                                </td>
                            )
                        })}
                    </tr>
                )})}
            </tbody>
        </table>
    );
};

export const KarinHubPage: React.FC<KarinHubPageProps> = ({ allCourses, allStudents, allTeamMembers, onUpdateStudentEnrollmentDetails }) => {
    const [selectedCourseId, setSelectedCourseId] = useState<string>(allCourses[0]?.id || '');
    const [selectedCycleId, setSelectedCycleId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'onboarding' | 'strategy' | 'attendance'>('onboarding');

    const selectedCourse = useMemo(() => allCourses.find(c => c.id === selectedCourseId), [allCourses, selectedCourseId]);
    
    useEffect(() => {
        // When course changes, set cycle to the first available one, or empty
        setSelectedCycleId(selectedCourse?.cyclesData[0]?.id || '');
    }, [selectedCourseId, selectedCourse]);

    const studentsInCycle = useMemo(() => {
        if (!selectedCycleId) return [];
        return allStudents.filter(s => s.enrollments.some(e => e.cycleId === selectedCycleId && e.status === 'active'));
    }, [allStudents, selectedCycleId]);
    
     const handleUpdate = (studentId: string, field: keyof StudentEnrollment, value: any) => {
        if (!selectedCourseId || !selectedCycleId) return;
        onUpdateStudentEnrollmentDetails(studentId, selectedCourseId, selectedCycleId, field, value);
    };


    return (
        <div className="text-white space-y-8">
            <header className="mb-8">
                <div>
                    <h1 className="text-4xl font-bold">מרכז הבקרה של קרין</h1>
                    <p className="text-slate-400 mt-2">ניהול ומעקב אחר התקדמות התלמידים במחזורים השונים.</p>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-4 p-4 bg-[#243041] rounded-2xl">
                <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">בחר קורס</label>
                    <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[200px]">
                        <option value="" disabled>-- בחר קורס --</option>
                        {allCourses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-sm font-semibold text-slate-300 mb-2 block">בחר מחזור</label>
                    <select value={selectedCycleId} onChange={e => setSelectedCycleId(e.target.value)} className="p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-[200px]" disabled={!selectedCourseId}>
                        <option value="" disabled>-- בחר מחזור --</option>
                        {selectedCourse?.cyclesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Tabs and Tables */}
            {selectedCycleId ? (
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <div className="border-b border-slate-700 mb-6">
                        <button onClick={() => setActiveTab('onboarding')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'onboarding' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400'}`}>פגישות אונבורדינג</button>
                        <button onClick={() => setActiveTab('strategy')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'strategy' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400'}`}>פגישות אסטרטגיה</button>
                        <button onClick={() => setActiveTab('attendance')} className={`px-4 py-2 text-sm font-semibold ${activeTab === 'attendance' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-slate-400'}`}>מעקב נוכחות</button>
                    </div>
                    <div className="overflow-x-auto">
                        {activeTab === 'onboarding' && <OnboardingTable students={studentsInCycle} cycleId={selectedCycleId} onUpdate={handleUpdate} teamMembers={allTeamMembers} />}
                        {activeTab === 'strategy' && <StrategyMeetingsTable students={studentsInCycle} cycleId={selectedCycleId} onUpdate={handleUpdate} />}
                        {activeTab === 'attendance' && <AttendanceTable students={studentsInCycle} cycle={selectedCourse?.cyclesData.find(c => c.id === selectedCycleId)} onUpdate={handleUpdate} />}
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-slate-500 bg-[#243041] rounded-2xl">
                    <p>אנא בחר קורס ומחזור כדי להציג נתונים.</p>
                </div>
            )}
        </div>
    );
};