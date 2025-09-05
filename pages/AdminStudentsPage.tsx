import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, SearchIcon } from '../components/Icons';
import type { StudentEnrollment } from './AdminCoursesPage';


export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'פעיל' | 'לא פעיל';
  enrollments: StudentEnrollment[];
  joinDate: string;
  imageUrl?: string;
}

interface AdminStudentsPageProps {
    students: AdminStudent[];
    onEditStudent: (studentId: string) => void;
}

export const AdminStudentsPage: React.FC<AdminStudentsPageProps> = ({ students, onEditStudent }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusStyles: { [key: string]: string } = {
        'פעיל': 'bg-green-500/20 text-green-400',
        'לא פעיל': 'bg-slate-500/20 text-slate-400',
    };

    return (
        <div className="text-white">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">ניהול תלמידים</h1>
                    <p className="text-slate-400 mt-2">ניהול כלל התלמידים הרשומים במערכת.</p>
                </div>
            </header>

            <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                <div className="mb-6">
                     <div className="relative">
                        <input 
                            type="search" 
                            placeholder="חיפוש תלמיד לפי שם או מייל..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full max-w-lg bg-[#1C2434] text-slate-300 rounded-lg py-2 pr-10 pl-3 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><SearchIcon /></div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-right">
                        <thead className="border-b-2 border-slate-700 text-sm text-slate-400">
                            <tr>
                                <th className="p-4 font-semibold">שם מלא</th>
                                <th className="p-4 font-semibold">סטטוס</th>
                                <th className="p-4 font-semibold">טלפון</th>
                                <th className="p-4 font-semibold">דוא"ל</th>
                                <th className="p-4 font-semibold">קורסים רשומים</th>
                                <th className="p-4 font-semibold">פעולות</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                            {filteredStudents.map(student => (
                                <tr key={student.id} onClick={() => onEditStudent(student.id)} className="hover:bg-slate-800/20 cursor-pointer">
                                    <td className="p-4 font-semibold text-slate-200">{student.name}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[student.status]}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-300">{student.phone}</td>
                                    <td className="p-4 text-slate-300">{student.email}</td>
                                    <td className="p-4 text-slate-300">{student.enrollments.length}</td>
                                    <td className="p-4">
                                        <div className="flex gap-4">
                                            <button onClick={(e) => { e.stopPropagation(); onEditStudent(student.id); }} className="text-slate-400 hover:text-orange-400 transition-colors" title="ערוך פרטי תלמיד">
                                                <PencilIcon />
                                            </button>
                                            <button onClick={(e) => e.stopPropagation()} className="text-slate-400 hover:text-red-500 transition-colors" title="מחק תלמיד">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredStudents.length === 0 && (
                     <div className="text-center py-12 text-slate-500">
                        <p>לא נמצאו תלמידים התואמים לחיפוש.</p>
                    </div>
                )}
            </div>
        </div>
    );
};