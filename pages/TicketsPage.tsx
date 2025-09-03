import React, { useState } from 'react';
import { XIcon, SendIcon, PlusIcon } from '../components/Icons';


// --- TYPES & MOCK DATA ---
export interface ConversationMessage {
    sender: 'you' | 'other';
    name: string;
    text: string;
    time: string;
}

export interface Ticket {
    id: string;
    subject: string;
    teamMember: string;
    lastUpdate: string;
    status: 'פתוחה' | 'סגורה';
    conversation: ConversationMessage[];
    studentId?: string; // Optional: To link tickets to students in admin view
}

export const initialMockTickets: Ticket[] = [
    { id: 'TKT-001', studentId: 's1', subject: 'שאלה על המשימה השבועית בשיעור 3', teamMember: 'רועי כהן', lastUpdate: '20.09.2024', status: 'פתוחה', conversation: [
        {sender: 'you', name: 'ישראל ישראלי', text: 'היי רועי, אני לא בטוח איך לגשת לסעיף האחרון במשימה, אפשר הכוונה?', time: '19.09.2024 10:30'},
        {sender: 'other', name: 'רועי כהן', text: 'בטח, הרעיון הוא להשתמש במה שלמדנו על לולאות. תנסה לחשוב איך אפשר לבצע איטרציה על המערך שהצגתי בדוגמה.', time: '20.09.2024 09:15'},
    ]},
    { id: 'TKT-002', studentId: 's2', subject: 'בעיה בהתחברות לזום', teamMember: 'יעל שחר', lastUpdate: '18.09.2024', status: 'סגורה', conversation: [
        {sender: 'you', name: 'ישראל ישראלי', text: 'אני לא מצליח להתחבר לזום של השיעור היום.', time: '18.09.2024 17:55'},
        {sender: 'other', name: 'יעל שחר', text: 'היי, שלחתי לך לינק חדש למייל, נסה אותו.', time: '18.09.2024 17:58'},
        {sender: 'you', name: 'ישראל ישראלי', text: 'עובד, תודה רבה!', time: '18.09.2024 18:01'},
    ]},
    { id: 'TKT-003', studentId: 's1', subject: 'בקשה לפגישה אישית', teamMember: 'דניאל לוי', lastUpdate: '15.09.2024', status: 'סגורה', conversation: [] },
    { id: 'TKT-004', studentId: 's2', subject: 'הצעה לשיפור הפורטל', teamMember: 'יעל שחר', lastUpdate: '12.09.2024', status: 'פתוחה', conversation: [] },
    { id: 'TKT-005', studentId: 's1', subject: 'אישור קבלת חומרי עזר', teamMember: 'רועי כהן', lastUpdate: '10.09.2024', status: 'סגורה', conversation: [] },
];

// --- MODALS ---
const NewTicketModal: React.FC<{ teamMembers: string[]; isOpen: boolean; onClose: () => void; onSave: (newTicketData: { subject: string; teamMember: string; message: string; }) => void; }> = ({ teamMembers, isOpen, onClose, onSave }) => {
    const [subject, setSubject] = useState('');
    const [teamMember, setTeamMember] = useState(teamMembers[0] || '');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    const handleSave = () => {
        if (!subject.trim() || !message.trim()) return;
        onSave({
            subject,
            teamMember,
            message,
        });
        // Reset and close
        setSubject('');
        setTeamMember(teamMembers[0] || '');
        setMessage('');
        onClose();
    };

    return (
         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">פתיחת פנייה חדשה</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">נושא הפנייה</label>
                        <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="נושא קצר וברור"/>
                    </div>
                     <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">למי הפנייה?</label>
                        <select value={teamMember} onChange={e => setTeamMember(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                           {teamMembers.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">תוכן הפנייה</label>
                        <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="פרט כאן את תוכן הפנייה..."/>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שלח</button>
                </div>
            </div>
        </div>
    );
};

const ViewTicketModal: React.FC<{ ticket: Ticket | null; onClose: () => void; onReply: (ticketId: string, replyText: string) => void; }> = ({ ticket, onClose, onReply }) => {
    const [reply, setReply] = useState('');
    const [currentTicket, setCurrentTicket] = useState(ticket);

    // Effect to update local state when prop changes
    React.useEffect(() => {
        setCurrentTicket(ticket);
    }, [ticket]);

    if (!currentTicket) return null;

    const handleReply = () => {
        if (!reply.trim()) return;
        onReply(currentTicket.id, reply);
        // Optimistically update the local view
        const newConversation: ConversationMessage = {
             sender: 'you',
             name: 'ישראל ישראלי',
             text: reply,
             time: new Date().toLocaleString('he-IL')
        };
        setCurrentTicket(prev => prev ? ({...prev, conversation: [...prev.conversation, newConversation]}) : null);
        setReply('');
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6 h-[80vh]">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">{currentTicket.subject}</h3>
                        <p className="text-sm text-slate-400">פנייה מס' {currentTicket.id} אל {currentTicket.teamMember}</p>
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
                    <textarea value={reply} onChange={e => setReply(e.target.value)} rows={3} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" placeholder="הוסף תגובה..."/>
                    <div className="flex justify-end mt-3">
                         <button onClick={handleReply} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors flex items-center gap-2">
                             <SendIcon/>
                             שלח תגובה
                         </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
interface TicketsPageProps {
    tickets: Ticket[];
    unreadTickets: string[];
    onReply: (ticketId: string, replyText: string) => void;
    onNewTicket: (ticketData: { subject: string; teamMember: string; message: string; }) => void;
    onMarkAsRead: (ticketId: string) => void;
}

const statusStyles: { [key: string]: string } = { 'פתוחה': 'bg-green-500/20 text-green-400', 'סגורה': 'bg-slate-500/20 text-slate-400', };
type FilterStatus = 'הכל' | 'פתוחות' | 'סגורות';

export const TicketsPage: React.FC<TicketsPageProps> = ({ tickets, unreadTickets, onReply, onNewTicket, onMarkAsRead }) => {
    const [filter, setFilter] = useState<FilterStatus>('הכל');
    const [viewingTicket, setViewingTicket] = useState<Ticket | null>(null);
    const [isNewTicketModalOpen, setNewTicketModalOpen] = useState(false);

    const handleViewTicket = (ticket: Ticket) => {
        setViewingTicket(ticket);
        onMarkAsRead(ticket.id);
    };

    const handleSaveNewTicket = (newTicketData: { subject: string; teamMember: string; message: string; }) => {
       onNewTicket(newTicketData);
       setNewTicketModalOpen(false);
    };

    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'הכל') return true;
        if (filter === 'פתוחות') return ticket.status === 'פתוחה';
        if (filter === 'סגורות') return ticket.status === 'סגורה';
        return false;
    });

    const teamMembers = [...new Set(initialMockTickets.map(t => t.teamMember))];

    return (
        <>
            <div className="text-white">
                <header className="mb-10">
                    <h1 className="text-5xl font-extrabold mb-2">ניהול פניות</h1>
                    <p className="text-xl text-slate-400">מעקב וניהול כל הפניות שלך לצוות התכנית</p>
                </header>

                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex gap-2 bg-[#1C2434] p-1.5 rounded-lg">
                            {(['הכל', 'פתוחות', 'סגורות'] as FilterStatus[]).map(f => (
                                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${filter === f ? 'bg-orange-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700/50'}`}>
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setNewTicketModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                            <PlusIcon className="w-4 h-4" />
                            פתח פנייה חדשה
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="border-b border-slate-700 text-sm text-slate-400">
                                <tr>
                                    <th className="p-4 font-semibold"></th>
                                    <th className="p-4 font-semibold">מספר פנייה</th>
                                    <th className="p-4 font-semibold">נושא</th>
                                    <th className="p-4 font-semibold">איש צוות</th>
                                    <th className="p-4 font-semibold">עדכון אחרון</th>
                                    <th className="p-4 font-semibold">סטטוס</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredTickets.map(ticket => (
                                    <tr key={ticket.id} className="hover:bg-slate-800/20 cursor-pointer" onClick={() => handleViewTicket(ticket)}>
                                        <td className="p-4 w-10">
                                            {unreadTickets.includes(ticket.id) && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>}
                                        </td>
                                        <td className="p-4 text-slate-400 font-mono text-sm">{ticket.id}</td>
                                        <td className="p-4 font-semibold text-slate-200">{ticket.subject}</td>
                                        <td className="p-4 text-slate-300">{ticket.teamMember}</td>
                                        <td className="p-4 text-slate-400">{ticket.lastUpdate}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[ticket.status]}`}>
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredTickets.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>לא נמצאו פניות התואמות לסינון.</p>
                        </div>
                    )}
                </div>
            </div>
            <NewTicketModal isOpen={isNewTicketModalOpen} onClose={() => setNewTicketModalOpen(false)} onSave={handleSaveNewTicket} teamMembers={teamMembers} />
            <ViewTicketModal ticket={viewingTicket} onClose={() => setViewingTicket(null)} onReply={onReply} />
        </>
    );
};