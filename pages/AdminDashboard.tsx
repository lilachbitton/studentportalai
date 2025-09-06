import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

import { AdminOverviewPage } from './AdminOverviewPage';
import { AdminCoursesPage, AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment } from './AdminCoursesPage';
import { AdminEditCoursePage } from './AdminEditCoursePage';
import { AdminEditCyclePage } from './AdminEditCyclePage';
import { AdminEditLessonPage } from './AdminEditLessonPage';
import { AdminStudentsPage, AdminStudent } from './AdminStudentsPage';
import { AdminEditStudentPage } from './AdminEditStudentPage';
import { KarinHubPage } from './KarinHubPage';
// FIX: Import the new TeamPage component
import { TeamPage } from './TeamPage';
import { TicketsPage, Ticket } from './TicketsPage';
import { DashboardIcon, CoursesIcon, TeamIcon, TicketsIcon, LogoutIcon, BellIcon, SearchIcon, ClipboardCheckIcon } from '../components/Icons';

type AdminView = 
  | 'overview'
  | 'courses'
  | { type: 'edit-course', id: string }
  | { type: 'edit-cycle', courseId: string, cycleId: string }
  | { type: 'edit-lesson', courseId: string, cycleId: string, lessonId: string }
  | 'students'
  | { type: 'edit-student', id: string }
  | 'team'
  | 'tickets'
  | 'karin-hub';

const Sidebar: React.FC<{ activeView: AdminView, setView: (view: AdminView) => void, onLogout: () => void }> = ({ activeView, setView, onLogout }) => {
    const activeViewId = typeof activeView === 'string' ? activeView : activeView.type;

    const SidebarLink: React.FC<{ icon: React.ReactNode; label: string; viewId: AdminView; onClick?: () => void }> = ({ icon, label, viewId, onClick }) => (
        <a href="#" onClick={e => { e.preventDefault(); onClick ? onClick() : setView(viewId); }} className={`relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${activeViewId === viewId ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
            {icon}
            <span className="mr-4 font-semibold">{label}</span>
        </a>
    );

    return (
        <aside className="w-72 h-screen bg-[#1C2434] text-white flex flex-col p-5 shadow-lg hidden lg:flex">
            <div className="flex justify-center items-center py-4 mb-5">
                <img src="/logo.png" alt="Business Express Logo" className="h-12 w-auto" />
            </div>
            <nav className="flex-grow overflow-y-auto">
                <SidebarLink icon={<DashboardIcon />} label="סקירה כללית" viewId="overview" />
                <SidebarLink icon={<CoursesIcon />} label="ניהול קורסים" viewId="courses" />
                <SidebarLink icon={<TeamIcon />} label="ניהול תלמידים" viewId="students" />
                {/* FIX: Add sidebar link for Team Management */}
                <SidebarLink icon={<TeamIcon />} label="ניהול צוות" viewId="team" />
                <SidebarLink icon={<TicketsIcon />} label="ניהול פניות" viewId="tickets" />
                <SidebarLink icon={<ClipboardCheckIcon />} label="מרכז הבקרה של קרין" viewId="karin-hub" />
            </nav>
            <div className="mt-auto">
                <SidebarLink icon={<LogoutIcon />} label="התנתקות" viewId={'logout' as any} onClick={onLogout} />
            </div>
        </aside>
    );
};

const Header: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    return (
        <header className="flex justify-between items-center p-5 bg-[#1C2434] text-slate-300 border-b border-slate-700">
            <div className="relative">
                <input type="search" placeholder="חיפוש..." className="rounded-full py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 bg-[#243041] text-slate-300 placeholder-slate-500" />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <SearchIcon />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <button className="relative hover:text-orange-600 text-slate-300">
                    <BellIcon />
                </button>
                <div className="flex items-center space-x-2 pl-4 cursor-pointer">
                    <div className="text-right">
                        <div className="font-bold text-white">מנהל מערכת</div>
                        <div className="text-sm text-slate-400">Admin</div>
                    </div>
                    <img src="/default-avatar.png" alt="תמונת פרופיל" className="w-10 h-10 rounded-full"/>
                </div>
            </div>
        </header>
    );
};

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('overview');
    const [courses, setCourses] = useState<AdminCourse[]>([]);
    const [students, setStudents] = useState<AdminStudent[]>([]);
    const [teamMembers, setTeamMembers] = useState<AdminTeamMember[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [coursesData, studentsData, teamData, ticketsData] = await Promise.all([
                api.getAdminCourses(),
                api.getAdminStudents(),
                api.getAdminTeamMembers(),
                api.getAdminTickets(),
            ]);
            setCourses(coursesData);
            setStudents(studentsData);
            setTeamMembers(teamData);
            setTickets(ticketsData);
        } catch (e) {
            console.error("Failed to load admin data", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // --- DATA MUTATION HANDLERS ---
    const handleAddCourse = async (courseData: Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>) => {
        const updatedCourses = await api.addCourse(courseData);
        setCourses(updatedCourses);
    };

    const handleUpdateCourse = async (courseId: string, updatedData: Partial<Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>>) => {
        const updatedCourses = await api.updateCourse(courseId, updatedData);
        setCourses(updatedCourses);
    };

    const handleAddCycle = async (courseId: string, cycleData: Omit<Cycle, 'id' | 'students' | 'lessons'>) => {
        const updatedCourses = await api.addCycle(courseId, cycleData);
        setCourses(updatedCourses);
    };

    const handleUpdateCycle = async (courseId: string, cycleId: string, updatedData: Partial<Omit<Cycle, 'id' | 'students' | 'lessons'>>) => {
        const updatedCourses = await api.updateCycle(courseId, cycleId, updatedData);
        setCourses(updatedCourses);
    };

    const handleAddLesson = async (courseId: string, cycleId: string, lessonName: string) => {
        const updatedCourses = await api.addLesson(courseId, cycleId, lessonName);
        setCourses(updatedCourses);
    };
    
    const handleUpdateLessonTitle = async (courseId: string, cycleId: string, lessonId: string, newTitle: string) => {
        const updatedCourses = await api.updateLessonTitle(courseId, cycleId, lessonId, newTitle);
        setCourses(updatedCourses);
    };

    const handleDeleteLesson = async (courseId: string, cycleId: string, lessonId: string) => {
        const updatedCourses = await api.deleteLesson(courseId, cycleId, lessonId);
        setCourses(updatedCourses);
    };
    
    const handleUpdateLesson = async (courseId: string, cycleId: string, lessonId: string, updatedLessonData: Omit<AdminLesson, 'id' | 'title'>) => {
        const updatedCourses = await api.updateLesson(courseId, cycleId, lessonId, updatedLessonData);
        setCourses(updatedCourses);
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

    const handleUpdateStudentEnrollmentDetails = async (studentId: string, courseId: string, cycleId: string, field: keyof StudentEnrollment, value: any) => {
        const updatedStudents = await api.updateStudentEnrollmentDetails(studentId, courseId, cycleId, field, value);
        setStudents(updatedStudents);
    };
    
    const handleAddNewStudentToCycle = async (courseId: string, cycleId: string, studentData: Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' | 'status'>) => {
        const updatedStudents = await api.addNewStudentToCycle(courseId, cycleId, studentData);
        setStudents(updatedStudents);
    };

     const handleUpdateStudentDetails = async (studentId: string, field: keyof Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' >, value: any) => {
        const updatedStudents = await api.updateStudentDetails(studentId, field, value);
        setStudents(updatedStudents);
    };

    const handleAdminReply = async (ticketId: string, replyText: string) => {
        const updatedTickets = await api.adminReplyToTicket(ticketId, replyText);
        setTickets(updatedTickets);
    };
    
    // --- RENDER LOGIC ---

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full text-white"><div className="dot-flashing"></div></div>;
        }

        if (typeof view === 'object') {
            if (view.type === 'edit-course') {
                const course = courses.find(c => c.id === view.id);
                return course ? <AdminEditCoursePage 
                    course={course} 
                    allTeamMembers={teamMembers}
                    onBack={() => setView('courses')} 
                    onUpdateCourse={handleUpdateCourse}
                    onAddCycle={(courseId, cycleData) => handleAddCycle(courseId, cycleData)}
                    onUpdateCycle={(courseId, cycleId, updatedData) => handleUpdateCycle(courseId, cycleId, updatedData)}
                    onEditCycle={(cycleId) => setView({ type: 'edit-cycle', courseId: course.id, cycleId: cycleId })}
                /> : <div>Course not found.</div>;
            }
            if (view.type === 'edit-cycle') {
                const course = courses.find(c => c.id === view.courseId);
                const cycle = course?.cyclesData.find(cy => cy.id === view.cycleId);
                return course && cycle ? <AdminEditCyclePage
                    course={course}
                    cycle={cycle}
                    allStudents={students}
                    allTeamMembers={teamMembers}
                    onBack={() => setView({ type: 'edit-course', id: course.id })}
                    onAddLesson={(lessonName) => handleAddLesson(course.id, cycle.id, lessonName)}
                    onUpdateLessonTitle={(lessonId, newTitle) => handleUpdateLessonTitle(course.id, cycle.id, lessonId, newTitle)}
                    onDeleteLesson={(lessonId) => handleDeleteLesson(course.id, cycle.id, lessonId)}
                    onSelectLessonToEdit={(lessonId) => setView({ type: 'edit-lesson', courseId: course.id, cycleId: cycle.id, lessonId })}
                    onUpdateCycle={(courseId, cycleId, updatedData) => handleUpdateCycle(courseId, cycleId, updatedData)}
                    onUpdateStudentEnrollmentDetails={handleUpdateStudentEnrollmentDetails}
                    onAddNewStudent={(studentData) => handleAddNewStudentToCycle(course.id, cycle.id, studentData)}
                    onUpdateStudentDetails={handleUpdateStudentDetails}
                /> : <div>Cycle or course not found.</div>;
            }
            if (view.type === 'edit-lesson') {
                const course = courses.find(c => c.id === view.courseId);
                const cycle = course?.cyclesData.find(cy => cy.id === view.cycleId);
                const lesson = cycle?.lessons.find(l => l.id === view.lessonId);
                return lesson ? <AdminEditLessonPage 
                    lesson={lesson} 
                    onBack={() => setView({ type: 'edit-cycle', courseId: view.courseId, cycleId: view.cycleId })}
                    onUpdateLesson={(updatedData) => handleUpdateLesson(view.courseId, view.cycleId, view.lessonId, updatedData)}
                /> : <div>Lesson not found.</div>;
            }
            if (view.type === 'edit-student') {
                const student = students.find(s => s.id === view.id);
                return student ? <AdminEditStudentPage
                    student={student}
                    allCourses={courses}
                    allTeamMembers={teamMembers}
                    tickets={tickets.filter(t => t.studentId === student.id)}
                    onBack={() => setView('students')}
                    onUpdateStudent={handleUpdateStudent}
                    onChangeCycle={handleChangeStudentCycle}
                    onUpdateEnrollment={handleUpdateStudentEnrollment}
                    onAdminReply={handleAdminReply}
                /> : <div>Student not found.</div>;
            }
        }
        
        switch (view) {
            case 'overview': return <AdminOverviewPage students={students} courses={courses} tickets={tickets} />;
            case 'courses': return <AdminCoursesPage 
                                        courses={courses} 
                                        onAddCourse={handleAddCourse} 
                                        onEditCourse={(id) => setView({ type: 'edit-course', id })}
                                    />;
            case 'students': return <AdminStudentsPage students={students} onEditStudent={(id) => setView({ type: 'edit-student', id })} />;
            // FIX: Add case to render TeamPage
            case 'team': return <TeamPage teamMembers={teamMembers} />;
            case 'tickets': return <TicketsPage tickets={tickets} unreadTickets={[]} onReply={handleAdminReply} onNewTicket={() => {}} onMarkAsRead={() => {}} />; // Simplified for admin
            case 'karin-hub': return <KarinHubPage allCourses={courses} allStudents={students} allTeamMembers={teamMembers} onUpdateStudentEnrollmentDetails={handleUpdateStudentEnrollmentDetails} />;
            default: return <AdminOverviewPage students={students} courses={courses} tickets={tickets} />;
        }
    }

    return (
        <div className="flex h-screen bg-[#1C2434] font-sans">
            <Sidebar activeView={view} setView={setView} onLogout={onLogout} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onLogout={onLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};