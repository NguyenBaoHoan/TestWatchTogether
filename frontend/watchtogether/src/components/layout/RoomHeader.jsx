import React from 'react';
import { Maximize, Grip, User } from 'lucide-react';

// Đây là một "Dumb Component", chỉ nhận dữ liệu và hiển thị, không có logic phức tạp.
const RoomHeader = () => {
    return (
        <header className="bg-[#1e1e24] text-gray-300 flex items-center justify-between px-4 py-1 border-b border-gray-700">
            <div className="flex items-center space-x-4 text-sm">
                <p>Temporary Room</p>
                <div className="flex space-x-2">
                    <Grip size={16} className="cursor-pointer hover:text-white" />
                    <Maximize size={16} className="cursor-pointer hover:text-white" />
                </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
                <button className="text-yellow-400 font-semibold hover:text-yellow-300">Upgrade</button>
                <button className="hover:text-white">Extension</button>
                <div className="flex items-center space-x-1 bg-gray-700 px-2 py-1 rounded-md cursor-pointer">
                    <User size={16} />
                    <span>UG</span>
                </div>
            </div>
        </header>
    );
};

export default RoomHeader;
