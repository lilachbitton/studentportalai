import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { DownloadIcon, EyeIcon, PaperclipIcon, SendIcon, XIcon } from '../components/Icons';
import type { AiChatSession, Message } from './StudentDashboard'; // Assuming types are exported from StudentDashboard

interface Lesson {
  id: string;
  title: string;
  courseId: string;
}

interface LessonPageProps {
  lesson: Lesson;
  onNewFeedback: (lessonId: string) => void;
  aiChatSession: AiChatSession | undefined;
  onTaskSubmit: (taskContent: string, lesson: Lesson) => void;
  onSendMessage: (lessonId: string, messageText: string) => void;
}

const MaterialLightbox: React.FC<{ material: { name: string }, onClose: () => void }> = ({ material, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col text-right"
                onClick={e => e.stopPropagation()}
            >
                <header className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg text-gray-800">{material.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors p-2 rounded-full -m-2">
                        <XIcon />
                    </button>
                </header>
                <div className="flex-grow p-6 overflow-y-auto bg-slate-50">
                    <div className="w-full h-full bg-white border rounded-lg flex items-center justify-center">
                        <p className="text-gray-500 text-lg">תצוגה מקדימה של המסמך</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


const VideoPlayer: React.FC = () => (
    <div className="aspect-video bg-black rounded-xl flex items-center justify-center text-white shadow-2xl mb-8">
        <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path></svg>
            <p className="mt-2 font-semibold">הקלטת השיעור תופיע כאן</p>
        </div>
    </div>
);

const Materials: React.FC<{ onView: (material: any) => void }> = ({ onView }) => {
    const materials = [
        { name: 'מצגת שיעור.pdf', size: '2.4MB' },
        { name: 'דף עזר - נוסחאות.docx', size: '350KB' },
        { name: 'קישורים מומלצים.txt', size: '12KB' }
    ];
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg h-full">
            <h3 className="font-bold text-xl mb-4 text-gray-800">חומרי עזר</h3>
            <ul className="space-y-3">
                {materials.map((m, i) => (
                    <li key={i} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg">
                        <div className="flex items-center">
                            <PaperclipIcon />
                            <span className="mr-3 font-semibold text-gray-700">{m.name}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => onView(m)} className="text-sm text-orange-600 font-semibold hover:underline">
                                צפייה
                            </button>
                            <a href="#" className="text-sm text-gray-600 font-semibold hover:underline">
                                הורדה
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const TaskEditor: React.FC<{ 
    onTaskSubmit: (taskContent: string) => void;
    isChatActive: boolean;
}> = ({ onTaskSubmit, isChatActive }) => {
    const [taskContent, setTaskContent] = useState('');
    const [taskStatus, setTaskStatus] = useState<'new' | 'awaiting' | 'feedback' | 'completed'>(isChatActive ? 'awaiting' : 'new');

    const statusConfig = {
        new: { text: 'חדש', bg: 'bg-blue-200', textColor: 'text-blue-800', buttonText: 'הגש למשוב' },
        awaiting: { text: 'בשיחה עם המפצחת', bg: 'bg-yellow-200', textColor: 'text-yellow-800', buttonText: 'ממתין...' },
        feedback: { text: 'יש משוב', bg: 'bg-purple-200', textColor: 'text-purple-800', buttonText: 'הגש שוב לאחר תיקון' },
        completed: { text: 'הושלם', bg: 'bg-green-200', textColor: 'text-green-800', buttonText: 'הכל מעולה!' }
    };
     React.useEffect(() => {
        setTaskStatus(isChatActive ? 'awaiting' : 'new');
    }, [isChatActive]);

    const handleStudentSubmit = () => {
        if (taskContent.trim()) {
            onTaskSubmit(taskContent);
            setTaskStatus('awaiting');
        }
    };

    const currentStatus = statusConfig[taskStatus];
    const isStudentActionDisabled = taskStatus === 'awaiting' || taskStatus === 'completed';

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg">
             <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-gray-800">משימה שבועית</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentStatus.bg} ${currentStatus.textColor}`}>
                    {currentStatus.text}
                </span>
            </div>
            <p className="text-gray-600 mb-4">כאן יש לענות על המשימה השבועית. לאחר ההגשה, תוכל להתייעץ עם "המפצחת" - סוכנת הבינה המלאכותית שלנו.</p>
            <div className="bg-slate-50 rounded-lg p-1 border border-slate-200">
                <textarea 
                    value={taskContent}
                    onChange={(e) => setTaskContent(e.target.value)}
                    placeholder="התחל לכתוב את תשובתך כאן..."
                    className="w-full h-64 p-3 bg-transparent border-0 focus:ring-0 resize-none text-gray-800 placeholder-gray-500"
                    disabled={isStudentActionDisabled}
                ></textarea>
            </div>
            <div className="mt-4 flex justify-end items-center">
                 <button 
                    onClick={handleStudentSubmit}
                    disabled={isStudentActionDisabled}
                    className={`font-bold py-2 px-6 rounded-lg transition-colors ${
                        isStudentActionDisabled 
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700 text-white'
                    }`}
                >
                    {currentStatus.buttonText}
                </button>
            </div>
        </div>
    );
};

const TheCrackerChat: React.FC<{
    messages: Message[];
    onSendMessage: (message: string) => void;
    isThinking: boolean;
}> = ({ messages, onSendMessage, isThinking }) => {
    const [newMessage, setNewMessage] = useState('');
    const crackerAvatarUrl = "https://api.dicebear.com/8.x/bottts/svg?seed=TheCracker";

    const handleSend = () => {
        if(newMessage.trim()){
            onSendMessage(newMessage);
            setNewMessage('');
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col h-full">
            <h3 className="font-bold text-xl mb-4 text-gray-800">צ'אט עם המפצחת</h3>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4 h-64">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex items-end gap-2 ${msg.sender === 'you' ? 'justify-end' : ''}`}>
                        {msg.sender === 'cracker' && <img src={crackerAvatarUrl} alt="Cracker" className="w-8 h-8 rounded-full"/>}
                        <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.sender === 'you' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-gray-800'}`}>
                            <div className="markdown-content">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                            </div>
                            <span className={`text-xs mt-1 block ${msg.sender === 'you' ? 'text-orange-200' : 'text-gray-500'} text-left`}>{msg.time}</span>
                        </div>
                    </div>
                ))}
                 {isThinking && (
                    <div className="flex items-end gap-2">
                        <img src={crackerAvatarUrl} alt="Cracker" className="w-8 h-8 rounded-full"/>
                        <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-slate-100 text-gray-800">
                            <div className="flex items-center">
                                <span className="text-gray-500">המפצחת מנסחת תשובה</span>
                                <div className="dot-flashing ml-2"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex gap-2 border-t pt-4">
                <input 
                    type="text" 
                    placeholder="כתוב הודעה..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    className="flex-1 p-3 bg-slate-100 border-slate-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
                <button onClick={handleSend} className="bg-orange-600 hover:bg-orange-700 text-white font-bold p-3 rounded-lg transition-colors">
                    <SendIcon/>
                </button>
            </div>
        </div>
    );
}

export const LessonPage: React.FC<LessonPageProps> = ({ lesson, aiChatSession, onTaskSubmit, onSendMessage }) => {
  const [lightboxMaterial, setLightboxMaterial] = useState<{ name: string; size: string } | null>(null);

  return (
    <>
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">{lesson.title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column for video and task */}
          <div className="lg:col-span-2 space-y-8">
            <VideoPlayer />
            <TaskEditor onTaskSubmit={(taskContent) => onTaskSubmit(taskContent, lesson)} isChatActive={!!aiChatSession} />
          </div>
          {/* Right column for materials and chat */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            <Materials onView={setLightboxMaterial} />
            {aiChatSession && (
              <TheCrackerChat 
                messages={aiChatSession.messages} 
                onSendMessage={(message) => onSendMessage(lesson.id, message)}
                isThinking={aiChatSession.isThinking}
              />
            )}
          </div>
        </div>
      </div>
      {lightboxMaterial && <MaterialLightbox material={lightboxMaterial} onClose={() => setLightboxMaterial(null)} />}
    </>
  );
};