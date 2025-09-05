import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SendIcon, ChatIcon } from '../components/Icons';
import type { AiChatSession, Message, Course, Lesson } from './StudentDashboard';


const AiConversationView: React.FC<{ 
    session: AiChatSession;
    courseName: string;
    lessonName: string;
    onSend: (text: string) => void; 
}> = ({ session, courseName, lessonName, onSend }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [session.messages]);

    const handleSend = () => { if(newMessage.trim()){ onSend(newMessage); setNewMessage(''); } };
    
    const cracker = { name: 'המפצחת', role: 'סוכנת AI', imageUrl: 'https://api.dicebear.com/8.x/bottts/svg?seed=TheCracker' };

    return (
        <div className="bg-[#1C2434] rounded-2xl flex flex-col h-full">
            <div className="flex items-center p-4 border-b border-slate-700 flex-shrink-0">
                <img src={cracker.imageUrl} alt={cracker.name} className="w-12 h-12 rounded-full" />
                <div className="mr-4">
                    <h3 className="font-bold text-lg text-white">{cracker.name}</h3>
                    <p className="text-sm text-slate-400">{`שיחה על ${courseName} - ${lessonName}`}</p>
                </div>
            </div>
            <div className="flex-grow p-6 space-y-4 overflow-y-auto">
                {session.messages.map((msg, i) => (
                    <div key={i} className={`flex items-end gap-3 ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'cracker' && <img src={cracker.imageUrl} alt={cracker.name} className="w-8 h-8 rounded-full"/>}
                        <div className={`max-w-lg p-3 rounded-2xl ${msg.sender === 'you' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-[#243041] text-slate-200 rounded-bl-none'}`}>
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            </div>
                            <span className={`text-xs mt-1.5 block ${msg.sender === 'you' ? 'text-orange-200' : 'text-slate-500'} text-left`}>{msg.time}</span>
                        </div>
                    </div>
                ))}
                 {session.isThinking && (
                    <div className="flex items-end gap-2">
                        <img src={cracker.imageUrl} alt={cracker.name} className="w-8 h-8 rounded-full"/>
                        <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-[#243041] text-gray-800">
                            <div className="flex items-center">
                                <span className="text-slate-400">המפצחת מנסחת תשובה</span>
                                <div className="dot-flashing ml-2"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-700 flex-shrink-0">
                <div className="flex gap-3">
                    <input type="text" placeholder="כתוב הודעה..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} className="flex-1 p-3 bg-[#243041] text-slate-200 border border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none placeholder-slate-500" />
                    <button onClick={handleSend} className="bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-lg transition-colors"><SendIcon /></button>
                </div>
            </div>
        </div>
    );
};

const AiChatList: React.FC<{ 
    sessions: AiChatSession[]; 
    activeLessonId: string | null; 
    onSelectChat: (lessonId: string) => void; 
    allLessons: Lesson[];
    courses: Course[];
}> = ({ sessions, activeLessonId, onSelectChat, allLessons, courses }) => {
    
    const crackerAvatarUrl = "https://api.dicebear.com/8.x/bottts/svg?seed=TheCracker";
    
    const getChatDetails = (lessonId: string) => {
        const lesson = allLessons.find(l => l.id === lessonId);
        const course = courses.find(c => c.id === lesson?.courseId);
        return {
            title: `שיחה עם המפצחת`,
            subtitle: `${course?.title || ''} ${lesson?.title || ''}`
        };
    };

    return (
        <div className="bg-[#1C2434] rounded-2xl flex flex-col h-full p-4">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">השיחות שלי עם המפצחת</h2>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
                {sessions.map(session => {
                    const details = getChatDetails(session.lessonId);
                    const lastMessage = session.messages[session.messages.length - 1];
                    return (
                        <div key={session.sessionId} onClick={() => onSelectChat(session.lessonId)} className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 transition-colors ${activeLessonId === session.lessonId ? 'bg-orange-600/20' : 'hover:bg-[#243041]'}`}>
                            <div className="relative">
                                <img src={crackerAvatarUrl} alt="המפצחת" className="w-12 h-12 rounded-full" />
                            </div>
                            <div className="flex-1 mr-3 overflow-hidden">
                                <div className="flex justify-between items-center">
                                    <h4 className={`font-bold truncate text-white`}>{details.title}</h4>
                                    {lastMessage && <p className="text-xs text-slate-400 flex-shrink-0">{lastMessage.time}</p>}
                                </div>
                               <div className="flex justify-between items-center">
                                    <p className="text-sm text-slate-400 truncate">{details.subtitle}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


interface ChatPageProps {
    aiChatSessions: { [lessonId: string]: AiChatSession };
    onSendMessage: (lessonId: string, messageText: string) => void;
    courses: Course[];
    allLessons: Lesson[];
    unreadChats: string[]; // This might now refer to unread lessons with AI chats
    onMarkAsRead: (lessonId: string) => void;
}


export const ChatPage: React.FC<ChatPageProps> = ({ aiChatSessions, onSendMessage, courses, allLessons, unreadChats, onMarkAsRead }) => {
    const sessionList = Object.values(aiChatSessions);
    const [activeLessonId, setActiveLessonId] = useState<string | null>(sessionList.length > 0 ? sessionList[0].lessonId : null);

    useEffect(() => {
        if(activeLessonId && unreadChats.includes(activeLessonId)) {
            onMarkAsRead(activeLessonId);
        }
    }, [activeLessonId, unreadChats, onMarkAsRead]);

    const handleSelectChat = (lessonId: string) => {
        setActiveLessonId(lessonId);
        if(unreadChats.includes(lessonId)) {
            onMarkAsRead(lessonId);
        }
    };

    const handleSendMessage = (text: string) => {
        if (activeLessonId) {
            onSendMessage(activeLessonId, text);
        }
    };

    const activeSession = activeLessonId ? aiChatSessions[activeLessonId] : null;

    if (sessionList.length === 0) {
        return (
            <div className="text-white flex flex-col items-center justify-center h-full bg-[#1C2434] rounded-2xl text-center">
                <ChatIcon />
                <h2 className="text-2xl font-bold mt-4">אין עדיין שיחות עם המפצחת</h2>
                <p className="text-slate-400 mt-2">כדי להתחיל שיחה, יש להגיש משימה באחד השיעורים.</p>
            </div>
        );
    }
    
    const activeLesson = allLessons.find(l => l.id === activeLessonId);
    const activeCourse = courses.find(c => c.id === activeLesson?.courseId);

    return (
        <>
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div className="lg:col-span-2 xl:col-span-3 h-full">
                    {activeSession && activeCourse && activeLesson ? (
                        <AiConversationView 
                            session={activeSession} 
                            courseName={activeCourse.title}
                            lessonName={activeLesson.title}
                            onSend={handleSendMessage} 
                        />
                    ) : <div className="text-white flex items-center justify-center h-full bg-[#1C2434] rounded-2xl"><p>בחר שיחה כדי להציג אותה.</p></div>}
                </div>
                <div className="lg:col-span-1 xl:col-span-1 h-full hidden lg:block">
                    <AiChatList 
                        sessions={sessionList} 
                        activeLessonId={activeLessonId} 
                        onSelectChat={handleSelectChat}
                        allLessons={allLessons}
                        courses={courses}
                    />
                </div>
            </div>
        </>
    );
};