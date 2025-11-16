import React from 'react';
import VideoPlayer from '../video/VideoPlayer';
import VideoGrid from '../video/VideoGrid';
import SearchBar from '../features/SearchBar';

const MainContent = () => {
    const generatePlaceholder = (title, color = '4a5568') => {
        const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
            <!-- Background -->
            <rect width="640" height="360" fill="#${color}"/>
            
            <!-- Play icon circle -->
            <circle cx="320" cy="150" r="40" fill="#ffffff" opacity="0.9"/>
            
            <!-- Play icon triangle -->
            <path d="M 310 135 L 310 165 L 335 150 Z" fill="#${color}"/>
            
            <!-- Title text -->
            <text 
                x="320" 
                y="230" 
                font-family="Arial, sans-serif" 
                font-size="24" 
                font-weight="bold"
                fill="#ffffff" 
                text-anchor="middle">
                ${title}
            </text>
        </svg>
    `;

        const base64 = btoa(unescape(encodeURIComponent(svg)));
        return `data:image/svg+xml;base64,${base64}`;
    };

    const shortsData = [
        {
            id: 1,
            title: "Spring",
            author: "Blender Animation...",
            thumbnail: generatePlaceholder("Spring", "3b82f6"),
            duration: "0:15",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        },
        {
            id: 2,
            title: "Caminandes 1: Llama Drama",
            author: "Blender Animation...",
            thumbnail: generatePlaceholder("Llama Drama", "10b981"),
            duration: "1:30",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        },
        {
            id: 3,
            title: "Caminandes 2: Gran Dillama",
            author: "Blender Animation...",
            thumbnail: generatePlaceholder("Gran Dillama", "f59e0b"),
            duration: "2:30",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
        },
        {
            id: 4,
            title: "Caminandes 3: Llamigos",
            author: "Blender Animation...",
            thumbnail: generatePlaceholder("Llamigos", "ec4899"),
            duration: "2:30",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
        },
        {
            id: 5,
            title: "Big Buck Bunny",
            author: "Blender Animation...",
            thumbnail: generatePlaceholder("Big Buck Bunny", "8b5cf6"),
            duration: "9:56",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
    ];

    const popularVideos = [
        {
            id: 6,
            title: "Big Buck Bunny",
            author: "Blender Foundation • 10 minutes",
            thumbnail: generatePlaceholder("Big Buck Bunny", "8b5cf6"),
            views: "Open source animated short film",
            duration: "9:56",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        },
        {
            id: 7,
            title: "Elephant's Dream",
            author: "Blender Foundation • 11 minutes",
            thumbnail: generatePlaceholder("Elephants Dream", "06b6d4"),
            views: "First open movie project",
            duration: "10:53",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        },
        {
            id: 8,
            title: "Sintel",
            author: "Blender Foundation • 15 minutes",
            thumbnail: generatePlaceholder("Sintel", "ef4444"),
            views: "Fantasy short film",
            duration: "14:48",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        },
        {
            id: 9,
            title: "Tears of Steel",
            author: "Blender Foundation • 12 minutes",
            thumbnail: generatePlaceholder("Tears of Steel", "6366f1"),
            views: "Sci-fi short film",
            duration: "12:14",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
        },
        {
            id: 10,
            title: "For Bigger Blazes",
            author: "Google • 15 seconds",
            thumbnail: generatePlaceholder("Blazes", "f97316"),
            views: "Short sample video",
            duration: "0:15",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
        },
        {
            id: 11,
            title: "For Bigger Escape",
            author: "Google • 15 seconds",
            thumbnail: generatePlaceholder("Escape", "14b8a6"),
            views: "Short sample video",
            duration: "0:15",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
        },
        {
            id: 12,
            title: "For Bigger Fun",
            author: "Google • 15 seconds",
            thumbnail: generatePlaceholder("Fun", "eab308"),
            views: "Short sample video",
            duration: "0:15",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
        },
        {
            id: 13,
            title: "For Bigger Joyrides",
            author: "Google • 15 seconds",
            thumbnail: generatePlaceholder("Joyrides", "ec4899"),
            views: "Short sample video",
            duration: "0:15",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
        },
        {
            id: 14,
            title: "For Bigger Meltdowns",
            author: "Google • 15 seconds",
            thumbnail: generatePlaceholder("Meltdowns", "f43f5e"),
            views: "Short sample video",
            duration: "0:15",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
        },
        {
            id: 15,
            title: "Subaru Outback",
            author: "Google • 30 seconds",
            thumbnail: generatePlaceholder("Subaru", "3b82f6"),
            views: "Car commercial",
            duration: "0:30",
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4"
        }
    ];

    return (
        <main className="flex-1 bg-[#1e1e1e] overflow-auto">
            <div className="p-6 border-b border-gray-700">
                <SearchBar />
            </div>

            <div className="p-6">
                <VideoPlayer />
            </div>

            <div className="px-6 pb-6 space-y-8">
                <VideoGrid videos={shortsData} title="Watch2Gether Shorts" columns={5} />
                <VideoGrid videos={popularVideos} title="Popular videos" columns={5} />
            </div>
        </main>
    );
};

export default MainContent; 