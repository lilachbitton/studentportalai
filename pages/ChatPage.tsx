import React, { useState } from 'react';
import { SearchIcon, SendIcon } from '../components/Icons';

const mockConversations = [
    { id: 'conv1', name: 'רוני כהן (מלווה)', lastMessage: 'בטח, אני אסתכל על זה ואחזור אליך', time: '14:30', unread: 0, avatar: '/default-avatar.png' },
    { id: 'conv2', name: 'תמיכה טכנית', lastMessage: 'האם ניסית לרענן את העמוד?', time: 'אתמול', unread: 2, avatar: '/default-avatar.png' },
    { id: 'conv3', name: 'קרין', lastMessage: 'מעולה! נתאם פגישה', time: '23/10', unread: 0, avatar: '/default-avatar.png' },
];

const mockMessages = {
    'conv1': [
        { sender: 'other', text: 'היי, יש לי שאלה לגבי המשימה של השבוע.', time: '14:28' },
        { sender: 'me', text: 'בטח, מה השאלה?', time: '14:29' },
        { sender: 'other', text: 'לא בטוחה איך לבצע את מחקר המתחרים.', time: '14:29' },
        { sender: 'me', text: 'בטח, אני אסתכל על זה ואחזור אליך', time: '14:30' },
    ],
    'conv2': [
        { sender: 'me', text: 'היי, אני לא מצליחה לראות את הוידאו בשיעור 4', time: 'אתמול' },
        { sender: 'other', text: 'היי, תודה על פנייתך.', time: 'אתמול' },
        { sender: 'other', text: 'האם ניסית לרענן את העמוד?', time: 'אתמול' },
    ]
};

export const ChatPage: React.FC = () => {
    const [activeConversation, setActiveConversation] = useState(mockConversations[0]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;
        // Mock sending message
        console.log("Sending message:", newMessage);
        setNewMessage('');
    };

    return (
        <div className="flex h-[calc(100vh-10rem)] bg-[#243041] rounded-2xl shadow-lg text-white">
            {/* Conversations List */}
            <div className="w-1/3 border-l border-slate-700/50 flex flex-col">
                <div className="p-4 border-b border-slate-700/50">
                    <h2 className="text-xl font-bold">צ'אטים</h2>
                    <div className="relative mt-2">
                        <input type="search" placeholder="חיפוש..." className="w-full bg-[#1C2434] rounded-lg py-2 pr-9 pl-3" />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><SearchIcon /></div>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto">
                    {mockConversations.map(conv => (
                        <div key={conv.id} onClick={() => setActiveConversation(conv)}
                             className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-slate-700/30 ${activeConversation.id === conv.id ? 'bg-slate-800/50' : ''}`}>
                            <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <p className="font-semibold">{conv.name}</p>
                                    <p className="text-xs text-slate-400">{conv.time}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-slate-400 truncate">{conv.lastMessage}</p>
                                    {conv.unread > 0 && <span className="text-xs bg-orange-600 text-white font-bold rounded-full px-2 py-0.5">{conv.unread}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Chat Window */}
            <div className="w-2/3 flex flex-col">
                <div className="p-4 border-b border-slate-700/50 flex items-center gap-4">
                    <img src={activeConversation.avatar} alt={activeConversation.name} className="w-10 h-10 rounded-full" />
                    <h3 className="font-bold">{activeConversation.name}</h3>
                </div>
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {(mockMessages as any)[activeConversation.id].map((msg: any, i: number) => (
                         <div key={i} className={`flex items-start gap-3 ${msg.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-3 rounded-xl max-w-lg ${msg.sender === 'me' ? 'bg-orange-600' : 'bg-slate-700'}`}>
                                <p className="text-slate-200">{msg.text}</p>
                                <p className="text-xs text-slate-400 mt-2 text-left">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-slate-700/50">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                        <input 
                            type="text" 
                            placeholder="הקלד הודעה..." 
                            value={newMessage}
                            onChange={e => setNewMessage(e.target.value)}
                            className="w-full bg-[#1C2434] p-3 rounded-lg border border-slate-600"
                        />
                        <button type="submit" className="bg-orange-600 p-3 rounded-lg hover:bg-orange-700"><SendIcon /></button>
                    </form>
                </div>
            </div>
        </div>
    );
};
