import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = ({ videoId, isPlaying, timestamp, onStateChange, onPlayerInstance }) => {
    // Lưu trữ instance của YouTube Player để gọi lệnh (play/pause/seek)
    const playerRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    // THÊM BIẾN NÀY: Cờ để chặn loop
    const isRemoteUpdate = useRef(false);
    // Timer để xử lý Debounce (Trì hoãn) cho sự kiện Pause
    const pauseTimeout = useRef(null);
    // Cấu hình Player
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
    };

    // Xử lý đồng bộ từ Server -> Client
    useEffect(() => {
        if (isReady && playerRef.current) {
            // Báo hiệu rằng thay đổi sắp tới là do Server, không phải người dùng
            isRemoteUpdate.current = true;
            // 1. Đồng bộ Play/Pause
            const playerState = playerRef.current.getPlayerState();
            // 1 = Playing, 2 = Paused
            if (isPlaying && playerState !== 1) {
                playerRef.current.playVideo();
            } else if (!isPlaying && playerState === 1) {
                playerRef.current.pauseVideo();
            }

            // 2. Đồng bộ thời gian (Seek)
            const currentTime = playerRef.current.getCurrentTime();
            // Chỉ seek nếu lệch quá 1 giây để tránh giật video
            if (Math.abs(currentTime - timestamp) > 1) {
                playerRef.current.seekTo(timestamp, true);
            }
            // TẮT CỜ: Sau một khoảng ngắn, cho phép gửi sự kiện lại
            // setTimeout để đảm bảo sự kiện onStateChange của YouTube đã chạy xong
            setTimeout(() => {
                isRemoteUpdate.current = false;
            }, 500);
        }
    }, [isPlaying, timestamp, isReady]);

    // Xử lý sự kiện người dùng bấm trên Player (Client -> Server)
    const handleStateChange = (event) => {
        if (isRemoteUpdate.current) return;

        const playerState = event.data;
        const currentTime = event.target.getCurrentTime();

        // Xóa timer cũ
        if (pauseTimeout.current) {
            clearTimeout(pauseTimeout.current);
            pauseTimeout.current = null;
        }

        if (playerState === 1) { // PLAYING
            // Luôn gửi lệnh PLAY khi video thực sự chạy, bất kể trạng thái cũ là gì
            // Điều này giúp "sửa sai" nếu trạng thái bị lệch
            onStateChange('PLAY', currentTime);
        }
        else if (playerState === 2) { // PAUSED
            // Delay gửi Pause như cũ
            pauseTimeout.current = setTimeout(() => {
                onStateChange('PAUSE', currentTime);
            }, 250);
        }
        else if (playerState === 3) { // BUFFERING
            // KHI BUFFERING: Đừng dùng isPlaying cũ để quyết định!
            // Nếu Buffering xảy ra, thường là do người dùng muốn xem tiếp (Play) hoặc tua (Seek).
            // An toàn nhất: Chỉ gửi cập nhật thời gian, nhưng ÉP TRẠNG THÁI LÀ PLAY
            // Vì nếu đang Pause mà tua, nó sẽ Buffering -> sau đó Pause lại (nhờ timer ở trên).
            // Nhưng nếu đang Play mà Buffering -> Ta muốn nó tiếp tục Play.

            // SỬA LẠI: Nếu đang Play thì gửi Play.
            // Nếu đang Pause mà Buffering (thường là do tua), ta tạm thời coi như Play để các client khác load theo.
            // HOẶC: Đơn giản nhất là KHÔNG GỬI GÌ KHI BUFFERING nếu logic Play/Pause đã xử lý đủ tốt.

            // TUY NHIÊN, để fix lỗi của bạn:
            // Nếu buffering xảy ra khi đang Pause (isPlaying=false), nghĩa là người dùng vừa bấm Play hoặc Tua.
            // Ta nên ưu tiên gửi lệnh PLAY để đồng bộ việc "đang tải".

            if (isPlaying) {
                onStateChange('PLAY', currentTime);
            } else {
                // Nếu đang Pause mà bị Buffering -> Có thể là do bấm Play -> Gửi Play
                // Nhưng cũng có thể do tua khi đang pause -> Gửi Pause
                // Để an toàn và tránh lỗi "Bấm Play thành Pause", ta tạm thời BỎ QUA việc gửi lệnh ở bước Buffering này
                // Và để sự kiện PLAYING (số 1) sau đó quyết định.
            }
        }
    };
    // BẢO VỆ CHỐNG CRASH: Nếu không có videoId, không render YouTube Player
    if (!videoId) {
        return (
            <div className="relative w-full pt-[56.25%] bg-gray-900 rounded-lg overflow-hidden shadow-xl flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                    <p>Vui lòng nhập link video...</p>
                </div>
            </div>
        );
    }

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
                />
            </div>
        </div>
    );
};

export default VideoPlayer;