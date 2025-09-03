import React from 'react';
import { PlusIcon, TeamIcon, CoursesIcon, TicketsIcon } from '../components/Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string; }> = ({ title, value, icon, color }) => (
    <div className={`bg-[#243041] p-6 rounded-2xl shadow-lg flex items-center gap-5 border-l-4 ${color}`}>
        <div className="bg-slate-700/50 p-4 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className="text-slate-400">{title}</p>
        </div>
    </div>
);

const QuickActionButton: React.FC<{ title: string; icon: React.ReactNode; }> = ({ title, icon }) => (
    <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-transform hover:scale-105 w-full flex items-center justify-center gap-3 text-lg">
        {icon}
        <span>{title}</span>
    </button>
);

export const AdminOverviewPage: React.FC = () => {
    const recentActivity = [
        { text: 'ישראל ישראלי נרשם לקורס "תכנות מונחה עצמים".', time: 'לפני 5 דקות' },
        { text: 'פנייה חדשה נפתחה על ידי מאיה ישראלי.', time: 'לפני שעה' },
        { text: 'הוספת שיעור חדש: "Advanced SQL" למבוא למסדי נתונים.', time: 'לפני 3 שעות' },
        { text: 'יעל שחר הגיבה לפנייה TKT-004.', time: 'אתמול' },
    ];

    return (
        <div className="text-white space-y-8">
            <h1 className="text-4xl font-bold">סקירה כללית</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="תלמידים רשומים" value="124" icon={<TeamIcon />} color="border-blue-500" />
                <StatCard title="קורסים פעילים" value="8" icon={<CoursesIcon />} color="border-green-500" />
                <StatCard title="פניות פתוחות" value="12" icon={<TicketsIcon />} color="border-orange-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6">פעולות מהירות</h2>
                    <div className="space-y-4">
                        <QuickActionButton title="הוסף תלמיד חדש" icon={<PlusIcon />} />
                        <QuickActionButton title="הוסף קורס חדש" icon={<PlusIcon />} />
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                     <h2 className="text-2xl font-bold mb-6">פעילות אחרונה</h2>
                     <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4">
                               <div className="w-2 h-2 mt-2 bg-slate-500 rounded-full flex-shrink-0"></div>
                               <div>
                                    <p className="text-slate-200">{activity.text}</p>
                                    <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                               </div>
                           </div>
                        ))}
                     </div>
                </div>
            </div>
        </div>
    );
};
