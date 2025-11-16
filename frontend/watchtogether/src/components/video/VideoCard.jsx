import React from 'react';
import { useVideo } from '../../context/VideoContext';

const VideoCard = ({ video }) => {
    
    const { changeVideo, videoUrl } = useVideo();
    const isPlaying = videoUrl === video.videoUrl;
    
    const handleVideoClick = () => {
        if (video.videoUrl) {
            console.log('🎬 Loading video:', video.title);
            changeVideo(video.videoUrl);

            // Scroll to video player
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div
            className={`flex flex-col gap-3 cursor-pointer group ${isPlaying ? 'ring-2 ring-blue-500 rounded-lg' : ''}`}
            onClick={handleVideoClick}
        >
            {/* Thumbnail */}
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                {/* ⭐ DÙng IMG với thumbnail từ props */}
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // ⭐ Fallback nếu thumbnail lỗi
                        console.error('Thumbnail failed to load:', video.thumbnail);
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('bg-gradient-to-br', 'from-gray-700', 'to-gray-900');
                        
                        // Show play icon as fallback
                        const fallbackDiv = document.createElement('div');
                        fallbackDiv.className = 'absolute inset-0 flex items-center justify-center';
                        fallbackDiv.innerHTML = `
                            <svg class="w-12 h-12 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                        `;
                        e.target.parentElement.appendChild(fallbackDiv);
                    }}
                />

                {/* Duration Badge */}
                {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        {video.duration}
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <svg
                        className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                </div>
            </div>

            {/* Video Info */}
            <div className="flex flex-col gap-1">
                <h3 className="text-white text-sm font-medium line-clamp-2 group-hover:text-blue-400 transition-colors">
                    {video.title}
                </h3>
                <p className="text-gray-400 text-xs line-clamp-1">
                    {video.author}
                </p>
                {video.views && (
                    <p className="text-gray-500 text-xs">
                        {video.views}
                    </p>
                )}
            </div>
            {isPlaying && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Now Playing
                </div>
            )}
        </div>
    );
};

export default VideoCard;