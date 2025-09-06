import React from 'react';
import { PaperclipIcon, DownloadIcon } from '../components/Icons';

const mockLesson = {
    title: 'שיעור 3: קידום אורגני (SEO)',
    videoUrl: 'https://player.vimeo.com/video/902840925', // Placeholder Vimeo video
    task: `במשימה זו, עליך לבצע מחקר SEO בסיסי עבור העסק שלך או עסק לבחירתך.

1.  זהה 5 מילות מפתח עיקריות הרלוונטיות לעסק.
2.  כתוב כותרת (Title Tag) ותיאור (Meta Description) מותאמים למילת המפתח הראשית.
3.  הצע 3 רעיונות לתוכן בלוג המבוסס על מילות המפתח שמצאת.

הגש את המשימה בקובץ טקסט. בהצלחה!`,
    materials: [
        { id: 'm1', name: 'מצגת שיעור 3.pdf', url: '#' },
        { id: 'm2', name: 'רשימת כלים ל-SEO.docx', url: '#' },
    ]
};

export const LessonPage: React.FC = () => {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">{mockLesson.title}</h1>
                <p className="text-slate-400 mt-2">צפי בהקלטה, קראי את המשימה והתחילי לעבוד!</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="aspect-w-16 aspect-h-9 mb-8 bg-black rounded-lg overflow-hidden">
                        <iframe 
                            src={mockLesson.videoUrl}
                            frameBorder="0" 
                            allow="autoplay; fullscreen; picture-in-picture" 
                            allowFullScreen
                            className="w-full h-full"
                        ></iframe>
                    </div>
                     <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-4">הגשת משימה</h2>
                        <textarea 
                            rows={8}
                            className="w-full p-3 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="הדביקי כאן את תוכן המשימה או קישור לקובץ..."
                        />
                        <div className="flex justify-end mt-4">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg">הגש משימה</button>
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-4">משימה שבועית</h2>
                        <p className="text-slate-300 whitespace-pre-wrap">{mockLesson.task}</p>
                    </div>
                     <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-bold text-white mb-4">חומרי עזר</h2>
                        <ul className="space-y-3">
                            {mockLesson.materials.map(material => (
                                <li key={material.id}>
                                    <a href={material.url} download className="flex items-center justify-between p-3 bg-[#1C2434] rounded-lg hover:bg-slate-700/50">
                                        <div className="flex items-center gap-3">
                                            <PaperclipIcon />
                                            <span className="text-slate-300">{material.name}</span>
                                        </div>
                                        <DownloadIcon />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
