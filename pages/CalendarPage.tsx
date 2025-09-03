import React, { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XIcon } from '../components/Icons';


interface Event {
    time: string;
    title: string;
    type: 'group' | 'personal' | 'bonus';
}

interface EventsData {
    [key: string]: Event[];
}


const typeStyles = {
    group: { bg: 'bg-orange-500', dot: 'bg-orange-400', border: 'border-orange-500' },
    personal: { bg: 'bg-blue-500', dot: 'bg-blue-400', border: 'border-blue-500' },
    bonus: { bg: 'bg-green-500', dot: 'bg-green-400', border: 'border-green-500' },
};

// Function to generate dynamic mock events
const generateMockEvents = (): EventsData => {
    const events: EventsData = {};
    const today = new Date();
    const eventTypes: ('group' | 'personal' | 'bonus')[] = ['group', 'personal', 'bonus'];
    const eventTitles = {
        group: ['שיעור שבועי: שיווק', 'שיעור שבועי: מכירות', 'מפגש קבוצתי'],
        personal: ['פגישה אישית: מעקב', 'שיחת התקדמות', 'פגישת ייעוץ'],
        bonus: ['שיעור בונוס: קופירייטינג', 'מפגש נטוורקינג', 'סדנת כלים דיגיטליים']
    };

    // Generate events for the last 2 months, current month, and next 2 months
    for (let monthOffset = -2; monthOffset <= 2; monthOffset++) {
        const date = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        
        // Generate 5-10 events per month
        for (let i = 0; i < Math.floor(Math.random() * 6) + 5; i++) {
            const dayOfMonth = Math.floor(Math.random() * daysInMonth) + 1;
            const eventDate = new Date(date.getFullYear(), date.getMonth(), dayOfMonth);
            const dateKey = eventDate.toISOString().split('T')[0];
            
            if (!events[dateKey]) {
                events[dateKey] = [];
            }

            const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
            const title = eventTitles[type][Math.floor(Math.random() * eventTitles[type].length)];
            const hour = Math.floor(Math.random() * 12) + 9; // 9 AM to 8 PM

            events[dateKey].push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                title,
                type,
            });
        }
    }
    return events;
};

// AddEventModal Component
const AddEventModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    date: Date;
    onAddEvent: (event: { date: string } & Event) => void;
}> = ({ isOpen, onClose, date, onAddEvent }) => {
    if (!isOpen) return null;

    const [title, setTitle] = useState('');
    const [type, setType] = useState<'group' | 'personal' | 'bonus'>('group');
    const [time, setTime] = useState('10:00');

    const handleCloseAndReset = () => {
        setTitle('');
        setType('group');
        setTime('10:00');
        onClose();
    };

    const handleSave = () => {
        if (!title.trim()) return; // Basic validation
        onAddEvent({
            date: date.toISOString().split('T')[0],
            time,
            title,
            type,
        });
        handleCloseAndReset();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={handleCloseAndReset}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col text-right p-6"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">הוספת אירוע חדש</h3>
                     <button onClick={handleCloseAndReset} className="text-slate-400 hover:text-white transition-colors p-1 rounded-full -m-1">
                        <XIcon />
                    </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                    <div>
                        <label htmlFor="event-title" className="block text-sm font-semibold text-slate-300 mb-2">כותרת האירוע</label>
                        <input 
                            id="event-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="לדוגמה: שיעור שבועי"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">סוג האירוע</label>
                        <div className="flex gap-2">
                           {(['group', 'personal', 'bonus'] as const).map((key) => (
                               <button 
                                key={key}
                                type="button"
                                onClick={() => setType(key)}
                                className={`flex-1 p-2 rounded-lg border-2 capitalize transition-colors ${type === key ? `${typeStyles[key].border} ${typeStyles[key].bg} opacity-100` : 'border-slate-600 hover:border-slate-400 opacity-70'}`}
                               >
                                {key === 'group' && 'קבוצתי'}
                                {key === 'personal' && 'אישי'}
                                {key === 'bonus' && 'בונוס'}
                               </button>
                           ))}
                        </div>
                    </div>
                    <div>
                         <label htmlFor="event-time" className="block text-sm font-semibold text-slate-300 mb-2">שעה</label>
                         <input
                            id="event-time"
                            type="time"
                            value={time}
                            onChange={e => setTime(e.target.value)}
                            className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                         />
                    </div>
                
                    <div className="mt-8 flex justify-end gap-3 pt-4">
                        <button type="button" onClick={handleCloseAndReset} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700 transition-colors">ביטול</button>
                        <button type="submit" className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold transition-colors">שמור אירוע</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export const CalendarPage: React.FC = () => {
    const [today] = useState(new Date());
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isAddEventModalOpen, setAddEventModalOpen] = useState(false);
    
    const [events, setEvents] = useState<EventsData>(() => generateMockEvents());

    const handleAddEvent = (newEvent: { date: string } & Event) => {
        const { date, ...restOfEvent } = newEvent;
        setEvents(prevEvents => {
            const dayEvents = prevEvents[date] ? [...prevEvents[date]] : [];
            dayEvents.push(restOfEvent);
            dayEvents.sort((a, b) => a.time.localeCompare(b.time));

            return {
                ...prevEvents,
                [date]: dayEvents,
            };
        });
    };

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setDate(1); // Avoid issues with different month lengths
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };

    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const days = [];
    let day = new Date(startDate);
    while (day <= endDate) {
        days.push(new Date(day));
        day.setDate(day.getDate() + 1);
    }
    
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    
    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const eventsForSelectedDay = events[selectedDateString] || [];

    return (
        <>
            <div className="bg-[#1C2434] text-white p-6 md:p-8 h-full rounded-2xl flex flex-col overflow-hidden">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 md:mb-8 flex-shrink-0">יומן</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow overflow-hidden">
                    {/* Calendar Grid */}
                    <div className="lg:col-span-2 bg-[#243041] p-4 md:p-6 rounded-2xl shadow-lg flex flex-col">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
                                <ChevronRightIcon />
                            </button>
                            <h2 className="text-xl md:text-2xl font-bold text-center">
                                {currentDate.toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
                            </h2>
                            <button onClick={() => changeMonth(1)} className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors">
                                <ChevronLeftIcon />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center font-semibold text-slate-400 mb-2 flex-shrink-0">
                            {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(d => <div key={d}>{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-1 md:gap-2 flex-grow">
                            {days.map((d, i) => {
                                const dateKey = d.toISOString().split('T')[0];
                                const hasEvents = !!events[dateKey];
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedDate(d)}
                                        className={`py-2 px-1 rounded-lg md:rounded-xl cursor-pointer transition-colors flex flex-col items-center justify-start aspect-square
                                        ${!isSameDay(d, selectedDate) ? 'hover:bg-slate-700/50' : ''}
                                        ${isSameDay(d, today) && !isSameDay(d, selectedDate) ? 'border-2 border-orange-700/50' : ''}
                                        ${isSameDay(d, selectedDate) ? 'bg-orange-600 text-white font-bold shadow-lg' : ''}`}
                                    >
                                        <span className={`text-base md:text-lg ${d.getMonth() !== currentDate.getMonth() ? 'text-slate-500' : 'text-slate-200'}`}>{d.getDate()}</span>
                                        {hasEvents && (
                                        <div className="flex justify-center mt-2 space-x-1 space-x-reverse">
                                                {events[dateKey].slice(0, 3).map((event, idx) => (
                                                    <div key={idx} className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeStyles[event.type].dot}`}></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Event List */}
                    <div className="lg:col-span-1 bg-[#243041] p-4 md:p-6 rounded-2xl shadow-lg flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center mb-6 flex-shrink-0">
                            <h3 className="font-bold text-lg md:text-xl">
                            אירועים ליום {selectedDate.toLocaleDateString('he-IL', { day: 'numeric', month: 'short' })}
                            </h3>
                            <button onClick={() => setAddEventModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm px-3 py-2 rounded-lg flex items-center gap-2 transition-colors">
                                <PlusIcon className="w-4 h-4" />
                                הוסף אירוע
                            </button>
                        </div>
                        <div className="space-y-4 overflow-y-auto pr-2 flex-grow">
                            {eventsForSelectedDay.length > 0 ? (
                                eventsForSelectedDay.map((event, i) => (
                                    <div key={i} className={`p-4 rounded-lg flex gap-4 border-r-4 ${typeStyles[event.type].border} bg-[#1C2434]`}>
                                        <div className="flex-grow">
                                            <p className="font-bold">{event.title}</p>
                                            <p className="text-sm text-gray-400 mt-1">{event.time}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-center text-slate-500">
                                    <p>אין אירועים להצגה.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <AddEventModal 
                isOpen={isAddEventModalOpen} 
                onClose={() => setAddEventModalOpen(false)} 
                date={selectedDate} 
                onAddEvent={handleAddEvent}
            />
        </>
    );
};