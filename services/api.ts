// This is a mock API. In a real app, it would make network requests.
// This file is created to resolve module import errors.
// The functions are placeholders and do not contain real logic.

export const api = {
    getAdminCourses: async (): Promise<any[]> => { console.warn("mock api call: getAdminCourses"); return [] },
    getAdminStudents: async (): Promise<any[]> => { console.warn("mock api call: getAdminStudents"); return [] },
    getAdminTeamMembers: async (): Promise<any[]> => { console.warn("mock api call: getAdminTeamMembers"); return [] },
    getAdminTickets: async (): Promise<any[]> => { console.warn("mock api call: getAdminTickets"); return [] },
    addCourse: async (courseData: any): Promise<any[]> => { console.warn("mock api call: addCourse"); return [] },
    updateCourse: async (courseId: string, updatedData: any): Promise<any[]> => { console.warn("mock api call: updateCourse"); return [] },
    addCycle: async (courseId: string, cycleData: any): Promise<any[]> => { console.warn("mock api call: addCycle"); return [] },
    updateCycle: async (courseId: string, cycleId: string, updatedData: any): Promise<any[]> => { console.warn("mock api call: updateCycle"); return [] },
    addLesson: async (courseId: string, cycleId: string, lessonName: string): Promise<any[]> => { console.warn("mock api call: addLesson"); return [] },
    updateLessonTitle: async (courseId: string, cycleId: string, lessonId: string, newTitle: string): Promise<any[]> => { console.warn("mock api call: updateLessonTitle"); return [] },
    deleteLesson: async (courseId: string, cycleId: string, lessonId: string): Promise<any[]> => { console.warn("mock api call: deleteLesson"); return [] },
    updateLesson: async (courseId: string, cycleId: string, lessonId: string, updatedLessonData: any): Promise<any[]> => { console.warn("mock api call: updateLesson"); return [] },
    updateStudent: async (studentId: string, updatedData: any): Promise<any[]> => { console.warn("mock api call: updateStudent"); return [] },
    changeStudentCycle: async (studentId: string, courseId: string, newCycleId: string): Promise<any[]> => { console.warn("mock api call: changeStudentCycle"); return [] },
    updateStudentEnrollment: async (studentId: string, courseId: string, newMentorId: string): Promise<any[]> => { console.warn("mock api call: updateStudentEnrollment"); return [] },
    updateStudentEnrollmentDetails: async (studentId: string, courseId: string, cycleId: string, field: any, value: any): Promise<any[]> => { console.warn("mock api call: updateStudentEnrollmentDetails"); return [] },
    addNewStudentToCycle: async (courseId: string, cycleId: string, studentData: any): Promise<any[]> => { console.warn("mock api call: addNewStudentToCycle"); return [] },
    updateStudentDetails: async (studentId: string, field: any, value: any): Promise<any[]> => { console.warn("mock api call: updateStudentDetails"); return [] },
    adminReplyToTicket: async (ticketId: string, replyText: string): Promise<any[]> => { console.warn("mock api call: adminReplyToTicket"); return [] },
};
