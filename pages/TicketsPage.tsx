import React, { useState, useEffect } from 'react';
import { XIcon } from '../components/Icons';

export interface ConversationMessage {
    sender: 'user' | 'you';
    name: string;
    text: string;
    time: string;
}

export interface Ticket {
    id: string;
    studentId: string;
    subject: string;
    status: 'פתוחה' | 'סגורה';
    lastUpdate: string;
    conversation: ConversationMessage[];
}

interface TicketsPageProps {
    tickets: Ticket[];
    unreadTickets: string[];
    onReply: (ticketId: string, replyText: string) => void;
    onNewTicket: (subject: string, message: string) => void;
    onMarkAsRead: (ticketId: string) => void;
}

const ViewTicketModal: React.FC<{ 
    ticket: Ticket | null; 
    onClose: () => void;
    onReply: (ticketId: string, replyText: string) => void;
}> = ({ ticket, onClose, onReply }) => {
    const [reply, setReply] = useState('');
    const [currentTicket, setCurrentTicket] = useState(ticket);

    useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    if (!currentTicket) return null;

    const handleReply = () => {
        if (!reply.trim()) return;
        
        onReply(currentTicket.id, reply);

        const newReplyMessage: ConversationMessage = {
            sender: 'you',
            name: 'מנהל מערכת',
            text: reply,
            time: new Date().toLocaleString('he-IL'),
        };
        setCurrentTicket(prev => {
            if (!prev) return null;
            return {
                ...prev,
                conversation: [...prev.conversation, newReplyMessage]
            };
        });
        
        setReply('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6 h-[80vh]"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">{currentTicket.subject}</h3>
                        <p className="text-sm text-slate-400">פנייה מס' {currentTicket.id} מאת {currentTicket.conversation[0]?.name || 'תלמיד'}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="flex-grow overflow-y-auto space-y-4 p-4 bg-[#1C2434] rounded-lg">
                    {currentTicket.conversation.map((msg, i) => (
                        <div key={i} className={`flex items-start gap-3 ${msg.sender === 'you' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-3 rounded-xl max-w-lg ${msg.sender === 'you' ? 'bg-orange-600' : 'bg-slate-700'}`}>
                                <p className="font-bold text-sm mb-1">{msg.name}</p>
                                <p className="text-slate-200">{msg.text}</p>
                                <p className="text-xs text-slate-400 mt-2 text-left">{msg.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="mt-4 pt-4 border-t border-slate-700 flex-shrink-0">
                    <textarea 
                        rows={3} 
                        className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg" 
                        placeholder="הוסף תגובה..."
                        value={reply}
                        onChange={e => setReply(e.target.value)}
                    />
                    <div className="flex justify-end mt-3">
                         <button onClick={handleReply} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold">שלח תגובה</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TicketsPage: React.FC<TicketsPageProps> = ({ tickets, onReply }) => {
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
    const statusStyles: { [key: string]: string } = { 'פתוחה': 'bg-green-500/20 text-green-400', 'סגורה': 'bg-slate-500/20 text-slate-400' };

    return (
        <>
            <div className="text-white">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">ניהול פניות</h1>
                        <p className="text-slate-400 mt-2">צפייה וטיפול בפניות פתוחות מהתלמידים.</p>
                    </div>
                </header>
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="border-b-2 border-slate-700 text-sm text-slate-400">
                                <tr>
                                    <th className="p-4 font-semibold">נושא הפנייה</th>
                                    <th className="p-4 font-semibold">סטטוס</th>
                                    <th className="p-4 font-semibold">עדכון אחרון</th>
                                    <th className="p-4 font-semibold">פעולות</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {tickets.map(ticket => (
                                    <tr key={ticket.id} onClick={() => setViewingTicket(ticket)} className="hover:bg-slate-800/20 cursor-pointer">
                                        <td className="p-4 font-semibold text-slate-200">{ticket.subject}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[ticket.status]}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300">{new Date(ticket.lastUpdate).toLocaleDateString('he-IL')}</td>
                                        <td className="p-4">
                                            <button onClick={(e) => { e.stopPropagation(); setViewingTicket(ticket); }} className="text-orange-400 hover:underline">צפה וטפל</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {tickets.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>אין פניות להצגה.</p>
                        </div>
                    )}
                </div>
            </div>
            <ViewTicketModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} onReply={onReply} />
        </>
    );
};
