/**
 * ============================================
 * TEST: REACT-PLAYER WITH WEBSOCKET SYNC
 * ============================================
 * 
 * Test ReactPlayer đồng bộ qua WebSocket
 * 
 * Features:
 * - Supports YouTube, Vimeo, file URLs
 * - Real-time sync across multiple clients
 * - Custom controls
 * 
 * Example URLs to test:
 * - YouTube: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * - Vimeo: https://vimeo.com/90509568
 * - Direct file: https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
 */

import { useState } from 'react';

export default function ReactPlayerTest() {
    const [testResults, setTestResults] = useState([]);

    const testUrls = [
        {
            name: 'YouTube Video',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            type: 'YouTube',
        },
        {
            name: 'Vimeo Video',
            url: 'https://vimeo.com/90509568',
            type: 'Vimeo',
        },
        {
            name: 'MP4 Direct',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: 'Direct File',
        },
        {
            name: 'MP4 Elephants Dream',
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            type: 'Direct File',
        },
    ];

    const addResult = (message, status) => {
        setTestResults(prev => [...prev, {
            message,
            status,
            timestamp: new Date().toLocaleTimeString()
        }]);
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        addResult(`Copied: ${url}`, 'success');
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                    🎬 ReactPlayer WebSocket Sync Test
                </h2>

                {/* Test URLs */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-3">📋 Test URLs:</h3>
                    <div className="space-y-2">
                        {testUrls.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                            >
                                <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-gray-600 font-mono truncate">
                                        {item.url}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Type: {item.type}
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(item.url)}
                                    className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                >
                                    Copy URL
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Test Instructions */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold mb-2">🧪 Test Instructions:</h3>
                    <ol className="list-decimal ml-5 space-y-2 text-sm">
                        <li>
                            <strong>Bước 1:</strong> Tạo hoặc join room từ trang chủ
                        </li>
                        <li>
                            <strong>Bước 2:</strong> Copy một trong các URL test ở trên
                        </li>
                        <li>
                            <strong>Bước 3:</strong> Paste vào ô "Enter video URL" trong VideoPlayer
                        </li>
                        <li>
                            <strong>Bước 4:</strong> Nhấn "Load Video"
                        </li>
                        <li>
                            <strong>Bước 5:</strong> Mở tab thứ 2 với cùng room
                        </li>
                        <li>
                            <strong>Bước 6:</strong> Tab 1: Nhấn Play/Pause/Seek
                        </li>
                        <li>
                            <strong>Bước 7:</strong> Tab 2: Verify video sync đúng
                        </li>
                    </ol>
                </div>

                {/* Expected Behaviors */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-semibold mb-2">✅ Expected Behaviors:</h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                        <li>YouTube/Vimeo videos load và play đúng</li>
                        <li>MP4 files load và play đúng</li>
                        <li>PLAY event → Tất cả tabs play cùng lúc</li>
                        <li>PAUSE event → Tất cả tabs pause cùng lúc</li>
                        <li>SEEK event → Tất cả tabs jump đến cùng thời điểm</li>
                        <li>CHANGE event → Tất cả tabs load video mới</li>
                        <li>Volume control chỉ ảnh hưởng local (không sync)</li>
                    </ul>
                </div>

                {/* Known Issues */}
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h3 className="font-semibold mb-2">⚠️ Known Issues:</h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                        <li>YouTube có thể bị giới hạn play nếu chưa tương tác với page</li>
                        <li>Một số video YouTube có thể bị restrict embed</li>
                        <li>CORS error với một số file URLs</li>
                        <li>Sync có độ trễ ~100-200ms (do network latency)</li>
                    </ul>
                </div>

                {/* ReactPlayer Features */}
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h3 className="font-semibold mb-2">🎯 ReactPlayer Features:</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <h4 className="font-medium mb-1">Supported Platforms:</h4>
                            <ul className="list-disc ml-5 space-y-1">
                                <li>YouTube</li>
                                <li>Facebook</li>
                                <li>Twitch</li>
                                <li>SoundCloud</li>
                                <li>Streamable</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-medium mb-1">Supported Formats:</h4>
                            <ul className="list-disc ml-5 space-y-1">
                                <li>Vimeo</li>
                                <li>Wistia</li>
                                <li>Mixcloud</li>
                                <li>DailyMotion</li>
                                <li>Files (mp4, webm, ogv, mp3, etc.)</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Test Results Log */}
                <div>
                    <h3 className="font-semibold mb-2">📊 Test Results:</h3>
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs">
                        {testResults.length === 0 ? (
                            <div className="text-gray-500">No results yet. Start testing...</div>
                        ) : (
                            testResults.map((result, index) => (
                                <div
                                    key={index}
                                    className={`mb-1 ${result.status === 'error' ? 'text-red-400' :
                                            result.status === 'success' ? 'text-green-400' :
                                                'text-blue-400'
                                        }`}
                                >
                                    <span className="text-gray-500">[{result.timestamp}]</span> {result.message}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Backend Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
                    <h3 className="font-semibold mb-2">🔗 Backend Integration:</h3>
                    <p className="mb-2">
                        ReactPlayer tương thích 100% với backend hiện tại vì:
                    </p>
                    <ul className="list-disc ml-5 space-y-1">
                        <li>Sử dụng cùng VideoContext và WebSocket sync logic</li>
                        <li>Events (PLAY/PAUSE/SEEK/CHANGE) giữ nguyên format</li>
                        <li>Backend không cần thay đổi gì</li>
                        <li>Chỉ thay đổi UI component layer</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
