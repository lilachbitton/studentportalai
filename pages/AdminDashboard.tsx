import React, { useState, useEffect } from 'react';
import { AdminOverviewPage } from './AdminOverviewPage';
import { AdminCoursesPage, AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment } from './AdminCoursesPage';
import { AdminEditCoursePage } from './AdminEditCoursePage';
import { AdminEditCyclePage } from './AdminEditCyclePage';
import { AdminEditLessonPage } from './AdminEditLessonPage';
import { AdminStudentsPage, AdminStudent } from './AdminStudentsPage';
import { AdminEditStudentPage } from './AdminEditStudentPage';
import { Ticket } from './TicketsPage';
import { KarinHubPage } from './KarinHubPage';
import { api } from '../services/api';

import {
    DashboardIcon,
    CoursesIcon,
    TeamIcon,
    LogoutIcon,
    TicketsIcon,
    ChatIcon,
    ClipboardCheckIcon,
} from '../components/Icons';

type AdminView = 'overview' 
    | 'courses' 
    | 'students' 
    | 'team' 
    | 'tickets' 
    | 'chat' 
    | 'karins-hub'
    | { type: 'edit-course'; courseId: string; } 
    | { type: 'edit-cycle'; courseId: string; cycleId: string; }
    | { type: 'edit-lesson'; courseId: string; cycleId: string; lessonId: string; }
    | { type: 'edit-student'; studentId: string; };


const AdminSidebar: React.FC<{ onLogout: () => void; activeView: string; setView: (view: AdminView) => void }> = ({ onLogout, activeView, setView }) => {
    const links = [
        { id: 'overview', label: 'סקירה כללית', icon: <DashboardIcon /> },
        { id: 'courses', label: 'ניהול קורסים', icon: <CoursesIcon /> },
        { id: 'students', label: 'ניהול תלמידים', icon: <TeamIcon /> },
        { id: 'karins-hub', label: 'מרכז הבקרה של קרין', icon: <ClipboardCheckIcon /> },
        { id: 'team', label: 'ניהול צוות', icon: <TeamIcon /> },
        { id: 'tickets', label: 'ניהול פניות', icon: <TicketsIcon /> },
        { id: 'chat', label: 'צ\'אט', icon: <ChatIcon /> },
    ];

    return (
        <aside className="w-72 h-screen bg-[#1C2434] text-white flex flex-col p-5 shadow-lg hidden lg:flex">
            <div className="flex justify-center items-center py-4 mb-5 text-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-wider text-white">Business Express</h1>
                    <p className="text-orange-400 text-xs">Student Portal</p>
                </div>
            </div>
            <p className="px-3 text-lg font-bold text-orange-400 text-center mb-4">ממשק ניהול</p>
            <nav className="flex-grow overflow-y-auto">
                {links.map(link => (
                    <a href="#" key={link.id} onClick={e => { e.preventDefault(); setView(link.id as AdminView); }} className={`relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${activeView === link.id ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                        {link.icon}
                        <span className="mr-4 font-semibold">{link.label}</span>
                    </a>
                ))}
            </nav>
            <div className="mt-auto">
                 <a href="#" onClick={e => { e.preventDefault(); onLogout(); }} className={`relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 text-gray-300 hover:bg-gray-700 hover:text-white`}>
                    <LogoutIcon />
                    <span className="mr-4 font-semibold">התנתקות</span>
                </a>
            </div>
        </aside>
    );
};

const AdminHeader: React.FC = () => (
    <header className="flex justify-between items-center p-5 bg-[#1C2434] text-slate-300 border-b border-slate-700">
        <div>
            {/* Can add search or other header elements later */}
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right">
                <div className="font-bold text-white">מנהל מערכת</div>
                <div className="text-sm text-slate-400">Admin</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center font-bold">A</div>
        </div>
    </header>
);

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('overview');
    const [courses, setCourses] = useState<AdminCourse[]>([]);
    const [students, setStudents] = useState<AdminStudent[]>([]);
    const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadAdminData = async () => {
            try {
                setIsLoading(true);
                const [coursesData, studentsData, teamData, ticketsData] = await Promise.all([
                    api.getAdminCourses(),
                    api.getAdminStudents(),
                    api.getAdminTeamMembers(),
                    api.getAdminTickets()
                ]);
                setCourses(coursesData);
                setStudents(studentsData);
                setTeamMembers(teamData);
                setTickets(ticketsData);
            } catch (error) {
                console.error("Failed to load admin data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadAdminData();
    }, []);

    const handleAddCourse = async (courseData: Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>) => {
        const updatedCourses = await api.addCourse(courseData);
        setCourses(updatedCourses);
    };

    const handleSelectCourseToEdit = (courseId: string) => {
        setView({ type: 'edit-course', courseId });
    };

    const handleUpdateCourse = async (courseId: string, updatedData: Partial<Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>>) => {
        const updatedCourses = await api.updateCourse(courseId, updatedData);
        setCourses(updatedCourses);
    };

    const handleAddCycle = async (courseId: string, cycleData: Omit<Cycle, 'id'| 'students' | 'lessons'>) => {
        const updatedCourses = await api.addCycle(courseId, cycleData);
        setCourses(updatedCourses);
    };

     const handleUpdateCycle = async (courseId: string, cycleId: string, updatedData: Partial<Omit<Cycle, 'id' | 'students' | 'lessons'>>) => {
        const updatedCourses = await api.updateCycle(courseId, cycleId, updatedData);
        setCourses(updatedCourses);
    };
    
    const handleBackToCourses = () => {
        setView('courses');
    };

    const handleSelectCycleToEdit = (courseId: string, cycleId: string) => {
        setView({ type: 'edit-cycle', courseId, cycleId });
    };

    const handleBackToCourseEdit = () => {
         if(typeof view === 'object' && view.type && (view.type === 'edit-cycle' || view.type === 'edit-lesson')) {
            setView({ type: 'edit-course', courseId: view.courseId });
        }
    };
    
    const handleAddLesson = async (courseId: string, cycleId: string, lessonName: string) => {
        const updatedCourses = await api.addLesson(courseId, cycleId, lessonName);
        setCourses(updatedCourses);
    };

    const handleSelectLessonToEdit = (courseId: string, cycleId: string, lessonId: string) => {
        setView({ type: 'edit-lesson', courseId, cycleId, lessonId });
    };
    
    const handleBackToCycleEdit = (courseId: string, cycleId: string) => {
        setView({ type: 'edit-cycle', courseId, cycleId });
    }

    const handleUpdateLessonTitle = async (courseId: string, cycleId: string, lessonId: string, newTitle: string) => {
        const updatedCourses = await api.updateLessonTitle(courseId, cycleId, lessonId, newTitle);
        setCourses(updatedCourses);
    }

    const handleDeleteLesson = async (courseId: string, cycleId: string, lessonId: string) => {
       const updatedCourses = await api.deleteLesson(courseId, cycleId, lessonId);
       setCourses(updatedCourses);
    }
    
    const handleUpdateLesson = async (courseId: string, cycleId: string, lessonId: string, updatedLessonData: Omit<AdminLesson, 'id' | 'title'>) => {
       const updatedCourses = await api.updateLesson(courseId, cycleId, lessonId, updatedLessonData);
       setCourses(updatedCourses);
    };

    const handleSelectStudentToEdit = (studentId: string) => {
        setView({ type: 'edit-student', studentId });
    };

    const handleBackToStudents = () => {
        setView('students');
    };

    const handleUpdateStudent = async (studentId: string, updatedData: Partial<Omit<AdminStudent, 'id'>>) => {
        const updatedStudents = await api.updateStudent(studentId, updatedData);
        setStudents(updatedStudents);
    };
    
    const handleChangeStudentCycle = async (studentId: string, courseId: string, newCycleId: string) => {
       const updatedStudents = await api.changeStudentCycle(studentId, courseId, newCycleId);
       setStudents(updatedStudents);
    };
    
    const handleUpdateStudentEnrollment = async (studentId: string, courseId: string, newMentorId: string) => {
        const updatedStudents = await api.updateStudentEnrollment(studentId, courseId, newMentorId);
        setStudents(updatedStudents);
    };

    const handleUpdateStudentEnrollmentDetails = async (
        studentId: string, 
        courseId: string, 
        cycleId: string, 
        field: keyof StudentEnrollment, 
        value: any
    ) => {
         const updatedStudents = await api.updateStudentEnrollmentDetails(studentId, courseId, cycleId, field, value);
         setStudents(updatedStudents);
    };
    
    const handleAddNewStudent = async (courseId: string, cycleId: string, studentData: Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' | 'status'>) => {
        const updatedStudents = await api.addNewStudentToCycle(courseId, cycleId, studentData);
        setStudents(updatedStudents);
    };

    const handleUpdateStudentDetails = async (studentId: string, field: keyof AdminStudent, value: any) => {
        const updatedStudents = await api.updateStudentDetails(studentId, field, value);
        setStudents(updatedStudents);
    };

    const handleAdminReplyToTicket = async (ticketId: string, replyText: string) => {
        const updatedTickets = await api.adminReplyToTicket(ticketId, replyText);
        setTickets(updatedTickets);
    };


    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><div className="dot-flashing"></div></div>;
        }

        if (typeof view === 'object' && view.type) {
            if (view.type === 'edit-student') {
                const student = students.find(s => s.id === view.studentId);
                const studentTickets = tickets.filter(t => t.studentId === view.studentId);
                if (student) {
                    return <AdminEditStudentPage 
                                student={student} 
                                allCourses={courses}
                                allTeamMembers={teamMembers}
                                tickets={studentTickets}
                                onBack={handleBackToStudents} 
                                onUpdateStudent={handleUpdateStudent}
                                onChangeCycle={handleChangeStudentCycle}
                                onUpdateEnrollment={handleUpdateStudentEnrollment}
                                onAdminReply={handleAdminReplyToTicket}
                            />;
                }
                 // If student not found, go back to the list
                setView('students');
                return null;
            }
            
            const course = courses.find(c => c.id === view.courseId);
            if (!course) { 
                setView('courses'); 
                return null; 
            }

            if (view.type === 'edit-course') {
                return <AdminEditCoursePage 
                            course={course} 
                            allTeamMembers={teamMembers}
                            onUpdateCourse={handleUpdateCourse} 
                            onBack={handleBackToCourses} 
                            onAddCycle={handleAddCycle}
                            onUpdateCycle={handleUpdateCycle}
                            onEditCycle={(cycleId) => handleSelectCycleToEdit(course.id, cycleId)}
                        />;
            } 
            
            if (view.type === 'edit-cycle') {
                 const cycle = course.cyclesData.find(cy => cy.id === view.cycleId);
                 if (cycle) {
                    return <AdminEditCyclePage 
                                course={course} 
                                cycle={cycle} 
                                allStudents={students}
                                allTeamMembers={teamMembers}
                                onUpdateCycle={handleUpdateCycle}
                                onBack={handleBackToCourseEdit} 
                                onAddLesson={(lessonName) => handleAddLesson(course.id, cycle.id, lessonName)}
                                onSelectLessonToEdit={(lessonId) => handleSelectLessonToEdit(course.id, cycle.id, lessonId)}
                                onUpdateLessonTitle={(lessonId, newTitle) => handleUpdateLessonTitle(course.id, cycle.id, lessonId, newTitle)}
                                onDeleteLesson={(lessonId) => handleDeleteLesson(course.id, cycle.id, lessonId)}
                                onUpdateStudentEnrollmentDetails={handleUpdateStudentEnrollmentDetails}
                                onAddNewStudent={(studentData) => handleAddNewStudent(course.id, cycle.id, studentData)}
                                onUpdateStudentDetails={handleUpdateStudentDetails}
                            />;
                 }
            }

            if (view.type === 'edit-lesson') {
                const cycle = course.cyclesData.find(cy => cy.id === view.cycleId);
                const lesson = cycle?.lessons.find(l => l.id === view.lessonId);
                if (cycle && lesson) {
                    return <AdminEditLessonPage 
                                lesson={lesson} 
                                onBack={() => handleBackToCycleEdit(course.id, cycle.id)}
                                onUpdateLesson={(data) => handleUpdateLesson(course.id, cycle.id, lesson.id, data)}
                            />
                }
            }
        }
        
        switch (view) {
            case 'overview':
                return <AdminOverviewPage />;
            case 'courses':
                return <AdminCoursesPage courses={courses} onAddCourse={handleAddCourse} onEditCourse={handleSelectCourseToEdit} />;
            case 'students':
                return <AdminStudentsPage students={students} onEditStudent={handleSelectStudentToEdit} />;
            case 'karins-hub':
                return <KarinHubPage 
                            allCourses={courses} 
                            allStudents={students} 
                            allTeamMembers={teamMembers} 
                            onUpdateStudentEnrollmentDetails={handleUpdateStudentEnrollmentDetails} 
                        />;
            default:
                return <AdminOverviewPage />;
        }
    };
    
    const getActiveViewName = (v: AdminView): string => {
        if (typeof v === 'string') return v;
        if (v.type === 'edit-course' || v.type === 'edit-cycle' || v.type === 'edit-lesson') return 'courses';
        if (v.type === 'edit-student') return 'students';
        return 'overview';
    }

    return (
        <div className="flex h-screen bg-[#1C2434] text-gray-800 font-sans">
            <AdminSidebar onLogout={onLogout} activeView={getActiveViewName(view)} setView={setView} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8 bg-[#243041] transition-colors duration-300">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};