import React, { useState, useRef, useEffect, useCallback } from 'react';
import { VideoContext } from './VideoContext';
import { useRoom } from '../hooks/useRoom';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';


// ⭐ THÊM DÒNG NÀY ĐỂ FIX LỖI "global is not defined" KHI DÙNG STOMP.JS TRÊN TRÌNH DUYỆT
if (typeof global === 'undefined') {
  window.global = window;
}

export default function VideoProvider({ children }) {
  const { roomData } = useRoom();

  // ============================================
  // 📹 VIDEO STATE
  // ============================================
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // ============================================
  // 🔒 SYNC FLAGS (Quan trọng!)
  // ============================================
  const [isSyncing, setIsSyncing] = useState(false);
  const isSyncingRef = useRef(false); // Ref để check nhanh, không gây re-render

  // ============================================
  // 📎 REFS
  // ============================================
  const stompClientRef = useRef(null);
  const playerRef = useRef(null); // Ref này sẽ được VideoPlayer gán DOM element vào

  // ============================================
  // 📡 WEBSOCKET: Send events tới server
  // ============================================
  const sendVideoEvent = useCallback((type, extraData = {}) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📤 [SEND EVENT] Starting....');
    console.log(`   Type: ${type}`);
    console.log(`   Extra Data:`, extraData);
    console.log(`   isSyncing: ${isSyncingRef.current}`);

    if (!stompClientRef.current || !roomData?.roomId) {
      console.warn('❌ [SEND EVENT] Cannot send - WebSocket not connected');
      return;
    }

    const event = {
      type,
      videoUrl,
      timestamp: Date.now(),
      ...extraData,
    };

    console.log('📤 [SEND EVENT] Sending to server:', JSON.stringify(event, null, 2));
    console.log(`   Destination: /app/rooms/${roomData.roomId}/video`);

    stompClientRef.current.publish({
      destination: `/app/rooms/${roomData.roomId}/video`,
      body: JSON.stringify(event),
    });

    console.log('✅ [SEND EVENT] Sent successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, [roomData?.roomId, videoUrl]);

  // ============================================
  // 🎬 VIDEO ACTIONS
  // ============================================
  const playVideo = useCallback(() => {
    console.log('\n🎬━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('▶️ [PLAY VIDEO] Called');
    console.log(`   Current State - currentTime: ${currentTime.toFixed(2)}s`);
    console.log(`   Current State - isPlaying: ${isPlaying}`);
    console.log(`   isSyncing: ${isSyncingRef.current}`);

    // Ưu tiên STATE currentTime thay vì đọc DOM
    let timeToSend = currentTime;

    if (playerRef.current) {
      const domTime = playerRef.current.currentTime;
      const diff = Math.abs(domTime - currentTime);

      console.log(`   DOM Time: ${domTime.toFixed(2)}s`);
      console.log(`   STATE Time: ${currentTime.toFixed(2)}s`);
      console.log(`   Difference: ${diff.toFixed(2)}s`);

      if (diff < 2) {
        timeToSend = domTime;
        console.log(`   ✅ Using DOM time (diff < 2s)`);
      } else {
        console.log(`   ⚠️ Using STATE time (diff >= 2s, likely just SEEKED)`);
      }
    } else {
      console.warn(`   ⚠️ playerRef is NULL - using STATE time`);
    }

    console.log(`   📍 Time to send: ${timeToSend.toFixed(2)}s`);

    setIsPlaying(true);
    console.log('   ✅ Updated isPlaying state to TRUE');

    if (!isSyncingRef.current) {
      console.log('   📤 Sending PLAY event to server...');
      sendVideoEvent('PLAY', { currentTime: timeToSend });
    } else {
      console.log('   ⏸️ Skipping send (currently syncing from server)');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━🎬\n');
  }, [currentTime, isPlaying, sendVideoEvent]); const pauseVideo = useCallback(() => {
    console.log('\n⏸️━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⏸️ [PAUSE VIDEO] Called');
    console.log(`   Current State - currentTime: ${currentTime.toFixed(2)}s`);
    console.log(`   Current State - isPlaying: ${isPlaying}`);
    console.log(`   isSyncing: ${isSyncingRef.current}`);

    // ⭐ FIX: Ưu tiên STATE currentTime thay vì đọc DOM
    // Vì DOM có thể chưa update kịp sau SEEK
    let timeToSend = currentTime;

    // Chỉ đọc DOM nếu không vừa mới SEEK (check độ chênh lệch)
    if (playerRef.current) {
      const domTime = playerRef.current.currentTime;
      const diff = Math.abs(domTime - currentTime);

      console.log(`   DOM Time: ${domTime.toFixed(2)}s`);
      console.log(`   STATE Time: ${currentTime.toFixed(2)}s`);
      console.log(`   Difference: ${diff.toFixed(2)}s`);

      // Nếu chênh lệch < 2s, tin tưởng DOM
      // Nếu chênh lệch >= 2s, tin tưởng STATE (vừa mới SEEK)
      if (diff < 2) {
        timeToSend = domTime;
        console.log(`   ✅ Using DOM time (diff < 2s)`);
      } else {
        console.log(`   ⚠️ Using STATE time (diff >= 2s, likely just SEEKED)`);
      }
    } else {
      console.warn(`   ⚠️ playerRef is NULL - using STATE time`);
    }

    console.log(`   📍 Time to send: ${timeToSend.toFixed(2)}s`);

    setIsPlaying(false);
    console.log('   ✅ Updated isPlaying state to FALSE');

    if (!isSyncingRef.current) {
      console.log('   📤 Sending PAUSE event to server...');
      sendVideoEvent('PAUSE', { currentTime: timeToSend });
    } else {
      console.log('   ⏸️ Skipping send (currently syncing from server)');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⏸️\n');
  }, [currentTime, isPlaying, sendVideoEvent]);

  const seekVideo = useCallback((time) => {
    console.log('\n⏩━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⏩ [SEEK VIDEO] Called');
    console.log(`   Target time: ${time.toFixed(2)}s`);
    console.log(`   Current duration: ${duration.toFixed(2)}s`);
    console.log(`   Current State - currentTime: ${currentTime.toFixed(2)}s`);
    console.log(`   isSyncing: ${isSyncingRef.current}`);

    // Vẫn clamp dựa trên duration state (có thể hơi cũ nhưng chấp nhận được để giới hạn)
    const clampedTime = Math.max(0, Math.min(time, duration || 0));
    console.log(`   📍 Clamped time: ${clampedTime.toFixed(2)}s`);

    // Cập nhật state ngay lập tức để UI phản hồi
    setCurrentTime(clampedTime);
    console.log('   ✅ Updated STATE currentTime');

    // Ra lệnh cho thẻ <video> tua ngay lập tức
    // ⭐ FIX: Thêm kiểm tra ref trước khi truy cập
    if (playerRef.current) {
      playerRef.current.currentTime = clampedTime;
      console.log('   ✅ Updated DOM currentTime');
    } else {
      console.warn("   ⚠️ playerRef is NULL - cannot seek DOM element yet");
    }


    if (!isSyncingRef.current) {
      // Gửi thời gian đã clamp
      console.log('   📤 Sending SEEK event to server...');
      sendVideoEvent('SEEK', { currentTime: clampedTime });
    } else {
      console.log('   ⏸️ Skipping send (currently syncing from server)');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⏩\n');
  }, [duration, currentTime, sendVideoEvent]); // ⭐ Phụ thuộc duration và sendVideoEvent

  const changeVideo = useCallback((url) => {
    console.log('🔄 Change video triggered by context to:', url);
    setVideoUrl(url);
    setCurrentTime(0);
    setIsPlaying(false);
    setDuration(0);

    if (!isSyncingRef.current) {
      sendVideoEvent('CHANGE', { videoUrl: url, currentTime: 0 });
    }

    // Ra lệnh cho thẻ <video> load url mới
    // ⭐ FIX: Thêm kiểm tra ref trước khi truy cập
    if (playerRef.current) {
      playerRef.current.src = url;
      playerRef.current.load();
    } else {
      console.warn("ChangeVideo: playerRef is null, cannot load new URL in DOM element yet.");
    }
  }, [sendVideoEvent]); // ⭐ Chỉ phụ thuộc sendVideoEvent

  // ============================================
  // 📊 UTILITY FUNCTIONS
  // ============================================
  const updateCurrentTime = useCallback((time) => {
    // ✅ FIX: Chỉ update nếu không đang sync VÀ difference đủ lớn để tránh racing condition
    if (!isSyncingRef.current) {
      const diff = Math.abs(time - currentTime);
      if (diff > 0.3) { // Chỉ update nếu chênh lệch > 0.3s để tránh jitter
        setCurrentTime(time);
      }
    }
  }, [currentTime]); // Thêm currentTime dependency

  const updateDuration = useCallback((newDuration) => {
    console.log('📊 Duration updated by player:', newDuration);
    setDuration(newDuration);
  }, []);

  // Request sync from server
  const requestSync = useCallback(() => {
    if (!stompClientRef.current || !roomData?.roomId) return;
    console.log('🔄 Requesting sync from server...');
    stompClientRef.current.publish({
      destination: `/app/rooms/${roomData.roomId}/video/sync`,
      body: JSON.stringify({ type: 'REQUEST_SYNC', timestamp: Date.now() }),
    });
  }, [roomData?.roomId]);

  // ============================================
  // 📡 WEBSOCKET: Nhận events từ server (ĐÃ SỬA LỖI REF NULL)
  // ============================================
  useEffect(() => {
    if (!roomData?.roomId) return;

    console.log('🔌 Connecting to WebSocket...');
    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      console.log('✅ WebSocket connected');
      
      // ✅ FIX: Subscribe để nhận video events từ server
      client.subscribe(`/topic/rooms/${roomData.roomId}/video`, (message) => {
        console.log('📺 Received video event:', message.body);
        handleVideoEventWithRetry(message);
      });
      
      // ✅ FIX: Subscribe để nhận initial sync
      client.subscribe('/queue/video/sync', (message) => {
        console.log('🔄 Received sync event:', message.body);
        handleVideoEventWithRetry(message);
      });
      
      // Retry handler để đảm bảo playerRef luôn có DOM element
      function handleVideoEventWithRetry(message, retryCount = 0) {
        const event = JSON.parse(message.body);

        console.log('\n📥━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📥 [RECEIVED EVENT] From WebSocket');
        console.log(`   Event Type: ${event.type}`);
        console.log(`   Event Data:`, event);
        console.log(`   Current isSyncing: ${isSyncingRef.current}`);

        setIsSyncing(true);
        isSyncingRef.current = true;
        console.log('   ✅ Set isSyncing = TRUE');

        // Lấy tham chiếu đến thẻ video DOM
        const videoElement = playerRef.current; // Lấy DOM element
        console.log(`   Video Element: ${videoElement ? 'EXISTS' : 'NULL'}`);

        // Nếu playerRef chưa có DOM element, thử lại sau 100ms (tối đa 3 lần)
        if (!videoElement && retryCount < 3) {
          console.warn(`   ⚠️ playerRef is NULL, retrying handleVideoEvent in 100ms (retry ${retryCount + 1}/3)`);
          setTimeout(() => handleVideoEventWithRetry(message, retryCount + 1), 100);
          return;
        }

        // --- Xử lý Time trước ---
        // Luôn cập nhật state currentTime để UI hiển thị đúng giá trị server gửi
        if (typeof event.currentTime === 'number') {
          console.log(`\n   ⏱️ Processing Time Update:`);
          console.log(`   Server Time: ${event.currentTime.toFixed(2)}s`);
          setCurrentTime(event.currentTime); // Cập nhật state trước
          console.log('   ✅ Updated STATE currentTime');

          // ⭐ FIX: Thêm kiểm tra videoElement trước khi truy cập
          // Chỉ ra lệnh seek DOM nếu chênh lệch lớn hoặc là sự kiện SEEK/CHANGE/SYNC_STATE
          if (videoElement) {
            const localTime = videoElement.currentTime;
            const timeDiff = Math.abs(localTime - event.currentTime);

            console.log(`   Local DOM Time: ${localTime.toFixed(2)}s`);
            console.log(`   Time Diff: ${timeDiff.toFixed(2)}s`);

            if (event.type === 'SEEK' || event.type === 'CHANGE' || event.type === 'SYNC_STATE' || timeDiff > 1.5) {
              console.log(`   🎯 SEEKING DOM to ${event.currentTime.toFixed(2)}s (Type: ${event.type}, Diff > 1.5s)`);
              videoElement.currentTime = event.currentTime; // Gán giá trị
              console.log('   ✅ DOM currentTime updated');
            } else {
              console.log(`   ⏭️ Skip DOM seek (timeDiff ${timeDiff.toFixed(2)}s < 1.5s)`);
            }
          } else {
            console.warn("   ⚠️ playerRef is NULL, cannot seek DOM element after 3 retries");
          }
        }
        // ...existing code...
        // --- Xử lý Play/Pause/Change ---
        console.log(`\n   🎬 Processing Event Type: ${event.type}`);
        switch (event.type) {
          case 'PLAY':
            console.log('   ▶️ PLAY event: Setting isPlaying = TRUE');
            setIsPlaying(true); // State isPlaying sẽ trigger useEffect trong VideoPlayer để play DOM
            console.log('   ✅ State updated');
            break;
          case 'PAUSE':
            console.log('   ⏸️ PAUSE event: Setting isPlaying = FALSE');
            setIsPlaying(false); // State isPlaying sẽ trigger useEffect trong VideoPlayer để pause DOM
            console.log('   ✅ State updated');
            break;
          case 'SEEK':
            console.log(`   ⏩ SEEK event: Time already processed above`);
            console.log(`   Current time is now ${event.currentTime.toFixed(2)}s`);
            break;
          case 'CHANGE':
            console.log('   � CHANGE event: Changing video URL');
            console.log(`   New URL: ${event.videoUrl}`);
            setVideoUrl(event.videoUrl);
            console.log('   ✅ State videoUrl updated');
            setIsPlaying(false);
            setDuration(0);
            console.log('   ✅ State isPlaying = FALSE, duration = 0');
            if (videoElement) {
              videoElement.src = event.videoUrl;
              videoElement.load();
              console.log('   ✅ DOM video.src and load() called');
            } else {
              console.warn("   ⚠️ playerRef is NULL, cannot load new URL in DOM element yet");
            }
            break;
          case 'SYNC_STATE': {
            console.log('   � SYNC_STATE event: Full room state sync');
            console.log(`   Server State:`, {
              videoUrl: event.videoUrl,
              currentTime: event.currentTime,
              isPlaying: event.isPlaying
            });
            const currentSrc = videoElement ? videoElement.currentSrc : null;
            console.log(`   Current videoUrl STATE: ${videoUrl}`);
            console.log(`   Current DOM src: ${currentSrc || 'NULL'}`);
            if (event.videoUrl !== videoUrl || (videoElement && event.videoUrl !== currentSrc)) {
              console.log('   🔄 Video URL changed, updating...');
              setVideoUrl(event.videoUrl);
              console.log('   ✅ State videoUrl updated');
              if (videoElement) {
                videoElement.src = event.videoUrl;
                videoElement.load();
                console.log('   ✅ DOM video.src and load() called');
              }
            } else {
              console.log('   ⏭️ Video URL unchanged, skip update');
            }
            if (typeof event.currentTime === 'number') {
              console.log(`   ⏱️ Syncing time to ${event.currentTime.toFixed(2)}s`);
              if (videoElement) {
                videoElement.currentTime = event.currentTime;
                console.log('   ✅ DOM currentTime updated');
              }
              setCurrentTime(event.currentTime);
              console.log('   ✅ STATE currentTime updated');
            }
            if (typeof event.isPlaying === 'boolean') {
              console.log(`   ${event.isPlaying ? '▶️' : '⏸️'} Setting isPlaying = ${event.isPlaying}`);
              setIsPlaying(event.isPlaying);
              console.log('   ✅ State isPlaying updated');
            }
            break;
          }
          default:
            console.warn('   ⚠️ Unknown event type:', event.type);
        }
        // Tắt cờ syncing sau một khoảng trễ nhỏ
        console.log('\n   ⏰ Scheduling isSyncing = FALSE in 150ms...');
        setTimeout(() => {
          setIsSyncing(false);
          isSyncingRef.current = false;
          console.log('   ✅ isSyncing = FALSE (sync complete)');
        }, 150);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━📥\n');
      }


  // Request initial sync sau khi kết nối thành công
  setTimeout(requestSync, 1000);
};

client.onStompError = (frame) => {
  console.error('❌ STOMP error:', frame);
};

client.activate();
stompClientRef.current = client;

// Cleanup khi component unmount
return () => {
  console.log('🔌 Disconnecting WebSocket...');
  client.deactivate();
};
  }, [roomData?.roomId, requestSync, videoUrl]); // Thêm videoUrl vào dependency để sendVideoEvent có URL đúng

// ============================================
// 🎁 CONTEXT VALUE
// ============================================
const value = {
  videoUrl,
  isPlaying,
  currentTime,
  duration,
  isSyncing,
  isSyncingRef,
  playVideo,
  pauseVideo,
  seekVideo,
  changeVideo,
  updateCurrentTime,
  updateDuration,
  requestSync,
  playerRef, // Xuất ref để VideoPlayer có thể gán DOM element vào
};

return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
}

