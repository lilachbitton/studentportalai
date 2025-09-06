import React, { useState } from 'react';
import { DashboardIcon, CoursesIcon, CalendarIcon, ChatIcon, TicketsIcon, LogoutIcon, BellIcon, SearchIcon } from '../components/Icons';
import { Dashboard } from './Dashboard';
import { SyllabusPage } from './SyllabusPage';
import { CalendarPage } from './CalendarPage';
import { ChatPage } from './ChatPage';
import { TicketsPage, Ticket } from './TicketsPage'; // student version
import { StudentProfilePage } from './StudentProfilePage';

// This would come from an API
const mockStudentData = {
    name: 'ישראלה ישראלי',
    email: 'israela@example.com',
    courses: [
        { id: 'c1', name: 'שיווק דיגיטלי', progress: 75, color: '#F97316' },
        { id: 'c2', name: 'ניהול מוצר', progress: 30, color: '#3B82F6' }
    ],
    tickets: [
        { id: 't1', studentId: 's1', subject: 'שאלה על שיעור 3', status: 'פתוחה', lastUpdate: new Date().toISOString(), conversation: [{ sender: 'user', name: 'ישראלה ישראלי', text: 'היי, לא הבנתי את הנושא של...', time: '10:30' }] }
    ] as Ticket[],
};

type StudentView = 'dashboard' | 'syllabus' | 'calendar' | 'chat' | 'tickets' | 'profile';

const StudentSidebar: React.FC<{ activeView: StudentView, setView: (view: StudentView) => void, onLogout: () => void }> = ({ activeView, setView, onLogout }) => {
    const SidebarLink: React.FC<{ icon: React.ReactNode; label: string; viewId: StudentView; onClick?: () => void }> = ({ icon, label, viewId, onClick }) => (
        <a href="#" onClick={e => { e.preventDefault(); onClick ? onClick() : setView(viewId); }} className={`relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${activeView === viewId ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
            {icon}
            <span className="mr-4 font-semibold">{label}</span>
        </a>
    );

    return (
        <aside className="w-72 h-screen bg-[#1C2434] text-white flex flex-col p-5 shadow-lg hidden lg:flex">
            <div className="flex justify-center items-center py-4 mb-5">
                <img src="/logo.png" alt="Business Express Logo" className="h-12 w-auto" />
            </div>
            <nav className="flex-grow">
                <SidebarLink icon={<DashboardIcon />} label="לוח בקרה" viewId="dashboard" />
                <SidebarLink icon={<CoursesIcon />} label="הקורסים שלי" viewId="syllabus" />
                <SidebarLink icon={<CalendarIcon />} label="לוח שנה" viewId="calendar" />
                <SidebarLink icon={<ChatIcon />} label="צ'אט עם המלווה" viewId="chat" />
                <SidebarLink icon={<TicketsIcon />} label="פניות שירות" viewId="tickets" />
            </nav>
            <div className="mt-auto">
                <SidebarLink icon={<LogoutIcon />} label="התנתקות" viewId={'logout' as any} onClick={onLogout} />
            </div>
        </aside>
    );
};

const StudentHeader: React.FC<{ studentName: string; onProfileClick: () => void }> = ({ studentName, onProfileClick }) => {
    return (
        <header className="flex justify-between items-center p-5 bg-[#1C2434] text-slate-300 border-b border-slate-700">
             <div className="relative">
                <input type="search" placeholder="חיפוש..." className="rounded-full py-2 pr-10 pl-4 bg-[#243041]" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <SearchIcon />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative"><BellIcon /></button>
                <div onClick={onProfileClick} className="flex items-center space-x-2 pl-4 cursor-pointer">
                    <div className="text-right">
                        <div className="font-bold text-white">{studentName}</div>
                        <div className="text-sm text-slate-400">תלמידה</div>
                    </div>
                    <img src="/default-avatar.png" alt="Profile" className="w-10 h-10 rounded-full"/>
                </div>
            </div>
        </header>
    );
};

export const StudentDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [view, setView] = useState<StudentView>('dashboard');
    const [tickets, setTickets] = useState(mockStudentData.tickets);

    const handleNewTicket = (subject: string, message: string) => {
        // mock logic
    };

    const handleReply = (ticketId: string, replyText: string) => {
        // mock logic
    };

    const renderContent = () => {
        switch (view) {
            case 'dashboard': return <Dashboard courses={mockStudentData.courses} />;
            case 'syllabus': return <SyllabusPage />;
            case 'calendar': return <CalendarPage />;
            case 'chat': return <ChatPage />;
            case 'tickets': return <TicketsPage tickets={tickets} onNewTicket={handleNewTicket} onReply={handleReply} unreadTickets={[]} onMarkAsRead={()=>{}} />;
            case 'profile': return <StudentProfilePage student={mockStudentData} />;
            default: return <Dashboard courses={mockStudentData.courses} />;
        }
    };

    return (
        <div className="flex h-screen bg-[#1C2434] font-sans">
            <StudentSidebar activeView={view} setView={setView} onLogout={onLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <StudentHeader studentName={mockStudentData.name} onProfileClick={() => setView('profile')} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};
