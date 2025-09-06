import { v4 as uuidv4 } from 'uuid';
import { auth, db, storage, firebase } from './firebase';
import type { Ticket, ConversationMessage } from '../pages/TicketsPage';
import type { AdminCourse, Cycle, AdminLesson, AdminTeamMember, StudentEnrollment } from '../pages/AdminCoursesPage';
import type { AdminStudent } from '../pages/AdminStudentsPage';

const mapDocToData = <T extends {}>(doc: firebase.firestore.DocumentSnapshot): T => {
    return { ...doc.data(), id: doc.id } as T;
};

export const api = {
  // --- Authentication ---
  async login(email, password, rememberMe) {
    const persistence = rememberMe ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;
    await auth.setPersistence(persistence);
    
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    if (user) {
        const role = await this.getUserRole(user.uid);
        return { success: true, role };
    }
    return { success: false, message: 'התחברות נכשלה.' };
  },

  async getUserRole(uid: string): Promise<'admin' | 'student' | null> {
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.exists) {
      return userDoc.data()?.role;
    }
    return null;
  },
  
  async logout() {
    await auth.signOut();
  },

  // --- Admin Data ---
  async getAdminCourses(): Promise<AdminCourse[]> { 
    const snapshot = await db.collection('courses').get();
    return snapshot.docs.map(doc => mapDocToData<AdminCourse>(doc));
  },
  
  async getAdminStudents(): Promise<AdminStudent[]> { 
      const snapshot = await db.collection('users').where('role', '==', 'student').get();
      return snapshot.docs.map(doc => mapDocToData<AdminStudent>(doc));
  },
  
  async getAdminTeamMembers(): Promise<AdminTeamMember[]> { 
      // Assuming team members are stored in a 'teamMembers' collection
      const snapshot = await db.collection('teamMembers').get();
      return snapshot.docs.map(doc => mapDocToData<AdminTeamMember>(doc));
  },
  
  async getAdminTickets(): Promise<Ticket[]> { 
    const snapshot = await db.collection('tickets').get();
    return snapshot.docs.map(doc => mapDocToData<Ticket>(doc));
  },

  async addCourse(courseData: Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>): Promise<AdminCourse[]> {
    await db.collection('courses').add({ ...courseData, cyclesData: [], students: 0 });
    return this.getAdminCourses();
  },
  
  async updateCourse(courseId: string, updatedData: Partial<Omit<AdminCourse, 'id' | 'cyclesData' | 'students'>>): Promise<AdminCourse[]> {
    await db.collection('courses').doc(courseId).update(updatedData);
    return this.getAdminCourses();
  },
  
  async addCycle(courseId: string, cycleData: Omit<Cycle, 'id' | 'students' | 'lessons'>): Promise<AdminCourse[]> {
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.update({
        cyclesData: firebase.firestore.FieldValue.arrayUnion({ ...cycleData, id: uuidv4(), students: 0, lessons: [] })
    });
    return this.getAdminCourses();
  },

  async updateCycle(courseId: string, cycleId: string, updatedData: Partial<Omit<Cycle, 'id' | 'students' | 'lessons'>>): Promise<AdminCourse[]> {
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    const course = courseDoc.data() as AdminCourse;
    const updatedCycles = course.cyclesData.map(c => c.id === cycleId ? { ...c, ...updatedData } : c);
    await courseRef.update({ cyclesData: updatedCycles });
    return this.getAdminCourses();
  },

  async addLesson(courseId: string, cycleId: string, lessonName: string): Promise<AdminCourse[]> {
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    const course = courseDoc.data() as AdminCourse;
    const newLesson: AdminLesson = { id: uuidv4(), title: lessonName, videoUrl: '', task: '', materials: [] };
    const updatedCycles = course.cyclesData.map(c => {
        if (c.id === cycleId) {
            return { ...c, lessons: [...(c.lessons || []), newLesson] };
        }
        return c;
    });
    await courseRef.update({ cyclesData: updatedCycles });
    return this.getAdminCourses();
  },
  
  async updateLesson(courseId: string, cycleId: string, lessonId: string, updatedLessonData: Partial<Omit<AdminLesson, 'id'>>): Promise<AdminCourse[]> {
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    const course = courseDoc.data() as AdminCourse;
    const updatedCycles = course.cyclesData.map(c => {
        if (c.id === cycleId) {
            const updatedLessons = (c.lessons || []).map(l => l.id === lessonId ? { ...l, ...updatedLessonData } : l);
            return { ...c, lessons: updatedLessons };
        }
        return c;
    });
    await courseRef.update({ cyclesData: updatedCycles });
    return this.getAdminCourses();
  },
  
  async updateLessonTitle(courseId, cycleId, lessonId, newTitle): Promise<AdminCourse[]> {
      return this.updateLesson(courseId, cycleId, lessonId, { title: newTitle });
  },
  
  async deleteLesson(courseId: string, cycleId: string, lessonId: string): Promise<AdminCourse[]> {
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    const course = courseDoc.data() as AdminCourse;
    const updatedCycles = course.cyclesData.map(c => {
        if (c.id === cycleId) {
            const updatedLessons = (c.lessons || []).filter(l => l.id !== lessonId);
            return { ...c, lessons: updatedLessons };
        }
        return c;
    });
    await courseRef.update({ cyclesData: updatedCycles });
    return this.getAdminCourses();
  },

  async updateStudent(studentId: string, updatedData: Partial<Omit<AdminStudent, 'id'>>): Promise<AdminStudent[]> {
    await db.collection('users').doc(studentId).update(updatedData);
    return this.getAdminStudents();
  },
  
  async updateStudentDetails(studentId: string, field: keyof Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' >, value: any): Promise<AdminStudent[]> {
      const updatePayload: any = {};
      updatePayload[field] = value;
      return this.updateStudent(studentId, updatePayload);
  },
  
  async adminReplyToTicket(ticketId: string, replyText: string): Promise<Ticket[]> {
     const ticketRef = db.collection('tickets').doc(ticketId);
     const newReply: ConversationMessage = {
         sender: 'you',
         name: 'מנהל',
         text: replyText,
         time: new Date().toISOString()
     };
     await ticketRef.update({
        conversation: firebase.firestore.FieldValue.arrayUnion(newReply),
        lastUpdate: new Date().toISOString(),
    });
    return this.getAdminTickets();
  },

  async changeStudentCycle(studentId: string, courseId: string, newCycleId: string): Promise<AdminStudent[]> {
      const studentRef = db.collection('users').doc(studentId);
      const studentDoc = await studentRef.get();
      const student = studentDoc.data() as AdminStudent;
      const updatedEnrollments = student.enrollments.map(e => e.courseId === courseId ? {...e, cycleId: newCycleId} : e);
      await studentRef.update({ enrollments: updatedEnrollments });
      return this.getAdminStudents();
  },

  async updateStudentEnrollment(studentId: string, courseId: string, newMentorId: string): Promise<AdminStudent[]> {
      const studentRef = db.collection('users').doc(studentId);
      const studentDoc = await studentRef.get();
      const student = studentDoc.data() as AdminStudent;
      const updatedEnrollments = student.enrollments.map(e => e.courseId === courseId ? {...e, mentorId: newMentorId} : e);
      await studentRef.update({ enrollments: updatedEnrollments });
      return this.getAdminStudents();
  },
  
  async updateStudentEnrollmentDetails(studentId: string, courseId: string, cycleId: string, field: keyof StudentEnrollment, value: any): Promise<AdminStudent[]> {
    const studentRef = db.collection('users').doc(studentId);
    const studentDoc = await studentRef.get();
    const student = studentDoc.data() as AdminStudent;
    const updatedEnrollments = student.enrollments.map(e => {
        if (e.courseId === courseId && e.cycleId === cycleId) {
            const enrollmentToUpdate = e as any;
            enrollmentToUpdate[field] = value;
            return enrollmentToUpdate;
        }
        return e;
    });
    await studentRef.update({ enrollments: updatedEnrollments });
    return this.getAdminStudents();
  },

  async addNewStudentToCycle(courseId: string, cycleId: string, studentData: Omit<AdminStudent, 'id' | 'enrollments' | 'joinDate' | 'status'>): Promise<AdminStudent[]> {
      // This is complex: requires creating a user, or finding an existing one, then adding enrollment.
      // For now, let's assume we create a new user with a random password and link them.
      console.warn("addNewStudentToCycle: This function should ideally create a user in Firebase Auth as well.");
      
      const newUserRef = db.collection('users').doc();
      const newEnrollment: StudentEnrollment = { courseId, cycleId, mentorId: '', status: 'active' };

      await newUserRef.set({
          ...studentData,
          role: 'student',
          joinDate: new Date().toISOString(),
          status: 'פעיל',
          enrollments: [newEnrollment],
      });
      
      return this.getAdminStudents();
  },
};
