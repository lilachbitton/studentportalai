import React, { useState } from 'react';
import { CalendarButtonIcon, MessageIcon, XIcon } from '../components/Icons';

// Type for the handler function passed from Dashboard
type NewTicketHandler = (ticketData: {
  subject: string;
  teamMember: string;
  message: string;
}) => void;

interface TeamMember {
    id: string;
    name: string;
    role: string;
    description: string;
    imageUrl: string;
    calendlyLink?: string;
    canSendMessage?: boolean;
}

const mockTeam: TeamMember[] = [
    { id: '1', name: 'רועי כהן', role: 'מנטור ראשי ומייסד', description: 'מומחה לאסטרטגיה עסקית ופיתוח. מלווה יזמים להצלחה משנת 2010.', imageUrl: `https://i.pravatar.cc/150?u=roy`, calendlyLink: '#', canSendMessage: true },
    { id: '2', name: 'דניאל לוי', role: 'מלווה עסקית בכירה', description: 'מומחית בשיווק דיגיטלי וניהול קמפיינים. עוזרת לעסקים להגיע לקהל היעד הנכון.', imageUrl: `https://i.pravatar.cc/150?u=danielle`, calendlyLink: '#'},
    { id: '3', name: 'יעל שחר', role: 'מנהלת קהילה', description: 'אחראית על כל מה שקשור לקהילת הטיטאנים, תמיכה וליווי שוטף.', imageUrl: `https://i.pravatar.cc/150?u=yael`, canSendMessage: true },
    { id: '4', name: 'איתי גורן', role: 'מומחה מכירות', description: 'בונה תהליכי מכירה מנצחים ומדריך כיצד לסגור עסקאות גדולות.', imageUrl: `https://i.pravatar.cc/150?u=itay`, canSendMessage: true, calendlyLink: '#' },
];

const SendMessageModal: React.FC<{ 
    member: TeamMember; 
    onClose: () => void; 
    onSend: NewTicketHandler;
    onGoToTickets: () => void;
}> = ({ member, onClose, onSend, onGoToTickets }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);

    const handleSend = () => {
        if (!message.trim() || !subject.trim()) return;
        onSend({
            subject: subject,
            teamMember: member.name,
            message: message,
        });
        setIsSent(true);
    };
    
    const handleCloseAndReset = () => {
        setIsSent(false);
        setSubject('');
        setMessage('');
        onClose();
    }
    
    const handleGoToTicketsAndClose = () => {
        onGoToTickets();
        handleCloseAndReset();
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={handleCloseAndReset}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xl">{isSent ? 'הפנייה נשלחה!' : `שליחת פנייה אל ${member.name}`}</h3>
                    <button onClick={handleCloseAndReset} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                {isSent ? (
                    <div className="text-center py-10">
                        <p className="text-slate-300 mb-6">הפנייה שלך נשלחה בהצלחה. <br/>{member.name} יחזור/תחזור אליך בהקדם.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleCloseAndReset} className="px-6 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 font-bold transition-colors">סגור</button>
                            <button onClick={handleGoToTicketsAndClose} className="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">מעבר לכל הפניות שלי</button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="space-y-4">
                         <div>
                            <label htmlFor="ticket-subject" className="block text-sm font-semibold text-slate-300 mb-2">נושא הפנייה</label>
                            <input
                                id="ticket-subject"
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="w-full p-3 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="נושא קצר וברור"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="message-content" className="block text-sm font-semibold text-slate-300 mb-2">תוכן הפנייה</label>
                            <textarea
                                id="message-content"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                rows={6}
                                className="w-full p-3 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder={`כתוב כאן את הודעתך אל ${member.name}...`}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                             <button type="button" onClick={handleCloseAndReset} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                             <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שלח פנייה</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const TeamMemberCard: React.FC<{ member: TeamMember, onSendMessage: (member: TeamMember) => void }> = ({ member, onSendMessage }) => {
    const colors = [
        'from-orange-500 to-amber-500',
        'from-teal-500 to-cyan-500',
        'from-purple-500 to-indigo-500',
        'from-rose-500 to-pink-500',
    ];
    const colorClass = colors[parseInt(member.id, 10) % colors.length];

    return (
        <div className="bg-[#243041] rounded-2xl shadow-lg flex flex-col overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
            <div className={`relative bg-gradient-to-br ${colorClass} h-28`}>
                <img src={member.imageUrl} alt={member.name} className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full ring-4 ring-[#243041]" />
            </div>
            <div className="p-6 pt-16 text-center flex-grow flex flex-col">
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-orange-300 font-semibold mb-3">{member.role}</p>
                <p className="text-slate-300 text-sm flex-grow mb-6">{member.description}</p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    {member.calendlyLink && (
                        <a href={member.calendlyLink} target="_blank" rel="noopener noreferrer" className="flex-1 text-center bg-slate-600/70 hover:bg-slate-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <CalendarButtonIcon />
                            <span>קבע פגישה</span>
                        </a>
                    )}
                    {member.canSendMessage && (
                        <button onClick={() => onSendMessage(member)} className="flex-1 text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                            <MessageIcon />
                            <span>שלח פנייה</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


export const TeamPage: React.FC<{ onNewTicket: NewTicketHandler; onGoToTickets: () => void }> = ({ onNewTicket, onGoToTickets }) => {
    const [modalMember, setModalMember] = useState<TeamMember | null>(null);

    return (
        <>
            <div className="text-white">
                <header className="mb-10 text-center">
                    <h1 className="text-5xl font-extrabold mb-2">צוות ביזנס אקספרס</h1>
                    <p className="text-xl text-slate-400">המנטורים והמלווים שיעזרו לכם להצליח</p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {mockTeam.map(member => (
                        <TeamMemberCard key={member.id} member={member} onSendMessage={setModalMember} />
                    ))}
                </div>
            </div>
            {modalMember && <SendMessageModal member={modalMember} onClose={() => setModalMember(null)} onSend={onNewTicket} onGoToTickets={onGoToTickets} />}
        </>
    );
};