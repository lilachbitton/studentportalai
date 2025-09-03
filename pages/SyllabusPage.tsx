import React from 'react';
import type { Course } from './StudentDashboard';

// --- ICONS ---
const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">{path}</svg>
);
const CheckCircleIcon = () => <Icon className="w-6 h-6 text-orange-400" path="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />;


interface SyllabusPageProps {
    course: Course;
}

export const SyllabusPage: React.FC<SyllabusPageProps> = ({ course }) => {
    return (
        <div className="text-white max-w-4xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold mb-2">{course.title}</h1>
                <p className="text-xl text-slate-400">סילבוס הקורס</p>
            </header>

            <div className="bg-[#243041] p-8 rounded-2xl shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-4 text-orange-400 border-b-2 border-orange-400/20 pb-2">תיאור הקורס</h2>
                <p className="text-slate-300 leading-relaxed">
                    {course.syllabus.description}
                </p>
            </div>

            <div className="bg-[#243041] p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6 text-orange-400 border-b-2 border-orange-400/20 pb-2">נושאי הלימוד</h2>
                <ul className="space-y-4">
                    {course.syllabus.topics.map((topic, index) => (
                        <li key={index} className="flex items-center p-4 bg-[#1C2434] rounded-lg">
                            <CheckCircleIcon />
                            <span className="mr-4 text-lg font-semibold text-slate-200">{topic}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};