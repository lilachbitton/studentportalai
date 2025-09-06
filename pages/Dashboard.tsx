import React from 'react';
import { BookOpenIcon } from '../components/Icons';

interface Course {
    id: string;
    name: string;
    progress: number;
    color: string;
}

interface DashboardProps {
    courses: Course[];
}

const CourseProgressCard: React.FC<{ course: Course }> = ({ course }) => (
    <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="font-bold text-xl text-white">{course.name}</h3>
                <p className="text-sm text-slate-400">התקדמות בקורס</p>
            </div>
            <div style={{ color: course.color }} className="text-2xl font-bold">
                <BookOpenIcon />
            </div>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className="h-2.5 rounded-full" style={{ width: `${course.progress}%`, backgroundColor: course.color }}></div>
        </div>
        <div className="flex justify-between text-sm text-slate-300 mt-2">
            <span>הושלם {course.progress}%</span>
            <button className="font-semibold text-orange-400 hover:underline">המשך לשיעור הבא</button>
        </div>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ courses }) => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">לוח בקרה</h1>
                <p className="text-slate-400 mt-2">ברוכה הבאה! כאן תוכלי לראות את כל העדכונים וההתקדמות שלך.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {courses.map(course => <CourseProgressCard key={course.id} course={course} />)}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">הודעות אחרונות</h2>
                    <p className="text-slate-500">אין הודעות חדשות.</p>
                </div>
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-white mb-4">משימות להגשה</h2>
                     <p className="text-slate-500">אין משימות קרובות להגשה.</p>
                </div>
            </div>
        </div>
    );
};
