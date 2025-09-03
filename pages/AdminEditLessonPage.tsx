import React, { useState, useEffect } from 'react';
import type { AdminLesson, AdminMaterial } from './AdminCoursesPage';
import { ChevronRightIcon, PlusIcon, TrashIcon, XIcon, PaperclipIcon } from '../components/Icons';

interface AdminEditLessonPageProps {
    lesson: AdminLesson;
    onBack: () => void;
    onUpdateLesson: (updatedData: Omit<AdminLesson, 'id' | 'title'>) => void;
}

const AddMaterialModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, url: string) => void;
}> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim() || !url.trim()) return;
        onSave(name, url);
        setName('');
        setUrl('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">הוספת חומר עזר</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם הקובץ</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="לדוגמה: מצגת שיעור 1"/>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">קישור לקובץ</label>
                        <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="https://..."/>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור חומר עזר</button>
                </div>
            </div>
        </div>
    );
};

export const AdminEditLessonPage: React.FC<AdminEditLessonPageProps> = ({ lesson, onBack, onUpdateLesson }) => {
    const [videoUrl, setVideoUrl] = useState('');
    const [task, setTask] = useState('');
    const [materials, setMaterials] = useState<AdminMaterial[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');

    useEffect(() => {
        setVideoUrl(lesson.videoUrl || '');
        setTask(lesson.task || '');
        setMaterials(lesson.materials || []);
    }, [lesson]);
    
    const showFeedback = (message: string) => {
        setFeedbackMessage(message);
        setTimeout(() => setFeedbackMessage(''), 3000);
    };
    
    const handleAddMaterial = (name: string, url: string) => {
        const newMaterial: AdminMaterial = {
            id: `mat-${Date.now()}`,
            name,
            url,
        };
        setMaterials(prev => [...prev, newMaterial]);
    };
    
    const handleDeleteMaterial = (materialId: string) => {
        setMaterials(prev => prev.filter(m => m.id !== materialId));
    };

    const handleSaveChanges = () => {
        onUpdateLesson({ videoUrl, task, materials });
        showFeedback('תוכן השיעור עודכן בהצלחה!');
    };

    return (
        <>
        <div className="text-white relative">
             {feedbackMessage && (
                <div className="absolute -top-4 right-0 bg-green-500 text-white font-bold px-6 py-2 rounded-lg shadow-lg animate-pulse z-50">
                    {feedbackMessage}
                </div>
            )}
            <header className="mb-8">
                <button onClick={onBack} className="flex items-center text-sm text-slate-400 hover:text-orange-400 transition-colors mb-4">
                    <ChevronRightIcon />
                    <span>חזרה לניהול המחזור</span>
                </button>
                <div>
                    <h1 className="text-4xl font-bold">ניהול תוכן שיעור: {lesson.title}</h1>
                    <p className="text-slate-400 mt-2">עדכן את התכנים שהתלמידים יראו בשיעור זה.</p>
                </div>
            </header>

            <div className="space-y-8">
                 {/* Video URL */}
                 <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <label htmlFor="video-url" className="text-xl font-bold text-slate-200 mb-4 block">הקלטת השיעור (קישור וידאו)</label>
                    <input 
                        id="video-url"
                        type="url"
                        value={videoUrl}
                        onChange={e => setVideoUrl(e.target.value)}
                        placeholder="הדבק כאן קישור להקלטת השיעור מ-Vimeo, YouTube וכו'..."
                        className="w-full p-3 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-left"
                        dir="ltr"
                    />
                </div>

                {/* Task */}
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <label htmlFor="task-content" className="text-xl font-bold text-slate-200 mb-4 block">משימה שבועית</label>
                     <textarea 
                        id="task-content"
                        value={task}
                        onChange={e => setTask(e.target.value)}
                        placeholder="כתוב כאן את תוכן המשימה לתלמידים..."
                        rows={8}
                        className="w-full p-3 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                
                {/* Materials */}
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-slate-200">חומרי עזר</h3>
                         <button onClick={() => setIsModalOpen(true)} className="bg-orange-600/80 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors">
                            <PlusIcon />
                            <span>הוסף חומר עזר</span>
                        </button>
                    </div>
                     <div className="bg-[#1C2434] rounded-lg p-2 space-y-2">
                        {materials.map(material => (
                            <div key={material.id} className="flex justify-between items-center p-3 hover:bg-slate-800/20 rounded-md">
                                <div className="flex items-center gap-3">
                                    <PaperclipIcon />
                                    <span className="font-semibold text-slate-300">{material.name}</span>
                                </div>
                                <button onClick={() => handleDeleteMaterial(material.id)} className="text-slate-500 hover:text-red-500 transition-colors" title="מחק חומר עזר">
                                    <TrashIcon />
                                </button>
                            </div>
                        ))}
                        {materials.length === 0 && (
                            <p className="text-center text-slate-500 p-6">אין חומרי עזר לשיעור זה.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
                <button onClick={handleSaveChanges} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform hover:scale-105">
                    שמור את כל השינויים בשיעור
                </button>
            </div>
        </div>
        <AddMaterialModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddMaterial} />
        </>
    );
};
