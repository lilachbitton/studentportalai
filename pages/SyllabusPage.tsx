import React from 'react';
import { VideoCameraIcon, CheckCircleIcon } from '../components/Icons';

const mockSyllabus = {
    courseName: 'שיווק דיגיטלי',
    lessons: [
        { id: 'l1', title: 'שיעור 1: מבוא לשיווק דיגיטלי', completed: true },
        { id: 'l2', title: 'שיעור 2: מחקר מילות מפתח', completed: true },
        { id: 'l3', title: 'שיעור 3: קידום אורגני (SEO)', completed: true },
        { id: 'l4', title: 'שיעור 4: קידום ממומן (PPC)', completed: false },
        { id: 'l5', title: 'שיעור 5: שיווק ברשתות חברתיות', completed: false },
        { id: 'l6', title: 'שיעור 6: שיווק באמצעות תוכן', completed: false },
    ]
};

export const SyllabusPage: React.FC = () => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">סילבוס: {mockSyllabus.courseName}</h1>
                <p className="text-slate-400 mt-2">צפי בשיעורי הקורס והתקדמי בחומר הנלמד.</p>
            </header>
            <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                <ul className="divide-y divide-slate-700/50">
                    {mockSyllabus.lessons.map(lesson => (
                        <li key={lesson.id} className="p-4 flex justify-between items-center hover:bg-slate-800/20 cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.completed ? 'bg-orange-600' : 'bg-slate-600'}`}>
                                    <VideoCameraIcon />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-200">{lesson.title}</p>
                                    <p className={`text-sm ${lesson.completed ? 'text-green-400' : 'text-slate-400'}`}>
                                        {lesson.completed ? 'הושלם' : 'טרם הושלם'}
                                    </p>
                                </div>
                            </div>
                            {lesson.completed && <CheckCircleIcon />}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
