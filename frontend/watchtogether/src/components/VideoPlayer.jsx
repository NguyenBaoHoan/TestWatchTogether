import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId, isPlaying, timestamp, onStateChange, onPlayerInstance }) => {
    // Lưu trữ instance của YouTube Player để gọi lệnh (play/pause/seek)
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    // Lưu videoId cũ để so sánh
    const prevVideoIdRef = useRef(videoId);
    // THÊM BIẾN NÀY: Cờ để chặn loop
    const isRemoteUpdate = useRef(false);
    // Timer để xử lý Debounce (Trì hoãn) cho sự kiện Pause
    const pauseTimeout = useRef(null);
    // Cấu hình Player

    // BẢO VỆ CHỐNG CRASH: Nếu không có videoId, không render
    if (!videoId) {
        return (
            <div className="relative w-full pt-[56.25%] bg-gray-900 rounded-lg shadow flex items-center justify-center text-white">
                <p>Đang chờ video...</p>
            </div>
        );
    }

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin, // Fix lỗi chặn nhúng
        },
    };


    // Hàm được gọi khi Player tải xong API
    const onReady = (event) => {
        console.log("YouTube Player Ready!");
        playerRef.current = event.target;
        setIsReady(true);
        // 2. Gửi cái điều khiển này ra ngoài cho App dùng
        if (onPlayerInstance) {
            onPlayerInstance(event.target);
        }
        // Thực hiện đồng bộ (Seek + Play/Pause) ngay khi sẵn sàng
        try {
            isRemoteUpdate.current = true; // Bật cờ chặn loop

            // Seek đến đúng thời gian
            playerRef.current.seekTo(timestamp, true);

            // Đặt đúng trạng thái Play/Pause
            if (isPlaying) {
                playerRef.current.playVideo();
            } else {
                playerRef.current.pauseVideo();
            }

            // Tắt cờ sau 1 giây
            setTimeout(() => {
                isRemoteUpdate.current = false;
            }, 1000);

        } catch (e) {
            console.error("Lỗi khi đồng bộ lần đầu (onReady):", e);
        }
    };

    // Xử lý đồng bộ từ Server -> Client
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        // Chỉ chạy nếu Player đã sẵn sàng (đã qua onReady)
        if (!isReady || !playerRef.current) {
            return;
        }
        if (prevVideoIdRef.current !== videoId) {
            console.log("Detected Video Change: Skipping Sync to allow loading...");
            // Cập nhật lại ref thành video mới
            prevVideoIdRef.current = videoId;
            // QUAN TRỌNG: Return ngay lập tức! 
            // Không cho phép code phía dưới chạy (lệnh seek/pause) khi đang load video mới.
            // react-youtube sẽ tự động load video mới, đừng can thiệp lúc này.
            return;
        }
        try {
            isRemoteUpdate.current = true;
            const playerState = playerRef.current.getPlayerState();

            if (isPlaying && playerState !== 1) {
                playerRef.current.playVideo();
            } else if (!isPlaying && playerState === 1) {
                playerRef.current.pauseVideo();
            }

            const currentTime = playerRef.current.getCurrentTime();
            if (Math.abs(currentTime - timestamp) > 1.5) { // Tăng lên 1.5s
                playerRef.current.seekTo(timestamp, true);
            }

            setTimeout(() => {
                isRemoteUpdate.current = false;
            }, 500);
        } catch (e) {
            console.error("Lỗi khi đồng bộ video (useEffect):", e);
        }

    }, [isPlaying, timestamp, isReady, videoId]); // Bỏ isReady, chỉ phụ thuộc vào state từ server

    // Xử lý sự kiện người dùng bấm trên Player (Client -> Server)
    const handleStateChange = (event) => {
        if (isRemoteUpdate.current) return;

        const playerState = event.data;
        const currentTime = event.target.getCurrentTime();

        // Xóa timer Pause đang chờ (nếu có)
        if (pauseTimeout.current) {
            clearTimeout(pauseTimeout.current);
            pauseTimeout.current = null;
        }

        // 1 = PLAYING
        if (playerState === 1) {
            // Gửi lệnh PLAY (onStateChange đã được App.jsx lọc)
            onStateChange('PLAY', currentTime);
        }
        // 2 = PAUSED
        else if (playerState === 2) {
            // Chờ 250ms để lọc Pause do tua/lag
            pauseTimeout.current = setTimeout(() => {
                onStateChange('PAUSE', currentTime);
            }, 250);
        }
        // 3 = BUFFERING -> KHÔNG LÀM GÌ CẢ. 
        // Vì sau khi buffer xong, nó sẽ tự nhảy sang 1 hoặc 2.
    };
    // Xử lý lỗi nội bộ của Player (để tránh crash App)
    const onError = (e) => {
        console.warn("YouTube Player Error:", e.data);
    };

    if (!videoId) return <div className="bg-black w-full pt-[56.25%]" />;

    return (
        <div className="relative w-full pt-[56.25%] bg-black rounded-lg overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-full h-full">
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={handleStateChange}
                    className="w-full h-full" // Class cho iframe
                    iframeClassName="w-full h-full" // Class cho thẻ iframe thực tế
                    onError={onError} // Thêm bắt lỗi
                />
            </div>
        </div>
    );
};

export default VideoPlayer;