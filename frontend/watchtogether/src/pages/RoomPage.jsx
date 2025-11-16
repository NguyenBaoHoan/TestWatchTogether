import React, { useState } from 'react';
import { useRoom } from '../hooks/useRoom';
import  VideoProvider  from '../context/VideoProvider.jsx';
// Import các component layout và feature
import InviteModal from '../components/features/InviteModal';
import LeftSidebar from '../components/layout/LeftSidebar';
import MainContent from '../components/layout/MainContent';
import RightSidebar from '../components/layout/RightSidebar';
import RoomHeader from '../components/layout/RoomHeader';

function RoomPage({ roomDataOverride }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { roomData } = useRoom();
    const data = roomDataOverride || roomData;

    if (!data) {
        // Có thể thay thế bằng một component loading đẹp hơn sau này
        return <div className="bg-[#1e1e24] min-h-screen flex items-center justify-center text-white">Loading room...</div>;
    }

    const computedJoinUrl = (typeof window !== 'undefined' && data?.roomId)
        ? `${window.location.origin}/room/${data.roomId}`
        : data.joinUrl;

    return (
        <VideoProvider>
        <div className="bg-[#1e1e24] h-screen text-white flex flex-col font-sans">
            {/* Phần Header trên cùng */}
            <RoomHeader />

            {/* Phần thân chính của trang, sử dụng flex để chia cột */}
            <div className="flex flex-1 overflow-hidden">
                {/* - Cột 1: Sidebar trái.
                  - `onInviteClick` là một prop được truyền xuống để LeftSidebar có thể
                    ra lệnh cho RoomPage mở Modal. Đây là cách giao tiếp từ con lên cha.
                */}
                <LeftSidebar onInviteClick={() => setIsModalOpen(true)} />

                {/* Cột 2: Nội dung chính ở giữa */}
                <MainContent />

                {/* Cột 3: Sidebar phải */}
                <RightSidebar />
            </div>

            {/* Modal mời bạn bè, nằm ngoài layout chính để có thể che phủ toàn màn hình */}
            <InviteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                joinUrl={computedJoinUrl}
            />
        </div>
        </VideoProvider>
    );
}

export default RoomPage;
