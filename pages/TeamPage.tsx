import React, { useState } from 'react';
import { AdminTeamMember } from './AdminCoursesPage';
import { PlusIcon, PencilIcon, TrashIcon, XIcon, SearchIcon } from '../components/Icons';

// Mock API, in real app this would be in services/api.ts
const mockApi = {
    addTeamMember: async (member: Omit<AdminTeamMember, 'id'>, members: AdminTeamMember[]): Promise<AdminTeamMember[]> => {
        const newMember = { ...member, id: `team-${Date.now()}` };
        return [...members, newMember];
    },
    updateTeamMember: async (memberId: string, updatedData: Partial<AdminTeamMember>, members: AdminTeamMember[]): Promise<AdminTeamMember[]> => {
        return members.map(m => m.id === memberId ? { ...m, ...updatedData } : m);
    },
    deleteTeamMember: async (memberId: string, members: AdminTeamMember[]): Promise<AdminTeamMember[]> => {
        return members.filter(m => m.id !== memberId);
    }
};


interface TeamPageProps {
    teamMembers: AdminTeamMember[];
    // Real app would have setters passed from parent, here we manage state locally for demonstration
}

const MemberModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (member: Omit<AdminTeamMember, 'id'>) => void;
    memberToEdit?: AdminTeamMember | null;
}> = ({ isOpen, onClose, onSave, memberToEdit }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [department, setDepartment] = useState<'Sales' | 'Mentoring' | 'Admin'>('Mentoring');

    React.useEffect(() => {
        if (isOpen && memberToEdit) {
            setName(memberToEdit.name);
            setRole(memberToEdit.role);
            setDepartment(memberToEdit.department || 'Mentoring');
        } else if (isOpen) {
            setName('');
            setRole('');
            setDepartment('Mentoring');
        }
    }, [isOpen, memberToEdit]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!name.trim() || !role.trim()) return;
        onSave({ name, role, department });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-[#243041] text-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col p-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-xl">{memberToEdit ? 'עריכת איש צוות' : 'הוספת איש צוות חדש'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-full -m-1"><XIcon /></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">שם מלא</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">תפקיד</label>
                        <input type="text" value={role} onChange={e => setRole(e.target.value)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg" placeholder="לדוגמה: מלווה עסקי" />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-slate-300 mb-2 block">מחלקה</label>
                        <select value={department} onChange={e => setDepartment(e.target.value as any)} className="w-full p-2 bg-[#1C2434] border border-slate-600 rounded-lg">
                            <option value="Mentoring">ליווי</option>
                            <option value="Sales">מכירות</option>
                            <option value="Admin">מנהלה</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-700">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-700">ביטול</button>
                    <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 font-bold">שמור</button>
                </div>
            </div>
        </div>
    );
};

export const TeamPage: React.FC<TeamPageProps> = ({ teamMembers: initialMembers }) => {
    const [teamMembers, setTeamMembers] = useState(initialMembers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState<AdminTeamMember | null>(null);

    const filteredMembers = teamMembers.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const openAddModal = () => {
        setMemberToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: AdminTeamMember) => {
        setMemberToEdit(member);
        setIsModalOpen(true);
    };

    const handleSaveMember = async (memberData: Omit<AdminTeamMember, 'id'>) => {
        if (memberToEdit) {
            const updatedMembers = await mockApi.updateTeamMember(memberToEdit.id, memberData, teamMembers);
            setTeamMembers(updatedMembers);
        } else {
            const updatedMembers = await mockApi.addTeamMember(memberData, teamMembers);
            setTeamMembers(updatedMembers);
        }
    };
    
    const handleDeleteMember = async (memberId: string) => {
        if(window.confirm('האם אתה בטוח שברצונך למחוק את איש הצוות?')) {
            const updatedMembers = await mockApi.deleteTeamMember(memberId, teamMembers);
            setTeamMembers(updatedMembers);
        }
    };

    return (
        <>
            <div className="text-white">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">ניהול צוות</h1>
                        <p className="text-slate-400 mt-2">ניהול אנשי הצוות במערכת.</p>
                    </div>
                    <button onClick={openAddModal} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded-lg flex items-center gap-2">
                        <PlusIcon />
                        <span>הוסף איש צוות</span>
                    </button>
                </header>
                <div className="bg-[#243041] p-6 rounded-2xl shadow-lg">
                     <div className="mb-6">
                         <div className="relative">
                            <input 
                                type="search" 
                                placeholder="חיפוש לפי שם..." 
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full max-w-lg bg-[#1C2434] text-slate-300 rounded-lg py-2 pr-10 pl-3 focus:outline-none" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"><SearchIcon /></div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="border-b-2 border-slate-700 text-sm text-slate-400">
                                <tr>
                                    <th className="p-4 font-semibold">שם מלא</th>
                                    <th className="p-4 font-semibold">תפקיד</th>
                                    <th className="p-4 font-semibold">מחלקה</th>
                                    <th className="p-4 font-semibold">פעולות</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {filteredMembers.map(member => (
                                    <tr key={member.id} className="hover:bg-slate-800/20">
                                        <td className="p-4 font-semibold text-slate-200">{member.name}</td>
                                        <td className="p-4 text-slate-300">{member.role}</td>
                                        <td className="p-4 text-slate-300">{member.department}</td>
                                        <td className="p-4">
                                            <div className="flex gap-4">
                                                <button onClick={() => openEditModal(member)} className="text-slate-400 hover:text-orange-400"><PencilIcon /></button>
                                                <button onClick={() => handleDeleteMember(member.id)} className="text-slate-400 hover:text-red-500"><TrashIcon /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {filteredMembers.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <p>לא נמצאו אנשי צוות.</p>
                        </div>
                    )}
                </div>
            </div>
            <MemberModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSave={handleSaveMember}
                memberToEdit={memberToEdit}
            />
        </>
    );
};
