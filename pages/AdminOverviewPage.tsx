import React from 'react';
import { AdminStudent } from './AdminStudentsPage';
import { AdminCourse } from './AdminCoursesPage';
import { Ticket } from './TicketsPage';
import { TeamIcon, CoursesIcon, TicketsIcon } from '../components/Icons';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass }) => (
    <div className="bg-[#243041] p-6 rounded-2xl shadow-lg flex items-center gap-6">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-4xl font-bold text-white">{value}</p>
            <h3 className="text-slate-400 font-semibold">{title}</h3>
        </div>
    </div>
);

interface AdminOverviewPageProps {
    students: AdminStudent[];
    courses: AdminCourse[];
    tickets: Ticket[];
}

export const AdminOverviewPage: React.FC<AdminOverviewPageProps> = ({ students, courses, tickets }) => {
    const activeStudentsCount = students.filter(s => s.status === 'פעיל').length;
    const coursesCount = courses.length;
    const openTicketsCount = tickets.filter(t => t.status === 'פתוחה').length;

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">סקירה כללית</h1>
                <p className="text-slate-400 mt-2">ברוך שובך! להלן סיכום הפעילות במערכת.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                <StatCard 
                    title="תלמידים פעילים" 
                    value={activeStudentsCount} 
                    icon={<TeamIcon />} 
                    colorClass="bg-blue-500/30 text-blue-300"
                />
                <StatCard 
                    title="קורסים פעילים" 
                    value={coursesCount} 
                    icon={<CoursesIcon />} 
                    colorClass="bg-orange-500/30 text-orange-300"
                />
                <StatCard 
                    title="פניות פתוחות" 
                    value={openTicketsCount} 
                    icon={<TicketsIcon />} 
                    colorClass="bg-green-500/30 text-green-300"
                />
            </div>
            
            {/* Future sections for charts or tables can be added here */}
            <div className="bg-[#243041] p-6 rounded-2xl shadow-lg h-96 flex items-center justify-center">
                <p className="text-slate-500">איזורי תצוגה נוספים יתווספו כאן בעתיד.</p>
            </div>
        </div>
    );
};
