import { useState, useRef } from 'react';
import { useWebSocket } from './hooks/useWebsocket';
import VideoPlayer from './components/VideoPlayer';
import ChatBox from './components/ChatBox';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Login State
  const [step, setStep] = useState(1); // 1: Login, 2: Room
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  // Room State
  const [messages, setMessages] = useState([]);
  const [videoState, setVideoState] = useState({
    videoId: 'M7lc1UVf-VE', // Default YT video
    isPlaying: false,
    timestamp: 0
  });
  const [inputVideoId, setInputVideoId] = useState('');
  const playerInstanceRef = useRef(null);
  // 1. State mới: Xác định đã bấm Sync chưa và có phải Host không
  const [isSynced, setIsSynced] = useState(false); // Mặc định là CHƯA Sync
  const [isHost, setIsHost] = useState(false);
  // WebSocket Callbacks
  const handleVideoAction = (data) => {
    if (data.type === 'ASK_SYNC') {
      // neu la host thi gui lai trang thai hien tai
      if (isHost) {
        console.log('I am host, sending current state for sync');
        const currentTime = playerInstanceRef.current ? playerInstanceRef.current.getCurrentTime() : 0;
        // Gửi lệnh SYNC chứa thời gian thực của Host
        // Lưu ý: Gửi kèm trạng thái playing hiện tại của Host
        const currentStatus = playerInstanceRef.current ? (playerInstanceRef.current.getPlayerState() === 1 ? 'PLAY' : 'PAUSE') : 'PAUSE';
        sendVideoAction(currentStatus, videoState.videoId, currentTime);
      }
      return; // Không cần update state gì cả
    }
    console.log('Received Action:', data);
    setVideoState(prev => ({
      ...prev,
      // Nếu nhận lệnh SYNC/PLAY thì cập nhật playing, ngược lại giữ nguyên
      isPlaying: data.type === 'PLAY',

      timestamp: data.timestamp,
      // Nếu có videoId mới thì cập nhật, không thì giữ cũ
      videoId: data.videoId || prev.videoId
    }));
  };
  // Xử lý tin nhắn Chat & Thông tin phòng
  const handleChatMessage = (msg) => {
    // Nếu là tin nhắn thông tin phòng (khi mới join)
    if (msg.hostName) {
      // Kiểm tra xem mình có phải host không
      if (msg.hostName === username) {
        setIsHost(true);
        setIsSynced(true); // Host thì luôn luôn Sync
        toast.info("Bạn là chủ phòng!");
      } else {
        setIsHost(false);
        setIsSynced(false); // Khách mới vào -> Chưa Sync
      }
      // Cập nhật video đang phát trong phòng luôn (nhưng chưa chạy)
      setVideoState(prev => ({
        ...prev,
        videoId: msg.currentVideoId,
        timestamp: msg.currentTime,
        isPlaying: false // Mới vào bắt buộc dừng
      }));
    } else {
      setMessages(prev => [...prev, msg]);
    }
  };

  // Hook khởi tạo kết nối
  const { isConnected, sendVideoAction, sendChatMessage } = useWebSocket(
    step === 2 ? roomId : null,
    username,
    handleVideoAction,
    handleChatMessage
  );

  // Handlers
  const handleJoin = (e) => {
    e.preventDefault();
    if (username && roomId) setStep(2);
  };
  const onPlayerStateChange = (type, currentTime) => {
    // Chỉ cho phép gửi lệnh nếu đã Sync hoặc là Host
    if (isSynced || isHost) {
      sendVideoAction(type, videoState.videoId, currentTime);
    }
  };

  const getYouTubeID = (url) => {
    // Regex để bắt ID từ các dạng link:
    // - youtube.com/watch?v=ID
    // - youtu.be/ID
    // - youtube.com/embed/ID
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleChangeVideo = () => {
    if (!inputVideoId.trim()) {
      toast.warning("Vui lòng nhập link YouTube!");
      return;
    }
    // Thử tách ID từ link
    const extractedId = getYouTubeID(inputVideoId);
    if (extractedId) {
      // Nếu link đúng -> Gửi lệnh
      sendVideoAction('CHANGE_VIDEO', extractedId, 0);
      setInputVideoId('');
      toast.success("Đã đổi video thành công!");
    } else {
      // Nếu link sai -> Báo lỗi, KHÔNG GỬI, KHÔNG CRASH
      toast.error("Link YouTube không hợp lệ! Vui lòng kiểm tra lại.");
      console.error("Invalid URL:", inputVideoId);
    }
  };
  const handleSync = () => {
    if (!isConnected) {
      toast.error("Chưa kết nối tới server, không thể Sync!");
      return;
    }
    // Đánh dấu là đã Sync để bắt đầu nhận/gửi dữ liệu
    setIsSynced(true);
    if (isHost) {
      // Nếu là Host: Gửi thời gian của mình cho mọi người (PUSH)
      const currentTime = playerInstanceRef.current ? playerInstanceRef.current.getCurrentTime() : 0;
      // Gửi lệnh PLAY để ép mọi người chạy theo mình
      sendVideoAction('PLAY', videoState.videoId, currentTime);

      console.log("Syncing at time:", currentTime); // Debug xem đúng chưa
      toast.success("Đã đồng bộ cho tất cả mọi người!");
    } else {
      // Nếu là Khách: Gửi yêu cầu lấy dữ liệu (PULL)
      sendVideoAction('ASK_SYNC', videoState.videoId, 0);
      toast.info("Đang lấy dữ liệu từ chủ phòng...");
    }
  };

  // --- RENDER LOGIN SCREEN ---
  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <form onSubmit={handleJoin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex justify-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Vynchronize</h1>
          </div>
          <div className="space-y-4">
            <input
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Name"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <input
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={e => setRoomId(e.target.value)}
              required
            />
            <button className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 font-semibold">
              Join Room
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- RENDER ROOM SCREEN ---
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 4. THÊM COMPONENT TOAST VÀO GIAO DIỆN */}
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <nav className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold flex items-center gap-2">
            <span>WatchTogether</span>
            <span className="text-xs bg-green-600 px-2 py-1 rounded-full">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <div>Room: {roomId} | User: {username}</div>
        </div>
      </nav>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* 4. TRUYỀN PROP QUAN TRỌNG: 
                        Nếu chưa Sync (isSynced=false), ép video dừng lại bằng cách truyền isPlaying={false}
                    */}
          <VideoPlayer
            videoId={videoState.videoId}
            isPlaying={isSynced ? videoState.isPlaying : false}
            timestamp={videoState.timestamp}
            onStateChange={onPlayerStateChange}
            onPlayerInstance={(player) => { playerInstanceRef.current = player; }}
          />

          {/* Controls */}
          <div className="bg-white p-4 rounded shadow flex flex-wrap gap-4 items-center">
            <div className="flex-1 flex gap-2">
              <input
                className="flex-1 border p-2 rounded"
                placeholder="Paste YouTube ID (e.g. M7lc1UVf-VE)"
                value={inputVideoId}
                onChange={(e) => setInputVideoId(e.target.value)}
              />
              <button
                onClick={handleChangeVideo}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Change Video
              </button>
            </div>
            <button
              onClick={handleSync}
              disabled={!isConnected}
              className={`px-6 py-2 rounded text-white font-bold transition-colors ${!isSynced
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' // Chưa sync thì nhấp nháy đỏ
                : 'bg-green-500 hover:bg-green-600'
                }`}
            >
              {!isSynced ? "BẤM ĐỂ SYNC" : "Resync"}
            </button>
          </div>
          {/* Thông báo cho người mới */}
          {!isSynced && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
              <p className="font-bold">Chào mừng {username}!</p>
              <p>Bạn đang ở chế độ chờ. Hãy bấm nút <b>SYNC</b> màu đỏ để bắt đầu xem cùng mọi người.</p>
            </div>
          )}
        </div>

        {/* Right Column: Chat & Queue */}
        <div className="space-y-4 h-[600px]">
          <ChatBox messages={messages} onSendMessage={sendChatMessage} />

          {/* Placeholder for Queue if needed */}
          <div className="bg-white rounded p-4 shadow">
            <h3 className="font-bold mb-2 text-gray-700">Coming Soon: Queue</h3>
            <p className="text-sm text-gray-500">Video queue functionality will be implemented here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;