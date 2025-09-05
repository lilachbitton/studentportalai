/**
 * API Service
 * 
 * This file centralizes all communication with the backend.
 * It now uses Firebase for authentication and will use Firestore for data.
 */
import { v4 as uuidv4 } from 'uuid';
import firebase, { auth, db, storage } from './firebase';

// Fix: Import StudentProfileData from its source file to resolve module declaration error.
import type { Course } from '../pages/StudentDashboard';
import type { StudentProfileData } from '../pages/StudentProfilePage';
import type { Ticket } from '../pages/TicketsPage';
import type { AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment } from '../pages/AdminCoursesPage';
import type { AdminStudent } from '../pages/AdminStudentsPage';

// --- API FUNCTIONS ---

// A helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const api = {
  // --- Authentication ---
  async login(email, password, rememberMe) {
    if (email.toLowerCase() === 'admin@businessexpress.co.il' && password === 'admin123456') {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            return { success: true, role: 'admin' };
        } catch (error) {
             // If admin user doesn't exist, create it
            if (error.code === 'auth/user-not-found') {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await db.collection("users").doc(userCredential.user.uid).set({
                    fullName: "Admin",
                    email: email,
                    role: 'admin',
                });
                return { success: true, role: 'admin' };
            }
             return { success: false, message: 'שגיאת התחברות למנהל' };
        }
    }
    
    try {
      const persistence = rememberMe
        ? firebase.auth.Auth.Persistence.LOCAL
        : firebase.auth.Auth.Persistence.SESSION;
      await auth.setPersistence(persistence);

      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDocRef = db.collection("users").doc(user.uid);
      const userDocSnap = await userDocRef.get();

      if (userDocSnap.exists) {
        const userData = userDocSnap.data();
        return { success: true, role: userData.role || 'student' };
      } else {
        return { success: true, role: 'student' };
      }
    } catch (error) {
      console.error("Firebase login error:", error.code);
      let message = 'אירעה שגיאה. נסה שוב מאוחר יותר.';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = 'שם משתמש או סיסמא שגויים.';
      }
      return { success: false, message };
    }
  },

  async register(userData) {
    const { email, password, fullName, phone } = userData;
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=fdba74&color=1c2434&bold=true`;

      await db.collection("users").doc(user.uid).set({
        fullName: fullName,
        email: email,
        phone: phone,
        role: 'student',
        status: 'פעיל',
        joinDate: new Date().toISOString(),
        personal: { name: fullName, email, phone, imageUrl: avatarUrl },
        professional: { title: '', company: '', bio: '' },
        enrollments: [],
      });

      return { success: true };

    } catch (error) {
      console.error("Firebase registration error:", error);
      let message = 'הרשמה נכשלה. נסה שוב מאוחר יותר.';
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'כתובת המייל הזו כבר קיימת במערכת.';
          break;
        case 'auth/weak-password':
          message = 'הסיסמה חלשה מדי. אנא בחר סיסמה חזקה יותר (לפחות 8 תווים).';
          break;
        case 'auth/invalid-email':
          message = 'כתובת המייל שהוזנה אינה תקינה.';
          break;
        default:
          message = 'אירעה שגיאה בלתי צפויה. אנא נסה שוב.';
      }
      return { success: false, message };
    }
  },

  async forgotPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true, message: 'אם קיים חשבון עם כתובת המייל, ישלח אליך קישור לאיפוס סיסמה.' };
    } catch (error) {
       console.error("Firebase password reset error:", error.code);
       return { success: true, message: 'אם קיים חשבון עם כתובת המייל, ישלח אליך קישור לאיפוס סיסמה.' };
    }
  },
  
  async logout() {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  },

  // --- Student Data ---
  async getCourses() {
    const user = auth.currentUser;
    if (!user) return [];
    // This is a simplified version. A real app would fetch courses based on user enrollment.
    // For now, let's return all courses for simplicity of student view.
    const coursesSnapshot = await db.collection('courses').get();
    const courses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    return courses;
  },

  async getTickets() { return []; },
  async getTasks() { return []; },
  async getSchedule() { return []; },
  async getKeyUpdates() { return []; },
  
  async getStudentProfile(): Promise<StudentProfileData> {
    const user = auth.currentUser;
    if (!user) {
        return {
            personal: { name: 'אורח', email: '', phone: '', imageUrl: 'https://ui-avatars.com/api/?name=G&background=fdba74&color=1c2434&bold=true' },
            professional: { title: '', company: '', bio: '' },
        };
    }
    
    const userDocRef = db.collection("users").doc(user.uid);
    const userDocSnap = await userDocRef.get();

    if (userDocSnap.exists) {
        const data = userDocSnap.data();
        const name = data.personal?.name || data.fullName || 'User';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fdba74&color=1c2434&bold=true`;
        return {
            personal: {
                name: name,
                email: data.personal?.email || data.email || user.email,
                phone: data.personal?.phone || data.phone || '',
                imageUrl: data.personal?.imageUrl || avatarUrl
            },
            professional: {
                title: data.professional?.title || '',
                company: data.professional?.company || '',
                bio: data.professional?.bio || ''
            },
            cycleName: data.cycleName
        };
    } else {
        const name = user.displayName || 'User';
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=fdba74&color=1c2434&bold=true`;
        return {
            personal: { name: 'משתמש חדש', email: user.email, phone: '', imageUrl: avatarUrl },
            professional: { title: '', company: '', bio: '' },
        };
    }
  },
  
  async getUnreadStatus() {
      return { tickets: [], lessons: [] };
  },
  
  async updateProfile(newProfileData: StudentProfileData) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const userDocRef = db.collection("users").doc(user.uid);
    try {
        await userDocRef.update({
            personal: newProfileData.personal,
            professional: newProfileData.professional,
            fullName: newProfileData.personal.name, 
            phone: newProfileData.personal.phone,
        });
        return newProfileData;
    } catch (error) {
        console.error("Error updating profile in Firestore:", error);
        throw error;
    }
  },

  async uploadProfileImage(file: File) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const storageRef = storage.ref(`profile-pictures/${user.uid}`);
    try {
      await storageRef.put(file);
      const downloadURL = await storageRef.getDownloadURL();
      const userDocRef = db.collection("users").doc(user.uid);
      await userDocRef.update({ "personal.imageUrl": downloadURL });
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile image:", error);
      throw error;
    }
  },

  async addTicket(ticketData, studentName) { return {} as Ticket; },
  async replyToTicket(ticketId, replyText, studentName) { return {} as Ticket; },
  async simulateMentorReply(ticketId) { return {} as Ticket; },
  async markAsRead(type, id) { return true; },
  async callCrackerApi(message, sessionId) { return "This is a response from the AI."; },
  
  // --- Admin Data ---
  async getAdminCourses(): Promise<AdminCourse[]> {
    const coursesSnapshot = await db.collection('courses').get();
    const coursesData = await Promise.all(coursesSnapshot.docs.map(async (courseDoc) => {
        const course = { id: courseDoc.id, ...courseDoc.data() } as AdminCourse;
        
        const cyclesSnapshot = await courseDoc.ref.collection('cycles').get();
        course.cyclesData = await Promise.all(cyclesSnapshot.docs.map(async (cycleDoc) => {
            const cycle = { id: cycleDoc.id, ...cycleDoc.data() } as Cycle;
            
            const lessonsSnapshot = await cycleDoc.ref.collection('lessons').get();
            cycle.lessons = lessonsSnapshot.docs.map(lessonDoc => ({ id: lessonDoc.id, ...lessonDoc.data() } as AdminLesson));
            return cycle;
        }));

        return course;
    }));
    return coursesData;
  },
  
  async getAdminStudents(): Promise<AdminStudent[]> {
      const snapshot = await db.collection('users').where('role', '==', 'student').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AdminStudent));
  },
  
  async getAdminTeamMembers() { return []; },
  async getAdminTickets() { return []; },

  async addCourse(courseData) {
      const docRef = await db.collection('courses').add(courseData);
      return this.getAdminCourses();
  },
  async updateCourse(courseId, updatedData) {
      await db.collection('courses').doc(courseId).update(updatedData);
      return this.getAdminCourses();
  },
  async addCycle(courseId, cycleData) {
      await db.collection('courses').doc(courseId).collection('cycles').add(cycleData);
      return this.getAdminCourses();
  },
  async updateCycle(courseId, cycleId, updatedData) {
      await db.collection('courses').doc(courseId).collection('cycles').doc(cycleId).update(updatedData);
      return this.getAdminCourses();
  },
  async addLesson(courseId, cycleId, lessonName) {
      await db.collection('courses').doc(courseId).collection('cycles').doc(cycleId).collection('lessons').add({
          title: lessonName,
          videoUrl: '',
          task: '',
          materials: [],
      });
      return this.getAdminCourses();
  },
  async updateLessonTitle(courseId, cycleId, lessonId, newTitle) {
      await db.collection('courses').doc(courseId).collection('cycles').doc(cycleId).collection('lessons').doc(lessonId).update({ title: newTitle });
      return this.getAdminCourses();
  },
  async deleteLesson(courseId, cycleId, lessonId) {
       await db.collection('courses').doc(courseId).collection('cycles').doc(cycleId).collection('lessons').doc(lessonId).delete();
       return this.getAdminCourses();
  },
  async updateLesson(courseId, cycleId, lessonId, updatedLessonData) {
      await db.collection('courses').doc(courseId).collection('cycles').doc(cycleId).collection('lessons').doc(lessonId).update(updatedLessonData);
      return this.getAdminCourses();
  },
   async updateStudent(studentId, updatedData) {
        await db.collection('users').doc(studentId).update(updatedData);
        return this.getAdminStudents();
    },
    async changeStudentCycle(studentId, courseId, newCycleId) {
        const studentRef = db.collection('users').doc(studentId);
        const studentDoc = await studentRef.get();
        const studentData = studentDoc.data() as AdminStudent;
        const updatedEnrollments = studentData.enrollments.map(en => en.courseId === courseId ? { ...en, cycleId: newCycleId } : en);
        await studentRef.update({ enrollments: updatedEnrollments });
        return this.getAdminStudents();
    },
    async updateStudentEnrollment(studentId, courseId, newMentorId) {
        const studentRef = db.collection('users').doc(studentId);
        const studentDoc = await studentRef.get();
        const studentData = studentDoc.data() as AdminStudent;
        const updatedEnrollments = studentData.enrollments.map(en => en.courseId === courseId ? { ...en, mentorId: newMentorId } : en);
        await studentRef.update({ enrollments: updatedEnrollments });
        return this.getAdminStudents();
    },
     async updateStudentEnrollmentDetails(studentId, courseId, cycleId, field, value) {
        const studentRef = db.collection('users').doc(studentId);
        const studentDoc = await studentRef.get();
        const studentData = studentDoc.data() as AdminStudent;
        const updatedEnrollments = studentData.enrollments.map(en => 
            (en.courseId === courseId && en.cycleId === cycleId) ? { ...en, [field]: value } : en
        );
        await studentRef.update({ enrollments: updatedEnrollments });
        return this.getAdminStudents();
    },
    async addNewStudentToCycle(courseId, cycleId, studentData) {
        // This function creates a new user and enrolls them.
        // For simplicity, we'll assume a default password.
        // In a real app, you'd generate a temporary password and email it.
        const defaultPassword = "password123";
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(studentData.email, defaultPassword);
            const user = userCredential.user;
            
            const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentData.name)}&background=fdba74&color=1c2434&bold=true`;

            await db.collection("users").doc(user.uid).set({
                fullName: studentData.name,
                email: studentData.email,
                phone: studentData.phone,
                role: 'student',
                status: 'פעיל',
                joinDate: new Date().toISOString(),
                personal: { name: studentData.name, email: studentData.email, phone: studentData.phone, imageUrl: avatarUrl },
                professional: { title: '', company: '', bio: '' },
                enrollments: [{ 
                    courseId, 
                    cycleId, 
                    mentorId: '', 
                    paymentStatus: 'לא שולם', 
                    status: 'active' 
                }],
            });
        } catch (error) {
            console.error("Error creating new student:", error);
            if (error.code === 'auth/email-already-in-use') {
                alert('שגיאה: כתובת המייל כבר קיימת במערכת.');
            }
        }
        return this.getAdminStudents();
    },
     async updateStudentDetails(studentId, field, value) {
        await db.collection('users').doc(studentId).update({ [field]: value });
        return this.getAdminStudents();
    },
    async adminReplyToTicket(ticketId, replyText) { return this.getAdminTickets(); }
};
