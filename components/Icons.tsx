import React from 'react';

const Icon: React.FC<{ path: string; className?: string }> = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

export const DashboardIcon = () => <Icon className="w-6 h-6" path="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />;
export const CoursesIcon = () => <Icon className="w-6 h-6" path="M10.394 2.08a1 1 0 00-.788 0l-7 3.5a1 1 0 000 1.84L9 9.58v4.42l-4.5-2.25a1 1 0 00-1 1.732l5.5 2.75a1 1 0 001 0l5.5-2.75a1 1 0 00-1-1.732L11 13.998V9.582l6.5-3.25a1 1 0 000-1.84l-7-3.5z" />;
export const CalendarIcon = () => <Icon className="w-6 h-6" path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />;
export const TeamIcon = () => <Icon className="w-6 h-6" path="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM21 15a1 1 0 00-1-1h-2a4 4 0 00-8 0H8a1 1 0 00-1 1v2a1 1 0 001 1h12a1 1 0 001-1v-2z" />;
export const TicketsIcon = () => <Icon className="w-6 h-6" path="M15 5H5a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2zm-2 4a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0z" />;
export const ChatIcon = () => <Icon className="w-6 h-6" path="M18 10c0 3.314-3.582 6-8 6a9.06 9.06 0 01-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C2.345 12.433 2 11.262 2 10c0-3.314 3.582-6 8-6s8 2.686 8 6z" />;
export const BookOpenIcon = () => <Icon className="w-5 h-5 mr-2" path="M10 2a8 8 0 00-8 8v2a2 2 0 002 2h12a2 2 0 002-2V10a8 8 0 00-8-8zm0 14a6 6 0 110-12 6 6 0 010 12zM10 4a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5A.75.75 0 0010 4z" />;
export const LogoutIcon = ({className = "w-6 h-6"}: {className?: string}) => <Icon className={className} path="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />;
export const SearchIcon = () => <Icon className="w-5 h-5 text-slate-400" path="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />;
export const BellIcon = () => <Icon className="w-6 h-6" path="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15h14a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />;
export const PlusIcon = ({className = "w-5 h-5"}: {className?: string}) => <Icon className={className} path="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />;
export const ChevronDownIcon = () => <Icon className="w-5 h-5" path="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />;
export const ChevronUpIcon = () => <Icon className="w-5 h-5" path="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />;
export const ChevronLeftIcon = () => <Icon className="w-6 h-6" path="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />;
export const ChevronRightIcon = () => <Icon className="w-6 h-6" path="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />;
export const VideoCameraIcon = () => <Icon className="w-5 h-5 mr-2" path="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />;
export const DownloadIcon = () => <Icon className="w-5 h-5 mr-1 text-gray-500" path="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />;
export const EyeIcon = () => <Icon className="w-5 h-5 mr-1 text-orange-600" path="M10 12a2 2 0 100-4 2 2 0 000 4zM2 10a8 8 0 1116 0 8 8 0 01-16 0z" />;
export const PaperclipIcon = () => <Icon className="w-5 h-5 text-gray-400" path="M15.172 7.172a4 4 0 01-5.656 0L4.879 11.818a2.5 2.5 0 11-3.536-3.536l6.667-6.667a1 1 0 011.414 1.414L2.78 9.682a.5.5 0 10.707.707l7.333-7.333a2.5 2.5 0 00-3.536-3.536L1.828 5.828a4 4 0 105.656 5.656l9.636-9.636a.5.5 0 01.707.707l-9.636 9.636a2.5 2.5 0 01-3.536-3.536l6.667-6.667a1 1 0 011.414 1.414l-6.667 6.667a.5.5 0 00.707.707l6.667-6.667a2.5 2.5 0 013.536 3.536l-9.9 9.9a4 4 0 01-5.656-5.656l9.9-9.9z" />;
export const SendIcon = () => <Icon className="w-5 h-5" path="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />;
export const XIcon = () => <Icon className="w-6 h-6" path="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />;
export const CheckCircleIcon = () => <Icon className="w-6 h-6 text-orange-400" path="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />;
export const CalendarButtonIcon = () => <Icon className="w-4 h-4" path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />;
export const MessageIcon = () => <Icon className="w-4 h-4" path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884zM18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />;
export const PencilIcon = ({className = "w-4 h-4"}: {className?: string}) => <Icon className={className} path="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />;
export const TrashIcon = () => <Icon className="w-4 h-4" path="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" />;
export const CameraIcon = () => <Icon className="w-6 h-6 text-white" path="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586l-.707-.707A2 2 0 0012.414 4H7.586a2 2 0 00-1.414.586L5.586 5H4zm6 9a4 4 0 100-8 4 4 0 000 8zM8 9a2 2 0 114 0 2 2 0 01-4 0z" />;
export const ClipboardCheckIcon = () => <Icon className="w-6 h-6" path="M9 2a2 2 0 00-2 2v12a2 2 0 002 2h2a2 2 0 002-2V4a2 2 0 00-2-2H9zM7 4h4v12H7V4zm8 0a1 1 0 011-1h.5a1 1 0 110 2H16a1 1 0 01-1-1zm-1 5.5a1 1 0 00-1-1H9a1 1 0 100 2h5a1 1 0 001-1zm-1 3.5a1 1 0 00-1-1H9a1 1 0 100 2h5a1 1 0 001-1z" />;