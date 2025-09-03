import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LessonPage } from './LessonPage';
import { CalendarPage } from './CalendarPage';
import { TeamPage } from './TeamPage';
import { SyllabusPage } from './SyllabusPage';
import { TicketsPage, Ticket, ConversationMessage } from './TicketsPage';
import { ChatPage } from './ChatPage';
import { StudentProfilePage, StudentProfileData } from './StudentProfilePage';
import { api } from '../services/api';
import {
    DashboardIcon,
    CoursesIcon,
    CalendarIcon,
    TeamIcon,
    TicketsIcon,
    ChatIcon,
    BookOpenIcon,
    LogoutIcon,
    SearchIcon,
    BellIcon,
    PlusIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    VideoCameraIcon,
    PencilIcon
} from '../components/Icons';


// --- DATA STRUCTURES ---
export interface Message {
    sender: 'you' | 'cracker';
    text: string;
    time: string;
}

export interface AiChatSession {
    sessionId: string;
    lessonId: string;
    messages: Message[];
    isThinking: boolean;
}

export interface Lesson {
    id: string;
    title: string;
    courseId: string;
}
export interface Course {
    id: string;
    title: string;
    syllabus: {
        description: string;
        topics: string[];
    };
    lessons: Omit<Lesson, 'courseId'>[];
}

const getLessonsWithCourseId = (courses: Course[]): Lesson[] => {
    const allLessons: Lesson[] = [];
    courses.forEach(course => {
        course.lessons.forEach(lesson => {
            allLessons.push({ ...lesson, courseId: course.id });
        });
    });
    return allLessons;
}

type ActiveView = 'dashboard' | 'calendar' | 'team' | 'tickets' | 'chat' | 'profile' | { type: 'lesson'; id: string } | { type: 'syllabus', courseId: string };

interface UnreadStatus {
    tickets: string[];
    lessons: string[]; 
}

const getActiveViewId = (view: ActiveView): string => {
    if (typeof view === 'string') return view;
    if (view.type === 'lesson') return view.id;
    return `syllabus-${view.courseId}`;
};

// --- SIDEBAR ---
const Sidebar: React.FC<{
    onLogout: () => void;
    courses: Course[];
    unreadStatus: UnreadStatus;
    onSelectLesson: (lessonId: string) => void;
    onSelectSyllabus: (courseId: string) => void;
    onGoToDashboard: () => void;
    onGoToCalendar: () => void;
    onGoToTeam: () => void;
    onGoToTickets: () => void;
    onGoToChat: () => void;
    activeView: ActiveView;
}> = (props) => {
    const { onLogout, courses, unreadStatus, onSelectLesson, onSelectSyllabus, onGoToDashboard, onGoToCalendar, onGoToTeam, onGoToTickets, onGoToChat, activeView } = props;
    const [openCourseId, setOpenCourseId] = useState<string | null>(courses[0]?.id || null);

    const toggleCourse = (courseId: string) => {
        setOpenCourseId(openCourseId === courseId ? null : courseId);
    };
    
    const activeId = getActiveViewId(activeView);
    
    const SidebarLink: React.FC<{ icon: React.ReactNode; label: string; isActive?: boolean; hasNotification?: boolean; onClick?: () => void; }> = ({ icon, label, isActive, hasNotification, onClick }) => (
        <a href="#" onClick={e => { e.preventDefault(); onClick?.(); }} className={`relative flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${isActive ? 'bg-orange-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
            {icon}
            <span className="mr-4 font-semibold">{label}</span>
            {hasNotification && <span className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-orange-400 rounded-full ring-2 ring-orange-600"></span>}
        </a>
    );


    return (
        <aside className="w-72 h-screen bg-[#1C2434] text-white flex flex-col p-5 shadow-lg hidden lg:flex">
            <div className="flex justify-center items-center py-4 mb-5">
                <img src="/logo.png" alt="לוגו ביזנס אקספרס" className="w-40" />
            </div>
            <nav className="flex-grow overflow-y-auto">
                <SidebarLink icon={<DashboardIcon />} label="לוח בקרה" isActive={activeId === 'dashboard'} onClick={onGoToDashboard} />
                <SidebarLink icon={<CalendarIcon />} label="יומן" isActive={activeId === 'calendar'} onClick={onGoToCalendar} />
                <SidebarLink icon={<TeamIcon />} label="צוות ביזנס אקספרס" isActive={activeId === 'team'} onClick={onGoToTeam} />
                <SidebarLink icon={<TicketsIcon />} label="ניהול פניות" isActive={activeId === 'tickets'} onClick={onGoToTickets} hasNotification={unreadStatus.tickets.length > 0} />
                <SidebarLink icon={<ChatIcon />} label="אזור צ'אט" isActive={activeId === 'chat'} onClick={onGoToChat} hasNotification={unreadStatus.lessons.length > 0} />

                <div className="mt-4">
                    <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">הקורסים שלי</h3>
                    {courses.map(course => {
                         const hasUnreadInCourse = course.lessons.some(l => unreadStatus.lessons.includes(l.id));
                        return (
                        <div key={course.id}>
                            <button onClick={() => toggleCourse(course.id)} className="w-full flex justify-between items-center p-3 my-1 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white relative">
                                <div className="flex items-center">
                                    <CoursesIcon />
                                    <span className="mr-4 font-semibold">{course.title}</span>
                                </div>
                                {hasUnreadInCourse && <span className="absolute left-8 w-2 h-2 bg-orange-400 rounded-full"></span>}
                                {openCourseId === course.id ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </button>
                            {openCourseId === course.id && (
                                <div className="pl-6 border-r-2 border-gray-600 mr-5">
                                    <a href="#" onClick={(e) => { e.preventDefault(); onSelectSyllabus(course.id); }} className={`block p-2 my-1 rounded-md text-sm transition-colors ${activeId === `syllabus-${course.id}` ? 'bg-orange-600/50 text-white' : 'text-gray-400 hover:bg-gray-600 hover:text-white'}`}>
                                        <div className="flex items-center">
                                           <BookOpenIcon />
                                            <span className="mr-1">סילבוס</span>
                                        </div>
                                    </a>
                                    {course.lessons.map(lesson => {
                                        const hasNotification = unreadStatus.lessons.includes(lesson.id);
                                        return (
                                        <a key={lesson.id} href="#" onClick={(e) => { e.preventDefault(); onSelectLesson(lesson.id); }} className={`block p-2 my-1 rounded-md text-sm transition-colors relative ${activeId === lesson.id ? 'bg-orange-600/50 text-white' : 'text-gray-400 hover:bg-gray-600 hover:text-white'}`}>
                                            <div className="flex items-center">
                                                <VideoCameraIcon />
                                                <span className="mr-1">{lesson.title}</span>
                                                {hasNotification && <span className="absolute left-2 w-2 h-2 bg-orange-400 rounded-full"></span>}
                                            </div>
                                        </a>
                                    )})}
                                </div>
                            )}
                        </div>
                    )})}
                </div>
            </nav>
            <div className="mt-auto">
                <SidebarLink icon={<LogoutIcon />} label="התנתקות" onClick={onLogout} />
            </div>
        </aside>
    );
};


// --- HEADER ---
const Header: React.FC<{ 
    isDark?: boolean; 
    profile?: StudentProfileData; 
    onGoToProfile: () => void;
    onLogout: () => void;
}> = ({ isDark, profile, onGoToProfile, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const headerClasses = isDark 
        ? 'bg-[#1C2434] text-slate-300 border-b border-slate-700' 
        : 'bg-white text-gray-800 shadow-md';
    const inputClasses = isDark 
        ? 'bg-[#243041] text-slate-300 placeholder-slate-500' 
        : 'bg-slate-100 text-gray-900 placeholder-gray-500';
    const bellIconClasses = isDark ? 'text-slate-300' : 'text-gray-600';
    const userNameClasses = isDark ? 'text-white' : 'text-gray-800';
    const userRoleClasses = isDark ? 'text-slate-400' : 'text-gray-500';

    if (!profile) return null; // Don't render header if profile is not loaded

    return (
        <header className={`flex justify-between items-center p-5 transition-colors duration-300 ${headerClasses}`}>
            {/* Search */}
            <div className="relative">
                <input type="search" placeholder="חיפוש..." className={`rounded-full py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 ${inputClasses}`} />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <SearchIcon />
                </div>
            </div>
            {/* User Area */}
            <div className="flex items-center space-x-4">
                <button className={`relative hover:text-orange-600 ${bellIconClasses}`}>
                    <BellIcon />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-600 ring-2 ring-white"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setIsDropdownOpen(prev => !prev)} className="flex items-center space-x-2 pl-4 cursor-pointer">
                        <div className="text-right">
                            <div className={`font-bold ${userNameClasses}`}>{profile.personal.name}</div>
                            <div className={`text-sm ${userRoleClasses}`}>מחזור 5</div>
                        </div>
                        <img src={profile.personal.imageUrl} alt="תמונת פרופיל" className="w-10 h-10 rounded-full"/>
                        <ChevronDownIcon />
                    </button>

                    {isDropdownOpen && (
                        <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 z-20 ${isDark ? 'bg-[#243041] ring-1 ring-slate-700' : 'bg-white ring-1 ring-black ring-opacity-5'}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); onGoToProfile(); setIsDropdownOpen(false); }} className={`flex items-center gap-2 px-4 py-2 text-sm ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <PencilIcon className="w-4 h-4" />
                                <span>הפרופיל שלי</span>
                            </a>
                            <a href="#" onClick={(e) => { e.preventDefault(); onLogout(); }} className={`flex items-center gap-2 px-4 py-2 text-sm ${isDark ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                                <LogoutIcon className="w-4 h-4"/>
                                <span>התנתקות</span>
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


const WelcomeIllustration: React.FC = () => (
     <svg width="256" height="194" viewBox="0 0 256 194" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-64 h-auto">
        <g opacity="0.8">
            <path d="M128 194C198.693 194 256 150.567 256 97C256 43.433 198.693 0 128 0C57.3071 0 0 43.433 0 97C0 150.567 57.3071 194 128 194Z" fill="url(#paint0_linear_1_2)"/>
            <g filter="url(#filter0_d_1_2)">
                <path d="M197.5 130.5C219.5 98.5 187.167 69.1667 172 63C156.833 56.8333 128.5 83.1 113 97C97.5 110.9 83.5 130.5 54 130.5" stroke="#FDBA74" strokeWidth="4" strokeLinecap="round" shapeRendering="crispEdges"/>
            </g>
        </g>
        <defs>
            <filter id="filter0_d_1_2" x="49.9951" y="58.9951" width="151.509" height="79.5098" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0.933333 0 0 0 0 0.403922 0 0 0 0 0.0823529 0 0 0 0.3 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_2"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_2" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_1_2" x1="128" y1="0" x2="128" y2="194" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDBA74"/>
                <stop offset="1" stopColor="#F97316"/>
            </linearGradient>
        </defs>
    </svg>
);


const WelcomeBanner: React.FC<{name?: string}> = ({name}) => {
    const today = new Date();
    const dateString = today.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    return (
        <div className="bg-gradient-to-l from-orange-400 to-orange-500 text-white p-8 rounded-2xl mb-8 flex items-center justify-between shadow-lg overflow-hidden">
            <div>
                <p className="text-lg">{dateString}</p>
                <h1 className="text-4xl font-bold mt-2">ברוך שובך, {name || 'סטודנט'}!</h1>
                <p className="mt-3 text-orange-100">הישאר תמיד מעודכן בפורטל הסטודנטים שלך.</p>
            </div>
            <div className="hidden sm:block relative -right-5">
                <div className="absolute -bottom-16 -right-5 w-64 h-48 opacity-20">
                    <WelcomeIllustration />
                </div>
                 <div className="relative w-40 h-40 bg-white/20 rounded-full flex items-center justify-center">
                     <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 14L21.3623 9.31885M12 14L2.63768 9.31885M12 14V21M3 9L12 4L21 9L12 14L3 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 10V14.5C4 14.5 5.5 15.5 8 15.5C10.5 15.5 12 14.5 12 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 10V14.5C20 14.5 18.5 15.5 16 15.5C13.5 15.5 12 14.5 12 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                 </div>
            </div>
        </div>
    );
};

const SectionHeader: React.FC<{ title: string; children?: React.ReactNode }> = ({ title, children }) => (
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        {children === undefined ? <a href="#" className="text-sm text-orange-600 hover:underline font-semibold">הצג הכל</a> : children}
    </div>
);


// --- DASHBOARD HOME WIDGETS ---
const KeyUpdates: React.FC = () => (
    <div className="mb-8">
        <SectionHeader title="עדכונים חשובים" children={null}/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-orange-100 border-r-4 border-orange-500 p-5 rounded-lg">
                <h4 className="font-bold text-lg text-orange-800">מפגש בונוס בנושא שיווק</h4>
                <p className="text-gray-700 mt-1">ביום רביעי הקרוב, 10.09, תתקיים סדנת בונוס בזום בנושא שיווק דיגיטלי מתקדם. לינק ישלח בקרוב.</p>
            </div>
            <div className="bg-blue-100 border-r-4 border-blue-500 p-5 rounded-lg">
                <h4 className="font-bold text-lg text-blue-800">שינוי במערכת השעות</h4>
                <p className="text-gray-700 mt-1">לתשומת לבכם, השיעור הקרוב של יום שני נדחה באופן חד פעמי לשעה 19:00.</p>
            </div>
        </div>
    </div>
);

const TasksWidget: React.FC = () => {
    const [filter, setFilter] = useState('הכל');
    const tasks = [
        { title: 'סיכום שיעור 1: בניית אוואטר', course: 'שיווק דיגיטלי', status: 'הושלם' },
        { title: 'הכנת פוסט לפייסבוק', course: 'ניהול מדיה חברתית', status: 'יש משוב' },
        { title: 'מחקר מילות מפתח', course: 'שיווק דיגיטלי', status: 'ממתין למשוב'},
        { title: 'בניית דף נחיתה ראשוני', course: 'בניית אתרים', status: 'חדש' },
    ];
    const filters = ['הכל', 'חדש', 'ממתין למשוב', 'יש משוב', 'הושלם'];
    const filteredTasks = tasks.filter(t => filter === 'הכל' || t.status === filter);
    
    const statusStyles: { [key: string]: string } = {
        'חדש': 'bg-blue-200 text-blue-800',
        'ממתין למשוב': 'bg-yellow-200 text-yellow-800',
        'יש משוב': 'bg-purple-200 text-purple-800',
        'הושלם': 'bg-green-200 text-green-800'
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
            <SectionHeader title="המשימות שלי" children={null} />
            <div className="flex space-x-1 border-b mb-4" dir="ltr">
                {filters.map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-semibold transition-colors ${filter === f ? 'border-b-2 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-orange-500'}`}>
                        {f}
                    </button>
                ))}
            </div>
            <div className="space-y-4 pr-2 max-h-96 overflow-y-auto">
                {filteredTasks.map((task, i) => (
                    <div key={i} className="p-3 rounded-lg hover:bg-slate-50">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-gray-800">{task.title}</h4>
                                <p className="text-sm text-gray-500">{task.course}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles[task.status]}`}>
                                {task.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ScheduleWidget: React.FC = () => {
    const schedule = [{ date: '2024-09-04', time: '10:00', title: 'שיעור שבועי', teacher: 'עם רועי', type: 'group' }, { date: '2024-09-04', time: '14:00', title: 'פגישה אישית', teacher: 'עם המלווה דניאל', type: 'personal' }, { date: '2024-09-05', time: '18:00', title: 'שיעור בונוס', teacher: 'שיווק מתקדם', type: 'bonus' }];
    const typeStyles: { [key: string]: string } = { group: 'border-orange-500', personal: 'border-blue-500', bonus: 'border-green-500' };
    const today = new Date();
    const scheduleDateString = today.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' });
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
            <SectionHeader title="הלו״ז שלי">
                <button className="text-sm font-semibold text-gray-700 bg-slate-100 hover:bg-slate-200 rounded-lg px-4 py-2 flex items-center">{scheduleDateString}</button>
            </SectionHeader>
            <div className="space-y-4">{schedule.map((item, i) => (<div key={i} className={`flex items-center p-3 rounded-lg border-r-4 ${typeStyles[item.type]}`}><div className="flex-1 text-right mr-4"><h4 className="font-semibold text-gray-900">{item.title}</h4><p className="text-sm text-gray-500">{item.teacher} &middot; {new Date(item.date).toLocaleDateString('he-IL', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p></div><div className="font-bold text-lg text-gray-700">{item.time}</div></div>))}</div>
        </div>
    );
};

const CourseCard: React.FC<{ title: string; icon: React.ReactNode; onClick?: () => void }> = ({ title, icon, onClick }) => (
    <div className="bg-white p-5 rounded-2xl shadow-lg flex items-center justify-between">
        <div>
            <h3 className="font-bold text-lg">{title}</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); onClick?.()}} className="mt-3 inline-block bg-orange-100 text-orange-700 hover:bg-orange-200 font-semibold py-2 px-5 rounded-lg transition-colors">צפייה</a>
        </div>
        <div className="text-5xl text-orange-300 opacity-80">{icon}</div>
    </div>
);

const DashboardHome: React.FC<{ courses: Course[]; onSelectLesson: (lessonId: string) => void; studentName?: string }> = ({ courses, onSelectLesson, studentName }) => (
    <>
        <WelcomeBanner name={studentName} />
        <KeyUpdates />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <TasksWidget />
                <div>
                    <SectionHeader title="הקורסים שלי" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((course, index) => (
                             <CourseCard 
                                key={course.id}
                                title={course.title} 
                                icon={<span>{index === 0 ? '💻' : '📊'}</span>} 
                                onClick={() => course.lessons[0] && onSelectLesson(course.lessons[0].id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="lg:col-span-1">
                <ScheduleWidget />
            </div>
        </div>
    </>
);


// --- MAIN DASHBOARD ROUTER ---
export const StudentDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [view, setView] = useState<ActiveView>('dashboard');
    const [courses, setCourses] = useState<Course[]>([]);
    const [allLessons, setAllLessons] = useState<Lesson[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [profile, setProfile] = useState<StudentProfileData | undefined>();
    const [unreadStatus, setUnreadStatus] = useState<UnreadStatus>({ tickets: [], lessons: [] });
    const [aiChatSessions, setAiChatSessions] = useState<{ [lessonId: string]: AiChatSession }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const [coursesData, ticketsData, profileData, unreadData] = await Promise.all([
                    api.getCourses(),
                    api.getTickets(),
                    api.getStudentProfile(),
                    api.getUnreadStatus(),
                ]);
                setCourses(coursesData);
                setAllLessons(getLessonsWithCourseId(coursesData));
                setTickets(ticketsData);
                setProfile(profileData);
                setUnreadStatus(unreadData);
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleUpdateProfile = async (newProfileData: StudentProfileData) => {
        const updatedProfile = await api.updateProfile(newProfileData);
        setProfile(updatedProfile);
        console.log("Profile updated:", newProfileData);
    };

    const markAsRead = (type: keyof UnreadStatus, id: string) => {
        setUnreadStatus(prev => ({ ...prev, [type]: prev[type].filter(itemId => itemId !== id) }));
        api.markAsRead(type, id); // Inform the backend
    };
    
    const addUnread = (type: keyof UnreadStatus, id: string) => {
        setUnreadStatus(prev => ({ ...prev, [type]: [...new Set([...prev[type], id])] }));
    }

    const handleSelectLesson = (lessonId: string) => {
        setView({ type: 'lesson', id: lessonId });
        markAsRead('lessons', lessonId);
    };

    const handleSelectSyllabus = (courseId: string) => {
        setView({ type: 'syllabus', courseId });
    }
    
    // --- AI CHAT LOGIC ---
    const handleAiTaskSubmit = async (taskContent: string, lesson: Lesson) => {
        const newSessionId = uuidv4();
        const lessonNumber = lesson.title.split(' ')[1] || 'X';
        const initialMessage = `היי המפצחת מצ"ב הגשת המשימה לשיעור ${lessonNumber}\n\n${taskContent}`;
        
        const userMessage: Message = {
            sender: 'you',
            text: `(המשימה שלי: ${taskContent})`,
            time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit'})
        };
        
        const newSession: AiChatSession = {
            sessionId: newSessionId,
            lessonId: lesson.id,
            messages: [userMessage],
            isThinking: true,
        };

        setAiChatSessions(prev => ({ ...prev, [lesson.id]: newSession }));
        
        try {
            const crackerResponseText = await api.callCrackerApi(initialMessage, newSessionId);
            const crackerResponse: Message = {
                sender: 'cracker',
                text: crackerResponseText || "נתקלתי בבעיה. נסה שוב מאוחר יותר.",
                time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit'})
            };
            setAiChatSessions(prev => ({
                ...prev,
                [lesson.id]: { ...prev[lesson.id], messages: [...prev[lesson.id].messages, crackerResponse], isThinking: false }
            }));
            addUnread('lessons', lesson.id);
        } catch (error) {
             const errorResponse: Message = {
                sender: 'cracker',
                text: "אני מתנצלת, נתקלתי בשגיאה. אנא נסה שוב בעוד מספר רגעים.",
                time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit'})
            };
            setAiChatSessions(prev => ({
                 ...prev,
                 [lesson.id]: { ...prev[lesson.id], messages: [...prev[lesson.id].messages, errorResponse], isThinking: false }
            }));
        }
    };

    const handleAiSendMessage = async (lessonId: string, messageText: string) => {
        const session = aiChatSessions[lessonId];
        if (!session) return;

        const userMessage: Message = {
            sender: 'you',
            text: messageText,
            time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit'})
        };

        setAiChatSessions(prev => ({
            ...prev,
            [lessonId]: { ...prev[lessonId], messages: [...prev[lessonId].messages, userMessage], isThinking: true }
        }));

        try {
            const crackerResponseText = await api.callCrackerApi(messageText, session.sessionId);
             const crackerResponse: Message = {
                sender: 'cracker',
                text: crackerResponseText || "נתקלתי בבעיה. נסה שוב מאוחר יותר.",
                time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit'})
            };
            setAiChatSessions(prev => ({
                ...prev,
                [lessonId]: { ...prev[lessonId], messages: [...prev[lessonId].messages, crackerResponse], isThinking: false }
            }));
            addUnread('lessons', lessonId);
        } catch (error) {
            const errorResponse: Message = {
                sender: 'cracker',
                text: "אני מתנצלת, נתקלתי בשגיאה. אנא נסה שוב בעוד מספר רגעים.",
                time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit'})
            };
            setAiChatSessions(prev => ({
                 ...prev,
                 [lessonId]: { ...prev[lessonId], messages: [...prev[lessonId].messages, errorResponse], isThinking: false }
            }));
        }
    };
    // --- END AI CHAT LOGIC ---

    const handleNewTicket = async (ticketData: { subject: string; teamMember: string; message: string; }) => {
        if (!profile) return;
        const optimisticNewTicket = await api.addTicket(ticketData, profile.personal.name);
        setTickets(prev => [optimisticNewTicket, ...prev]);
        addUnread('tickets', optimisticNewTicket.id);
    };

    const handleReplyToTicket = async (ticketId: string, replyText: string) => {
         if (!profile) return;
        const updatedTicket = await api.replyToTicket(ticketId, replyText, profile.personal.name);
        setTickets(prevTickets => prevTickets.map(t => t.id === ticketId ? updatedTicket : t));
        
        // Simulate a mentor reply to make it unread
        setTimeout(async () => {
            const ticketWithMentorReply = await api.simulateMentorReply(ticketId);
            setTickets(currentTickets => currentTickets.map(ct => ct.id === ticketId ? ticketWithMentorReply : ct));
            addUnread('tickets', ticketId);
        }, 2000);
    };

    const handleGoToDashboard = () => setView('dashboard');
    const handleGoToCalendar = () => setView('calendar');
    const handleGoToTeam = () => setView('team');
    const handleGoToTickets = () => setView('tickets');
    const handleGoToChat = () => setView('chat');
    const handleGoToProfile = () => setView('profile');
    
    const renderContent = () => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-full"><div className="dot-flashing"></div></div>;
        }

        if (typeof view === 'object') {
            if (view.type === 'lesson') {
                const selectedLesson = allLessons.find(l => l.id === view.id);
                if (selectedLesson) {
                    return <LessonPage 
                                key={selectedLesson.id} 
                                lesson={selectedLesson} 
                                onNewFeedback={(lessonId) => addUnread('lessons', lessonId)} 
                                aiChatSession={aiChatSessions[selectedLesson.id]}
                                onTaskSubmit={handleAiTaskSubmit}
                                onSendMessage={handleAiSendMessage}
                            />;
                }
            }
            if (view.type === 'syllabus') {
                const selectedCourse = courses.find(c => c.id === view.courseId);
                if (selectedCourse) {
                    return <SyllabusPage course={selectedCourse} />;
                }
            }
        }
        
        switch (view) {
            case 'dashboard': return <DashboardHome courses={courses} onSelectLesson={handleSelectLesson} studentName={profile?.personal.name} />;
            case 'calendar': return <CalendarPage />;
            case 'team': return <TeamPage onNewTicket={handleNewTicket} onGoToTickets={handleGoToTickets} />;
            case 'tickets': return <TicketsPage tickets={tickets} onReply={handleReplyToTicket} onNewTicket={handleNewTicket} unreadTickets={unreadStatus.tickets} onMarkAsRead={(id) => markAsRead('tickets', id)} />;
            case 'chat': return <ChatPage 
                                    aiChatSessions={aiChatSessions}
                                    onSendMessage={handleAiSendMessage}
                                    courses={courses}
                                    allLessons={allLessons}
                                    unreadChats={unreadStatus.lessons} 
                                    onMarkAsRead={(id) => markAsRead('lessons', id)} 
                                />;
            case 'profile': return profile ? <StudentProfilePage profile={profile} onUpdateProfile={handleUpdateProfile} /> : null;
            default: return <DashboardHome courses={courses} onSelectLesson={handleSelectLesson} studentName={profile?.personal.name} />;
        }
    }
    
    const isDarkPage = view !== 'dashboard' && !(typeof view === 'object' && view.type === 'lesson');

    const mainBgClass = isDarkPage ? 'bg-[#1C2434]' : 'bg-slate-100';

    return (
        <div className="flex h-screen bg-slate-100 text-gray-800 font-sans">
            <Sidebar 
                onLogout={onLogout} 
                courses={courses}
                unreadStatus={unreadStatus}
                onSelectLesson={handleSelectLesson}
                onSelectSyllabus={handleSelectSyllabus}
                onGoToDashboard={handleGoToDashboard}
                onGoToCalendar={handleGoToCalendar}
                onGoToTeam={handleGoToTeam}
                onGoToTickets={handleGoToTickets}
                onGoToChat={handleGoToChat}
                activeView={view}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    isDark={isDarkPage} 
                    profile={profile}
                    onGoToProfile={handleGoToProfile}
                    onLogout={onLogout}
                />
                <main className={`flex-1 overflow-x-hidden overflow-y-auto p-8 ${mainBgClass} transition-colors duration-300`}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};