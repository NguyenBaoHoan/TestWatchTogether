import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, title, columns = 5 }) => {
    console.log('VideoGrid render:', title, videos.length); // Debug

    return (
        <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
            <div className={`grid gap-4 ${columns === 5 ? 'grid-cols-5' :
                    columns === 4 ? 'grid-cols-4' :
                        'grid-cols-3'
                }`}>
                {videos.map((video, index) => (
                    <VideoCard
                        key={video.id || index}
                        video={video}
                        isLarge={index === 0 && title === "Popular videos"}
                    />
                ))}
            </div>
        </div>
    );
};

export default VideoGrid;