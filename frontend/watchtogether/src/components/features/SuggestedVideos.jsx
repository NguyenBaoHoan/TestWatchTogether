import React from 'react';
import VideoCard from '../ui/VideoCard'; // Import card UI

// Dữ liệu giả để hiển thị, sau này bạn có thể thay bằng dữ liệu từ API
const suggestedVideosData = [
    { title: "Spring", author: "Blender Animation...", thumbnail: "https://placehold.co/400x225/334155/ffffff?text=Spring" },
    { title: "Caminandes 1: Llama Drama", author: "Blender Animation...", thumbnail: "https://placehold.co/400x225/334155/ffffff?text=Llama" },
    { title: "Caminandes 2: Gran Dillama", author: "Blender Animation...", thumbnail: "https://placehold.co/400x225/334155/ffffff?text=Dillama" },
    { title: "Caminandes 3: Llamigos", author: "Blender Animation...", thumbnail: "https://placehold.co/400x225/334155/ffffff?text=Llamigos" },
    { title: "Big Buck Bunny", author: "Blender Animation...", thumbnail: "https://placehold.co/400x225/334155/ffffff?text=Bunny" },
];

const SuggestedVideos = () => {
    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-3">Watch2Gether Shorts</h3>
            {/* - `grid`: Sử dụng CSS Grid.
              - `grid-flow-col`: Làm cho các item chảy theo hàng ngang.
              - `auto-cols-[220px]`: Set chiều rộng cố định cho mỗi cột (mỗi video card).
              - `overflow-x-auto`: Tạo thanh cuộn ngang nếu các item vượt quá chiều rộng màn hình.
              - `gap-4`: Khoảng cách giữa các item.
            */}
            <div className="grid grid-flow-col auto-cols-[220px] gap-4 overflow-x-auto pb-4">
                {suggestedVideosData.map((video, index) => (
                    <VideoCard key={index} video={video} />
                ))}
            </div>
        </div>
    );
};

export default SuggestedVideos;
