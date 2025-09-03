// @ts-nocheck
/**
 * API Service
 * 
 * This file centralizes all communication with the backend.
 * Currently, it simulates API calls using mock data and setTimeout to mimic network latency.
 * When a real backend is ready, you only need to change the functions in this file
 * to use `fetch` to call the real API endpoints. The rest of the application
 * will continue to work without any changes.
 */
import { v4 as uuidv4 } from 'uuid';
import type { Course, Lesson, StudentProfileData } from '../pages/StudentDashboard';
import type { Ticket, ConversationMessage } from '../pages/TicketsPage';
import type { AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment } from '../pages/AdminCoursesPage';
import type { AdminStudent } from '../pages/AdminStudentsPage';

// --- MOCK DATABASE ---
// This section simulates a database. In a real app, this data would live on a server.

let mockCourses: Course[] = [
    {
        id: 'c1',
        title: 'תכנות מונחה עצמים',
        syllabus: {
            description: 'בקורס זה נלמד את עקרונות היסוד של תכנות מונחה עצמים (OOP), גישה פופולרית וחזקה לפיתוח תוכנה. נחקור מושגים כמו מחלקות, אובייקטים, ירושה, פולימורפזם וכימוס.',
            topics: ['מבוא ל-OOP', 'Classes and Objects', 'Encapsulation', 'Inheritance', 'Polymorphism & Abstraction', 'פרויקט סיום'],
        },
        lessons: [
            { id: 'l1-1', title: 'שיעור 1: מבוא ועקרונות' },
            { id: 'l1-2', title: 'שיעור 2: Encapsulation' },
            { id: 'l1-3', title: 'שיעור 3: Inheritance' },
        ]
    },
    {
        id: 'c2',
        title: 'מבוא למסדי נתונים',
        syllabus: {
            description: 'קורס זה מספק מבוא מקיף לעולם מסדי הנתונים. נלמד על מודלים שונים של נתונים, כיצד לתכנן מסד נתונים יעיל, ונתרגל כתיבת שאילתות בשפת SQL, השפה הסטנדרטית לתקשורת עם בסיסי נתונים.',
            topics: ['מודלים של נתונים (Relational, NoSQL)', 'תכנון ERD', 'יסודות SQL: SELECT, FROM, WHERE', 'Advanced SQL: JOIN, GROUP BY', 'ניהול טרנזקציות', 'אבטחת מידע'],
        },
        lessons: [
            { id: 'l2-1', title: 'שיעור 1: מודלים של נתונים' },
            { id: 'l2-2', title: 'שיעור 2: SQL Basics' },
        ]
    }
];

let mockTickets: Ticket[] = [
    { id: 'TKT-001', studentId: 's1', subject: 'שאלה על המשימה השבועית בשיעור 3', teamMember: 'רועי כהן', lastUpdate: '20.09.2024', status: 'פתוחה', conversation: [
        {sender: 'you', name: 'ישראל ישראלי', text: 'היי רועי, אני לא בטוח איך לגשת לסעיף האחרון במשימה, אפשר הכוונה?', time: '19.09.2024 10:30'},
        {sender: 'other', name: 'רועי כהן', text: 'בטח, הרעיון הוא להשתמש במה שלמדנו על לולאות. תנסה לחשוב איך אפשר לבצע איטרציה על המערך שהצגתי בדוגמה.', time: '20.09.2024 09:15'},
    ]},
    { id: 'TKT-002', studentId: 's2', subject: 'בעיה בהתחברות לזום', teamMember: 'יעל שחר', lastUpdate: '18.09.2024', status: 'סגורה', conversation: [
        {sender: 'you', name: 'ישראל ישראלי', text: 'אני לא מצליח להתחבר לזום של השיעור היום.', time: '18.09.2024 17:55'},
        {sender: 'other', name: 'יעל שחר', text: 'היי, שלחתי לך לינק חדש למייל, נסה אותו.', time: '18.09.2024 17:58'},
        {sender: 'you', name: 'ישראל ישראלי', text: 'עובד, תודה רבה!', time: '18.09.2024 18:01'},
    ]},
];

let mockProfile: StudentProfileData = {
    personal: { name: 'ישראל ישראלי', email: 'israel@example.com', phone: '050-1234567', imageUrl: 'https://i.pravatar.cc/150?u=israel' },
    professional: { title: 'יזם', company: 'סטארטאפ בע"מ', bio: 'יזם בתחום הטכנולוגיה, מתמחה בפיתוח מוצרים חדשניים.' }
};

let mockUnreadStatus = { tickets: ['TKT-001'], lessons: ['l1-2'] };

// --- ADMIN MOCK DATA ---
let mockAdminCourses: AdminCourse[] = [
    { id: 'c1', name: 'תכנות מונחה עצמים', description: 'קורס יסודות בפיתוח תוכנה מודרני', color: '#3B82F6', students: 45, cyclesData: [
        { id: 'cy1-1', name: 'מחזור ספטמבר 2023', startDate: '2023-09-01', endDate: '2024-01-31', status: 'הסתיים', students: 20, mentorIds: ['1'], lessons: [{ id: 'l1', title: 'שיעור 1: מבוא', videoUrl: '', task: '', materials: [] }]},
        { id: 'cy1-2', name: 'מחזור פברואר 2024', startDate: '2024-02-01', endDate: '2024-06-30', status: 'פעיל', students: 25, mentorIds: ['1', '2'], lessons: [] },
    ]},
    { id: 'c2', name: 'מבוא למסדי נתונים', description: 'כל מה שצריך לדעת על SQL ו-NoSQL', color: '#10B981', students: 30, cyclesData: [
        { id: 'cy2-1', name: 'מחזור יולי 2024', startDate: '2024-07-01', endDate: '2024-11-30', status: 'פעיל', students: 30, mentorIds: ['3', '4'], lessons: [] },
         { id: 'cy2-2', name: 'מחזור דצמבר 2024', startDate: '2024-12-01', endDate: '2025-04-30', status: 'מתוכנן', students: 0, mentorIds: [], lessons: [] },
    ] },
];

let mockAdminStudents: AdminStudent[] = [
    { 
        id: 's1', 
        name: 'ישראל ישראלי', 
        email: 'israel@example.com', 
        phone: '050-1234567', 
        status: 'פעיל', 
        enrollments: [
            {
                courseId: 'c1', cycleId: 'cy1-2', mentorId: '1',
                onboardingDate: '2024-02-01', occupation: 'מתכנת', dealAmount: 10000, 
                paymentStatus: 'שולם במלואו', salespersonId: '4', welcomeMessageSent: true, karinMeetingScheduled: true,
                payments: [{id: 'p1', date: '2024-02-01', method: 'אשראי', amount: 10000}], status: 'active'
            }
        ], 
        joinDate: '2023-09-01', 
        imageUrl: 'https://i.pravatar.cc/150?u=israel' 
    },
    { 
        id: 's2', 
        name: 'מאיה ישראלי', 
        email: 'maya@example.com', 
        phone: '052-7654321', 
        status: 'פעיל', 
        enrollments: [
            {
                courseId: 'c2', cycleId: 'cy2-1', mentorId: '4',
                onboardingDate: '2024-07-01', occupation: 'מעצבת גרפית', dealAmount: 12000,
                paymentStatus: 'שולם חלקית', salespersonId: '5', welcomeMessageSent: true, karinMeetingScheduled: false,
                payments: [{id: 'p2', date: '2024-07-01', method: 'העברה בנקאית', amount: 6000}], status: 'active'
            }
        ], 
        joinDate: '2024-07-01', 
        imageUrl: 'https://i.pravatar.cc/150?u=maya' 
    },
];
let mockAdminTeamMembers: AdminTeamMember[] = [
    { id: '1', name: 'רועי כהן', role: 'מנטור ראשי ומייסד', department: 'Mentoring' },
    { id: '2', name: 'דניאל לוי', role: 'מלווה עסקית בכירה', department: 'Mentoring' },
    { id: '3', name: 'יעל שחר', role: 'מנהלת קהילה', department: 'Admin' },
    { id: '4', name: 'איתי גורן', role: 'מומחה מכירות', department: 'Sales' },
    { id: '5', name: 'דנה כהן', role: 'אשת מכירות', department: 'Sales' },
];
let mockAdminTickets: Ticket[] = [
     { id: 'TKT-001', studentId: 's1', subject: 'שאלה על המשימה השבועית בשיעור 3', teamMember: 'רועי כהן', lastUpdate: '20.09.2024', status: 'פתוחה', conversation: [
        {sender: 'other', name: 'ישראל ישראלי', text: 'היי רועי, אני לא בטוח איך לגשת לסעיף האחרון במשימה, אפשר הכוונה?', time: '19.09.2024 10:30'},
        {sender: 'you', name: 'רועי כהן', text: 'בטח, הרעיון הוא להשתמש במה שלמדנו על לולאות. תנסה לחשוב איך אפשר לבצע איטרציה על המערך שהצגתי בדוגמה.', time: '20.09.2024 09:15'},
    ]},
    { id: 'TKT-002', studentId: 's2', subject: 'בעיה בהתחברות לזום', teamMember: 'יעל שחר', lastUpdate: '18.09.2024', status: 'סגורה', conversation: [] },
];


// --- API FUNCTIONS ---

// A helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // --- Authentication ---
  async login(email, password, rememberMe) {
    await delay(500);
    if (email.toLowerCase() === 'admin' && password === 'admin') {
      return { success: true, role: 'admin' };
    }
    // For any other login, assume student
    if (password) { // Basic check
      return { success: true, role: 'student' };
    }
    return { success: false, message: 'שם משתמש או סיסמא שגויים.' };
  },

  async register(userData) {
    await delay(700);
    console.log('Registering user:', userData);
    // In a real backend, you'd check if email exists
    return { success: true };
  },

  async forgotPassword(email) {
    await delay(500);
    console.log(`Password reset for ${email}`);
    return { success: true, message: 'אם קיים חשבון עם כתובת המייל, ישלח אליך קישור לאיפוס סיסמה.' };
  },
  
  logout() {
    console.log('User logged out');
  },

  // --- Student Data ---
  async getCourses() {
    await delay(300);
    return mockCourses;
  },

  async getTickets() {
    await delay(300);
    return mockTickets;
  },

  async getStudentProfile() {
    await delay(300);
    return mockProfile;
  },
  
  async getUnreadStatus() {
      await delay(100);
      return mockUnreadStatus;
  },
  
  async updateProfile(newProfileData) {
      await delay(400);
      mockProfile = newProfileData;
      return mockProfile;
  },

  async addTicket(ticketData, studentName) {
      await delay(400);
      const newTicket = {
            id: `TKT-${String(mockTickets.length + 1).padStart(3, '0')}`,
            lastUpdate: new Date().toLocaleDateString('he-IL'),
            // Fix: Use 'as const' to ensure TypeScript infers the literal type 'פתוחה', not the general type 'string'.
            status: 'פתוחה' as const,
            subject: ticketData.subject,
            teamMember: ticketData.teamMember,
            conversation: [{
                // Fix: Use 'as const' for the sender to match the ConversationMessage type.
                sender: 'you' as const,
                name: studentName,
                text: ticketData.message,
                time: new Date().toLocaleDateString('he-IL')
            }]
        };
      mockTickets = [newTicket, ...mockTickets];
      return newTicket;
  },
  
  async replyToTicket(ticketId, replyText, studentName) {
      await delay(400);
      let updatedTicket;
      mockTickets = mockTickets.map(t => {
          if (t.id === ticketId) {
              const newConversation = {
                    sender: 'you' as const, name: studentName, text: replyText, time: new Date().toLocaleString('he-IL')
                };
              updatedTicket = { ...t, conversation: [...t.conversation, newConversation], lastUpdate: new Date().toLocaleDateString('he-IL'), status: 'פתוחה' as const };
              return updatedTicket;
          }
          return t;
      });
      return updatedTicket;
  },
  
   async simulateMentorReply(ticketId) {
      await delay(100); // No real network call
      let updatedTicket;
      mockTickets = mockTickets.map(t => {
          if (t.id === ticketId) {
              const mentorReply = { sender: 'other' as const, name: t.teamMember, text: 'תודה על תגובתך, אנו בודקים את הנושא.', time: new Date().toLocaleString('he-IL')};
              updatedTicket = {...t, conversation: [...t.conversation, mentorReply]};
              return updatedTicket;
          }
          return t;
      });
      return updatedTicket;
  },

  async markAsRead(type, id) {
      await delay(50);
      mockUnreadStatus[type] = mockUnreadStatus[type].filter(itemId => itemId !== id);
      console.log(`Marked ${type} - ${id} as read.`);
      return true;
  },

  // --- Cracker AI API ---
  async callCrackerApi(message, sessionId) {
    const API_KEY = "dgiSC68XSkSPq0fAa9lylhVO5wvI3Qs74tGAIO63K6SXgdeewlBN7rDeloJhLnxi4A7ICUfYsqK9ESRPdHJ38NuvCokWgOl8ZfjVs1jpBDAUMsHc92MluhJH06t2gXjn";
    const WEBHOOK_URL = "https://rockstarbizzzz.app.n8n.cloud/webhook/incoming-lovable";

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-API-Key': API_KEY },
            body: JSON.stringify({ message, sessionId, timestamp: new Date().toISOString() })
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Error calling Cracker API:", error);
        throw error;
    }
  },
  
  // --- Admin Data ---
  async getAdminCourses() {
    await delay(300);
    return mockAdminCourses;
  },
  async getAdminStudents() {
    await delay(300);
    return mockAdminStudents;
  },
  async getAdminTeamMembers() {
    await delay(300);
    return mockAdminTeamMembers;
  },
  async getAdminTickets() {
    await delay(300);
    return mockAdminTickets;
  },
  async addCourse(courseData) {
      await delay(400);
      const newCourse = {
            id: `c${mockAdminCourses.length + 1}`,
            cyclesData: [],
            students: 0,
            ...courseData,
        };
      mockAdminCourses = [newCourse, ...mockAdminCourses];
      return mockAdminCourses;
  },
  async updateCourse(courseId, updatedData) {
      await delay(400);
      mockAdminCourses = mockAdminCourses.map(c => c.id === courseId ? { ...c, ...updatedData } : c);
      return mockAdminCourses;
  },
  async addCycle(courseId, cycleData) {
      await delay(400);
      mockAdminCourses = mockAdminCourses.map(c => {
          if (c.id === courseId) {
              const newCycle = { ...cycleData, id: `cy${courseId}-${c.cyclesData.length + 1}`, students: 0, lessons: [] };
              return { ...c, cyclesData: [...c.cyclesData, newCycle] };
          }
          return c;
      });
      return mockAdminCourses;
  },
  async updateCycle(courseId, cycleId, updatedData) {
      await delay(400);
      mockAdminCourses = mockAdminCourses.map(c => {
            if (c.id === courseId) {
                return { ...c, cyclesData: c.cyclesData.map(cy => cy.id === cycleId ? { ...cy, ...updatedData } : cy) };
            }
            return c;
        });
      return mockAdminCourses;
  },
  async addLesson(courseId, cycleId, lessonName) {
      await delay(400);
      mockAdminCourses = mockAdminCourses.map(c => {
            if (c.id === courseId) {
                const updatedCycles = c.cyclesData.map(cy => {
                    if (cy.id === cycleId) {
                        const newLesson = { id: `l-${cycleId}-${cy.lessons.length + 1}`, title: lessonName, videoUrl: '', task: '', materials: [] };
                        return { ...cy, lessons: [...cy.lessons, newLesson] };
                    }
                    return cy;
                });
                return { ...c, cyclesData: updatedCycles };
            }
            return c;
        });
      return mockAdminCourses;
  },
  async updateLessonTitle(courseId, cycleId, lessonId, newTitle) {
      await delay(200);
      mockAdminCourses = mockAdminCourses.map(c => {
            if (c.id === courseId) {
                return { ...c, cyclesData: c.cyclesData.map(cy => {
                        if (cy.id === cycleId) {
                            return { ...cy, lessons: cy.lessons.map(l => l.id === lessonId ? { ...l, title: newTitle } : l) }
                        }
                        return cy;
                    })
                }
            }
            return c;
        });
      return mockAdminCourses;
  },
  async deleteLesson(courseId, cycleId, lessonId) {
       await delay(200);
       mockAdminCourses = mockAdminCourses.map(c => {
            if (c.id === courseId) {
                return { ...c, cyclesData: c.cyclesData.map(cy => {
                        if (cy.id === cycleId) {
                            return { ...cy, lessons: cy.lessons.filter(l => l.id !== lessonId) }
                        }
                        return cy;
                    })
                }
            }
            return c;
        });
       return mockAdminCourses;
  },
  async updateLesson(courseId, cycleId, lessonId, updatedLessonData) {
      await delay(400);
      mockAdminCourses = mockAdminCourses.map(c => {
            if (c.id === courseId) {
                return { ...c, cyclesData: c.cyclesData.map(cy => {
                        if (cy.id === cycleId) {
                            return { ...cy, lessons: cy.lessons.map(l => l.id === lessonId ? { ...l, ...updatedLessonData } : l) }
                        }
                        return cy;
                    })
                }
            }
            return c;
        });
      return mockAdminCourses;
  },
   async updateStudent(studentId, updatedData) {
        await delay(300);
        mockAdminStudents = mockAdminStudents.map(s => s.id === studentId ? { ...s, ...updatedData } : s);
        return mockAdminStudents;
    },
    async changeStudentCycle(studentId, courseId, newCycleId) {
        await delay(300);
        mockAdminStudents = mockAdminStudents.map(s => {
            if (s.id === studentId) {
                const newEnrollments = s.enrollments.map(en => en.courseId === courseId ? { ...en, cycleId: newCycleId } : en);
                return { ...s, enrollments: newEnrollments };
            }
            return s;
        });
        return mockAdminStudents;
    },
    async updateStudentEnrollment(studentId, courseId, newMentorId) {
        await delay(300);
        mockAdminStudents = mockAdminStudents.map(s => {
            if (s.id === studentId) {
                const newEnrollments = s.enrollments.map(en => en.courseId === courseId ? { ...en, mentorId: newMentorId } : en);
                return { ...s, enrollments: newEnrollments };
            }
            return s;
        });
        return mockAdminStudents;
    },
     async updateStudentEnrollmentDetails(studentId, courseId, cycleId, field, value) {
         await delay(100);
         mockAdminStudents = mockAdminStudents.map(s => {
            if (s.id === studentId) {
                return { ...s, enrollments: s.enrollments.map(en => {
                        if (en.courseId === courseId && en.cycleId === cycleId) {
                            return { ...en, [field]: value };
                        }
                        return en;
                    })
                };
            }
            return s;
        });
        return mockAdminStudents;
    },
    async addNewStudentToCycle(courseId, cycleId, studentData) {
        await delay(400);
        const newStudent = { ...studentData, id: `s${mockAdminStudents.length + 1}`, status: 'פעיל', joinDate: new Date().toISOString().split('T')[0],
            enrollments: [{ courseId, cycleId, mentorId: '', paymentStatus: 'לא שולם', welcomeMessageSent: false, karinMeetingScheduled: false, payments: [], dealAmount: 0, status: 'active' }]
        };
        mockAdminStudents = [newStudent, ...mockAdminStudents];
        return mockAdminStudents;
    },
     async updateStudentDetails(studentId, field, value) {
        await delay(100);
        mockAdminStudents = mockAdminStudents.map(s => s.id === studentId ? { ...s, [field]: value } : s);
        return mockAdminStudents;
    },
    async adminReplyToTicket(ticketId, replyText) {
        await delay(400);
        mockAdminTickets = mockAdminTickets.map(ticket => {
            if (ticket.id === ticketId) {
                const newReply = { sender: 'you' as const, name: 'מנהל מערכת', text: replyText, time: new Date().toLocaleString('he-IL') };
                return { ...ticket, conversation: [...ticket.conversation, newReply], lastUpdate: new Date().toLocaleDateString('he-IL'), status: 'פתוחה' as const };
            }
            return ticket;
        });
        return mockAdminTickets;
    }
};