import React, { useEffect, useRef, useState } from 'react';
import { useVideo } from '../../context/VideoContext';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, Loader } from 'lucide-react';


export default function VideoPlayer() {
    const {
        videoUrl,
        isPlaying,
        currentTime,
        duration,
        playVideo,
        pauseVideo,
        seekVideo,
        changeVideo,
        playerRef,
        isSyncing,        // ⭐ State để UI tự động update khi sync
        updateCurrentTime,
        updateDuration,
    } = useVideo();

    const videoElementRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    // ============================================
    // 🎬 SETUP VIDEO PLAYER
    // ============================================
    useEffect(() => {
        if (!videoElementRef.current) return;

        const videoElement = videoElementRef.current;

        // Expose player methods cho VideoProvider
        playerRef.current = {
            playVideo: () => {
                return videoElement.play().catch(console.error);
            },
            pauseVideo: () => {
                videoElement.pause();
            },
            seekTo: (time) => {
                videoElement.currentTime = time;
            },
            loadVideoByUrl: (url) => {
                setIsLoading(true);
                videoElement.src = url;
                videoElement.load();
            },
        };

        // Set initial volume
        videoElement.volume = volume;
        videoElement.muted = isMuted;
    }, [playerRef, volume, isMuted]);

    // ============================================
    // ⭐ SYNC STATE WITH VIDEO ELEMENT
    // ============================================
    // Phần useEffect này chịu trách nhiệm đồng bộ trạng thái phát/tạm dừng (isPlaying) từ React state xuống video element thực tế.
    // Nếu bỏ phần này, khi bạn thay đổi isPlaying (ví dụ bấm nút play/pause), video element sẽ không tự động phát hoặc dừng theo state nữa.
    // Điều này là do video element không tự biết khi nào state thay đổi, nên cần useEffect để "đẩy" lệnh play/pause xuống DOM.
    // Ngoài ra, nó còn xử lý lỗi autoplay bị chặn trên trình duyệt (NotAllowedError) bằng cách thử play lại.
    useEffect(() => {
        if (!videoElementRef.current) return;
        const videoElement = videoElementRef.current;

        if (isPlaying) {
            const playPromise = videoElement.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.error('Play fail: ', error);
                    // Nếu autoplay bị chặn, thử play lại thủ công
                    if (error.name === 'NotAllowedError') {
                        console.warn('Autoplay blocked, playing manually');
                        videoElement.play();
                    }
                });
            }
        } else {
            videoElement.pause();
        }
    }, [isPlaying]);
    // ============================================
    // 📍 VIDEO EVENT HANDLERS
    // ============================================
    const handleVideoPlay = () => {
        if (!isSyncing) {
            console.log('🎬 Video played by user');
            playVideo();
        }
    };

    const handleVideoPause = () => {
        if (!isSyncing) {
            console.log('⏸️ Video paused by user');
            pauseVideo();
        }
    };

    // ✅ FIX: Thêm debounce cho onTimeUpdate để tránh quá nhiều updates
    const timeUpdateRef = useRef(null);
    
    const handleTimeUpdate = (e) => {
        if (!isSyncing && updateCurrentTime) {
            // Debounce để tránh quá nhiều updates
            if (timeUpdateRef.current) {
                clearTimeout(timeUpdateRef.current);
            }
            timeUpdateRef.current = setTimeout(() => {
                updateCurrentTime(e.target.currentTime);
            }, 100); // Debounce 100ms
        }
    };

    // ✅ FIX: Cleanup timeout khi component unmount
    useEffect(() => {
        return () => {
            if (timeUpdateRef.current) {
                clearTimeout(timeUpdateRef.current);
            }
        };
    }, []);

    const handleLoadedMetadata = (e) => {
        console.log('📊 Video metadata loaded, duration:', e.target.duration);
        if (updateDuration) {
            updateDuration(e.target.duration);
        }
        setIsLoading(false);
    };

    const handleLoadStart = () => {
        setIsLoading(true);
        setIsBuffering(true);
    };

    const handleCanPlay = () => {
        setIsBuffering(false);
    };

    const handleWaiting = () => {
        setIsBuffering(true);
    };

    const handlePlaying = () => {
        setIsBuffering(false);
    };

    // ============================================
    // 📍 USER INTERACTION HANDLERS
    // ============================================
    const handlePlayPause = () => {
        if (isPlaying) {
            pauseVideo();
        } else {
            playVideo();
        }
    };

    const handleSeek = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const newTime = (clickX / rect.width) * duration;
        seekVideo(newTime);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoElementRef.current) {
            videoElementRef.current.volume = newVolume;
        }
        if (newVolume === 0) {
            setIsMuted(true);
        } else if (isMuted) {
            setIsMuted(false);
        }
    };

    const handleMuteToggle = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (videoElementRef.current) {
            videoElementRef.current.muted = newMuted;
        }
    };

    const handleVideoUrlSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get('videoUrl');
        if (url && url.trim()) {
            changeVideo(url.trim());
            e.target.reset();
        }
    };

    // ============================================
    // 📊 COMPUTED VALUES
    // ============================================
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
        <div className="w-full bg-black rounded-lg overflow-hidden">
            {/* Video URL Input */}
            <div className="bg-gray-800 p-4 border-b border-gray-700">
                <form onSubmit={handleVideoUrlSubmit} className="flex gap-2">
                    <input
                        type="url"
                        name="videoUrl"
                        placeholder="Enter video URL (mp4, webm, etc.)"
                        className="flex-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Load Video
                    </button>
                </form>
            </div>

            {/* Video Element */}
            <div className="relative aspect-video bg-gray-900">
                {!videoUrl ? (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                            <Play size={48} className="mx-auto mb-2 opacity-50" />
                            <p>No video loaded. Enter a video URL above.</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <video
                            ref={videoElementRef}
                            src={videoUrl}
                            className="w-full h-full"
                            onPlay={handleVideoPlay}
                            onPause={handleVideoPause}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onLoadStart={handleLoadStart}
                            onCanPlay={handleCanPlay}
                            onWaiting={handleWaiting}
                            onPlaying={handlePlaying}
                        />

                        {/* Loading overlay */}
                        {(isLoading || isBuffering) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <Loader size={32} className="animate-spin text-white" />
                            </div>
                        )}

                        {/* Sync indicator */}
                        {isSyncing && (
                            <div className="absolute top-4 right-4 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                                Syncing...
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="bg-gray-900 p-4">
                {/* Progress bar */}
                <div
                    className="w-full h-2 bg-gray-700 rounded-full mb-4 cursor-pointer"
                    onClick={handleSeek}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handlePlayPause}
                            className="p-2 hover:bg-gray-700 rounded disabled:opacity-50"
                            disabled={!videoUrl}
                        >
                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                        </button>
                        <span className="text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Volume controls */}
                        <button
                            onClick={handleMuteToggle}
                            className="p-2 hover:bg-gray-700 rounded"
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX size={20} />
                            ) : (
                                <Volume2 size={20} />
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />

                        <button className="p-2 hover:bg-gray-700 rounded">
                            <Settings size={20} />
                        </button>
                        <button className="p-2 hover:bg-gray-700 rounded">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}