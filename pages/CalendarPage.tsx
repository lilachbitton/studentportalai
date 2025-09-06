import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons';

export const CalendarPage: React.FC = () => {
    // This is a simplified, non-functional calendar display for placeholder purposes.
    // A real implementation would use a library like FullCalendar.
    const days = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'];
    const monthName = "אוקטובר 2024";

    const renderCalendarGrid = () => {
        let cells = [];
        // Add empty cells for the start of the month
        for(let i=0; i<3; i++) {
            cells.push(<div key={`empty-${i}`} className="border border-slate-700 h-24"></div>);
        }
        // Add days of the month
        for(let day=1; day<=31; day++) {
            let content = <div className="p-2">{day}</div>;
            if (day === 8 || day === 22) { // Mock events
                content = <div className="p-2">{day}<div className="text-xs mt-1 p-1 bg-orange-600/50 rounded">שיעור</div></div>;
            }
             if (day === 15) { // Mock event
                content = <div className="p-2">{day}<div className="text-xs mt-1 p-1 bg-blue-600/50 rounded">הגשה</div></div>;
            }
            cells.push(<div key={day} className="border border-slate-700 h-24 text-slate-200">{content}</div>);
        }
        return cells;
    }

    return (
        <div>
            <header className="mb-8">
                <h1 className="text-4xl font-bold text-white">לוח שנה</h1>
                <p className="text-slate-400 mt-2">מעקב אחר שיעורים, הגשות ואירועים חשובים.</p>
            </header>
            <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <button className="p-2 rounded-full hover:bg-slate-700"><ChevronRightIcon /></button>
                    <h2 className="text-2xl font-bold text-white">{monthName}</h2>
                    <button className="p-2 rounded-full hover:bg-slate-700"><ChevronLeftIcon /></button>
                </div>
                <div className="grid grid-cols-7 text-center font-semibold text-slate-400">
                    {days.map(day => <div key={day} className="p-2">{day}</div>)}
                </div>
                 <div className="grid grid-cols-7">
                    {renderCalendarGrid()}
                 </div>
            </div>
        </div>
    );
};
