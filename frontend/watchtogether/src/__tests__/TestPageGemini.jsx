import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// --- Cấu hình ---
const SOCKJS_URL = 'http://localhost:8080/ws'; // Thay đổi nếu cần
const ROOM_ID = 'd42708fd-1b53-47a4-870f-071a5bf9044f'; // Hardcode một ID phòng
const DEFAULT_VIDEO_URL = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
// -----------------

function TestPageGemini() {
  const [stompClient, setStompClient] = useState(null);
  const [logs, setLogs] = useState([]);
  const [videoUrl, setVideoUrl] = useState(DEFAULT_VIDEO_URL);
  const [newVideoUrl, setNewVideoUrl] = useState('');
  
  const videoRef = useRef(null);
  // Cờ này để phân biệt sự kiện do người dùng (local) hay do server (remote)
  const isLocalChange = useRef(true);

  // Hàm helper để ghi log
  const log = (message) => {
    console.log(message);
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  // 1. Khởi tạo và kết nối WebSocket
  useEffect(() => {
    log('Đang cố gắng kết nối WebSocket...');

    const client = new Client({
      webSocketFactory: () => new SockJS(SOCKJS_URL),
      reconnectDelay: 5000,
      onConnect: () => {
        log(`✅ Đã kết nối STOMP. Đang subscribe phòng: ${ROOM_ID}`);
        setStompClient(client);

        // A. Nhận event chung của phòng
        client.subscribe(`/topic/rooms/${ROOM_ID}/video`, (payload) => {
          const event = JSON.parse(payload.body);
          log(`⬇️ NHẬN Event: ${event.type} (từ P:${event.participantId?.substring(0, 5)}...)`);
          handleRemoteEvent(event);
        });

        // B. Nhận state SYNC cá nhân (khi mới vào)
        client.subscribe('/user/queue/video/sync', (payload) => {
          const event = JSON.parse(payload.body);
          log(`🔄 NHẬN SYNC_STATE: Time: ${event.currentTime}, State: ${event.playbackState}`);
          handleSyncState(event);
        });

        // C. Nhận lỗi cá nhân
        client.subscribe('/user/queue/errors', (payload) => {
          const error = JSON.parse(payload.body);
          log(`❌ LỖI Server: ${error.message}`);
        });
      },
      onDisconnect: () => {
        log('🛑 Đã ngắt kết nối STOMP.');
        setStompClient(null);
      },
      onStompError: (frame) => {
        log(`❌ Lỗi STOMP: ${frame.headers['message']}`);
      },
    });

    client.activate();

    return () => {
      if (client.active) client.deactivate();
    };
  }, []); // Chỉ chạy 1 lần

  // 2. Gửi sự kiện lên server
  const sendVideoEvent = (type, extraData = {}) => {
    if (!stompClient || !stompClient.active) {
      log('Lỗi: STOMP client chưa kết nối.');
      return;
    }

    const payload = {
      type: type, // PLAY, PAUSE, SEEK, CHANGE
      currentTime: videoRef.current ? videoRef.current.currentTime : 0.0,
      videoUrl: type === 'CHANGE' ? extraData.videoUrl : null,
    };

    log(`⬆️ GỬI Event: ${payload.type} @ ${payload.currentTime.toFixed(2)}s`);
    stompClient.publish({
      destination: `/app/rooms/${ROOM_ID}/video`,
      body: JSON.stringify(payload),
    });
  };

  // 3. Xử lý khi *NHẬN* sự kiện từ server (người khác gửi)
  const handleRemoteEvent = (event) => {
    const video = videoRef.current;
    if (!video) return;

    // Đặt cờ false để ngăn trình duyệt kích hoạt event handler (onPlay, onPause)
    isLocalChange.current = false;

    try {
      switch (event.type) {
        case 'PLAY':
          video.currentTime = event.currentTime;
          video.play();
          break;
        case 'PAUSE':
          video.currentTime = event.currentTime;
          video.pause();
          break;
        case 'SEEK':
          video.currentTime = event.currentTime;
          break;
        case 'CHANGE':
          log(`Đang đổi video sang: ${event.videoUrl}`);
          setVideoUrl(event.videoUrl);
          video.load();
          video.currentTime = 0.0;
          video.pause();
          break;
      }
    } catch (e) { log(`Lỗi khi xử lý remote event: ${e.message}`); }

    // Đặt lại cờ
    setTimeout(() => { isLocalChange.current = true; }, 150);
  };

  // 4. Xử lý khi *NHẬN* SYNC_STATE (khi mới vào phòng)
  const handleSyncState = (event) => {
    const video = videoRef.current;
    if (!video) return;
    
    isLocalChange.current = false;
    setVideoUrl(event.videoUrl);
    video.load();
    
    // Phải chờ video load xong metadata mới seek được
    const onLoadedMetadata = () => {
      video.currentTime = event.currentTime;
      if (event.playbackState === 'PLAYING') {
        video.play().catch(e => log('Lỗi auto-play: ' + e.message));
      } else {
        video.pause();
      }
      setTimeout(() => { isLocalChange.current = true; }, 150);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
    
    video.addEventListener('loadedmetadata', onLoadedMetadata);
  };

  // 5. Các event handler *LOCAL* (khi người dùng tự tương tác)
  const handleLocalPlay = () => {
    if (isLocalChange.current) sendVideoEvent('PLAY');
  };

  const handleLocalPause = () => {
    if (isLocalChange.current && !videoRef.current.ended) sendVideoEvent('PAUSE');
  };

  const handleLocalSeeked = () => {
    if (isLocalChange.current) sendVideoEvent('SEEK');
  };
  
  const handleLocalChangeVideo = () => {
    if (newVideoUrl && newVideoUrl !== videoUrl) {
      sendVideoEvent('CHANGE', { videoUrl: newVideoUrl });
      setNewVideoUrl('');
    }
  };

  return (
    <div className="font-sans p-4 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold border-b-2 border-gray-200 pb-3 mb-4">
        Video Sync Tester 📹
      </h1>
      <h3 className={`text-xl mb-4 ${stompClient ? 'text-green-600' : 'text-red-600'}`}>
        Room: <span className="font-mono">{ROOM_ID}</span> | 
        Trạng thái: {stompClient ? 'ĐÃ KẾT NỐI' : 'ĐANG KẾT NỐI...'}
      </h3>

      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full rounded-lg shadow-md bg-black"
        onPlay={handleLocalPlay}
        onPause={handleLocalPause}
        onSeeked={handleLocalSeeked}
      />

      <div className="my-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Dán URL video mới vào đây..."
          value={newVideoUrl}
          onChange={(e) => setNewVideoUrl(e.target.value)}
          className="flex-1 p-3 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleLocalChangeVideo}
          className="py-3 px-5 bg-blue-600 text-white rounded-md text-sm font-semibold cursor-pointer hover:bg-blue-700 transition-colors shadow-sm"
        >
          Đổi Video (Test 'CHANGE')
        </button>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-3">Logs:</h3>
        <div className="h-72 overflow-y-auto border border-gray-300 bg-gray-50 p-4 font-mono text-xs leading-relaxed rounded-md shadow-inner">
          {logs.map((msg, index) => (
            <div key={index} className="border-b border-gray-200 pb-1 mb-1">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TestPageGemini;