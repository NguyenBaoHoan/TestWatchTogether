import React from 'react';
import { UserPlus, Shield, Settings, Camera, Mic, MonitorUp, HelpCircle, User } from 'lucide-react';

// Dữ liệu cho các mục sidebar để tránh lặp code
const sidebarItems = [
    { icon: UserPlus, title: 'Invite', notification: 1, action: 'invite' },
    { icon: Shield, title: 'Permissions' },
    { icon: Settings, title: 'Settings', notification: 1 },
    { icon: Camera, title: 'Camera' },
    { icon: Mic, title: 'Microphone' },
    { icon: MonitorUp, title: 'Screen' },
];
const SidebarItem = ({ icon, title, notification, onClick }) => {
    const IconComponent = icon;
    return (
        <button onClick={onClick} title={title} className="p-3 w-full flex justify-center rounded-lg hover:bg-gray-700 transition-colors relative">
            <IconComponent className="h-6 w-6 text-gray-300" />
            {notification && (
                <span className="absolute top-1 right-1 bg-yellow-500 text-black text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {notification}
                </span>
            )}
        </button>
    );
};


// `onInviteClick` là hàm được truyền từ RoomPage
const LeftSidebar = ({ onInviteClick }) => {
    return (
        <aside className="w-20 bg-[#2c2c34] p-2 flex flex-col items-center justify-between">
            <div className='w-full'>
                <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center font-bold text-black text-2xl mb-4">W</div>
                <div className="space-y-2 w-full">
                    {sidebarItems.map((item) => (
                        <SidebarItem
                            key={item.title}
                            icon={item.icon}
                            title={item.title}
                            notification={item.notification}
                            // Nếu action là 'invite', gán hàm onInviteClick cho nó
                            onClick={item.action === 'invite' ? onInviteClick : null}
                        />
                    ))}
                </div>
            </div>

            <div className='space-y-2 w-full'>
                <SidebarItem icon={HelpCircle} title="Help" />
                <div className="text-center text-xs text-gray-400">
                    <div className="mx-auto w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center mb-1">
                        <User size={18} />
                    </div>
                    User-UQGET
                </div>
            </div>
        </aside>
    );
};

export default LeftSidebar;
