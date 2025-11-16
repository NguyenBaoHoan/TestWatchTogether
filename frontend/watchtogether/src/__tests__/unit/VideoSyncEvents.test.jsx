/**
 * ============================================
 * TEST 2: VIDEO SYNC EVENTS (PLAY/PAUSE/SEEK/CHANGE)
 * ============================================
 * 
 * Mục đích:
 * - Test gửi video events (PLAY, PAUSE, SEEK, CHANGE) lên server
 * - Test nhận broadcast events từ server
 * - Test sync state giữa nhiều clients
 * 
 * Backend flow tương ứng:
 * 1. Client publish → /app/rooms/{roomId}/video
 * 2. VideoSyncController.handleVideoEvent()
 *    - Validate participantId, roomId
 *    - Set metadata (participantId, timestamp)
 * 3. VideoSyncService.broadcastVideoEvent()
 *    - Update Redis room state
 *    - Broadcast → /topic/rooms/{roomId}/video
 * 4. All clients receive event and sync player
 * 
 * File: src/__tests__/unit/VideoSyncEvents.test.jsx
 * Folder: src/__tests__/unit/
 */

import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function VideoSyncEventsTest() {
    const [roomId, setRoomId] = useState('test-room-123');
    const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');
    const [logs, setLogs] = useState([]);
    const [receivedEvents, setReceivedEvents] = useState([]);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const clientRef = useRef(null);

    const addLog = (type, message) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, { type, message, timestamp }]);
        console.log(`[${type.toUpperCase()}] ${message}`);
    };

    // Connect to WebSocket
    const connect = () => {
        addLog('info', '🔌 Connecting to WebSocket...');
        setConnectionStatus('CONNECTING');

        const client = new Client({
            webSocketFactory: () => new SockJS('/ws'),
            debug: (str) => console.log('STOMP:', str),
            reconnectDelay: 5000,
        });

        client.onConnect = () => {
            addLog('success', '✅ Connected!');
            setConnectionStatus('CONNECTED');

            // ⭐ Subscribe tới video events của phòng
            client.subscribe(`/topic/rooms/${roomId}/video`, (message) => {
                const event = JSON.parse(message.body);
                addLog('info', `📥 Received event: ${event.type} at time ${event.currentTime}`);

                // Add to received events list
                setReceivedEvents(prev => [...prev, {
                    ...event,
                    receivedAt: new Date().toISOString()
                }]);

                // ⭐ SYNC: Update local player state based on event
                handleReceivedEvent(event);
            });

            addLog('info', `📡 Subscribed to /topic/rooms/${roomId}/video`);
        };

        client.onStompError = (frame) => {
            addLog('error', `❌ STOMP error: ${frame.headers['message']}`);
            setConnectionStatus('ERROR');
        };

        client.activate();
        clientRef.current = client;
    };

    // Handle received event (simulate player sync)
    const handleReceivedEvent = (event) => {
        switch (event.type) {
            case 'PLAY':
                setIsPlaying(true);
                if (event.currentTime !== null) {
                    setCurrentTime(event.currentTime);
                }
                addLog('success', `▶️ Playing at ${event.currentTime}s`);
                break;

            case 'PAUSE':
                setIsPlaying(false);
                if (event.currentTime !== null) {
                    setCurrentTime(event.currentTime);
                }
                addLog('success', `⏸️ Paused at ${event.currentTime}s`);
                break;

            case 'SEEK':
                if (event.currentTime !== null) {
                    setCurrentTime(event.currentTime);
                }
                addLog('success', `⏩ Seeked to ${event.currentTime}s`);
                break;

            case 'CHANGE':
                setCurrentTime(0);
                setIsPlaying(false);
                addLog('success', `🔄 Video changed to ${event.videoUrl}`);
                break;

            default:
                addLog('warn', `Unknown event type: ${event.type}`);
        }
    };

    // Send PLAY event
    const sendPlayEvent = () => {
        if (!clientRef.current || connectionStatus !== 'CONNECTED') {
            addLog('error', '❌ Not connected!');
            return;
        }

        const event = {
            type: 'PLAY',
            currentTime: currentTime,
            videoUrl: 'https://example.com/video.mp4',
            timestamp: Date.now()
        };

        addLog('info', `📤 Sending PLAY event...`);
        clientRef.current.publish({
            destination: `/app/rooms/${roomId}/video`,
            body: JSON.stringify(event)
        });
    };

    // Send PAUSE event
    const sendPauseEvent = () => {
        if (!clientRef.current || connectionStatus !== 'CONNECTED') {
            addLog('error', '❌ Not connected!');
            return;
        }

        const event = {
            type: 'PAUSE',
            currentTime: currentTime,
            timestamp: Date.now()
        };

        addLog('info', `📤 Sending PAUSE event...`);
        clientRef.current.publish({
            destination: `/app/rooms/${roomId}/video`,
            body: JSON.stringify(event)
        });
    };

    // Send SEEK event
    const sendSeekEvent = (time) => {
        if (!clientRef.current || connectionStatus !== 'CONNECTED') {
            addLog('error', '❌ Not connected!');
            return;
        }

        const event = {
            type: 'SEEK',
            currentTime: time,
            timestamp: Date.now()
        };

        addLog('info', `📤 Sending SEEK event to ${time}s...`);
        clientRef.current.publish({
            destination: `/app/rooms/${roomId}/video`,
            body: JSON.stringify(event)
        });
        setCurrentTime(time);
    };

    // Send CHANGE event
    const sendChangeEvent = () => {
        if (!clientRef.current || connectionStatus !== 'CONNECTED') {
            addLog('error', '❌ Not connected!');
            return;
        }

        const newUrl = prompt('Enter new video URL:', 'https://example.com/new-video.mp4');
        if (!newUrl) return;

        const event = {
            type: 'CHANGE',
            videoUrl: newUrl,
            currentTime: 0,
            timestamp: Date.now()
        };

        addLog('info', `📤 Sending CHANGE event...`);
        clientRef.current.publish({
            destination: `/app/rooms/${roomId}/video`,
            body: JSON.stringify(event)
        });
    };

    // Disconnect
    const disconnect = () => {
        if (clientRef.current) {
            clientRef.current.deactivate();
            setConnectionStatus('DISCONNECTED');
            addLog('info', '🔌 Disconnected');
        }
    };

    useEffect(() => {
        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, []);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">
                    🧪 Test 2: Video Sync Events
                </h2>

                {/* Room ID Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Room ID:</label>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        disabled={connectionStatus === 'CONNECTED'}
                        className="w-full px-3 py-2 border rounded-lg"
                        placeholder="Enter room ID"
                    />
                </div>

                {/* Status */}
                <div className="mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${connectionStatus === 'CONNECTED' ? 'bg-green-100 text-green-800' :
                            connectionStatus === 'CONNECTING' ? 'bg-yellow-100 text-yellow-800' :
                                connectionStatus === 'ERROR' ? 'bg-red-100 text-red-800' :
                                    'bg-gray-100 text-gray-800'
                        }`}>
                        {connectionStatus}
                    </span>
                </div>

                {/* Connection Buttons */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={connect}
                        disabled={connectionStatus === 'CONNECTED'}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        Connect
                    </button>
                    <button
                        onClick={disconnect}
                        disabled={connectionStatus !== 'CONNECTED'}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                        Disconnect
                    </button>
                </div>

                {/* Video Controls */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Player State Display */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">📺 Simulated Player State</h3>
                        <div className="space-y-2">
                            <div>
                                <span className="font-medium">Status:</span>{' '}
                                <span className={isPlaying ? 'text-green-600' : 'text-red-600'}>
                                    {isPlaying ? '▶️ PLAYING' : '⏸️ PAUSED'}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium">Current Time:</span>{' '}
                                <span className="font-mono">{currentTime.toFixed(2)}s</span>
                            </div>
                            <div className="mt-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentTime}
                                    onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Event Buttons */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-3">🎮 Send Events</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={sendPlayEvent}
                                disabled={connectionStatus !== 'CONNECTED'}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                            >
                                ▶️ PLAY
                            </button>
                            <button
                                onClick={sendPauseEvent}
                                disabled={connectionStatus !== 'CONNECTED'}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                            >
                                ⏸️ PAUSE
                            </button>
                            <button
                                onClick={() => sendSeekEvent(30)}
                                disabled={connectionStatus !== 'CONNECTED'}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                ⏩ SEEK 30s
                            </button>
                            <button
                                onClick={sendChangeEvent}
                                disabled={connectionStatus !== 'CONNECTED'}
                                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
                            >
                                🔄 CHANGE
                            </button>
                        </div>
                    </div>
                </div>

                {/* Expected Results */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">📋 Expected Results:</h3>
                    <ul className="list-disc ml-5 space-y-1 text-sm">
                        <li>✅ Click PLAY → Send event → Receive broadcast → Player state updates</li>
                        <li>✅ Open 2 tabs → Send event từ tab 1 → Tab 2 nhận được và sync</li>
                        <li>✅ Backend log: "Processing video event: type=PLAY, roomId=..."</li>
                        <li>✅ Redis: room state được update (playbackState, lastPosition)</li>
                    </ul>
                </div>

                {/* Logs */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold mb-2">📜 Logs</h3>
                        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 h-64 overflow-y-auto font-mono text-xs">
                            {logs.map((log, index) => (
                                <div
                                    key={index}
                                    className={`mb-1 ${log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-green-400' :
                                                log.type === 'warn' ? 'text-yellow-400' :
                                                    'text-blue-400'
                                        }`}
                                >
                                    <span className="text-gray-500">[{log.timestamp}]</span> {log.message}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">📥 Received Events</h3>
                        <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto text-xs">
                            {receivedEvents.map((event, index) => (
                                <div key={index} className="mb-2 p-2 bg-white rounded border">
                                    <div className="font-semibold">{event.type}</div>
                                    <div className="text-gray-600">Time: {event.currentTime}s</div>
                                    <div className="text-gray-400 text-xs">{event.receivedAt}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Backend Mapping */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
                    <h3 className="font-semibold mb-2">🔗 Backend Flow:</h3>
                    <ol className="list-decimal ml-5 space-y-1">
                        <li><code>VideoSyncController.handleVideoEvent()</code> → Nhận event từ client</li>
                        <li><code>VideoSyncService.broadcastVideoEvent()</code> → Broadcast tới room</li>
                        <li><code>VideoSyncService.updateRoomVideoState()</code> → Update Redis</li>
                        <li><code>messagingTemplate.convertAndSend()</code> → Send tới /topic/rooms/{'{'}roomId{'}'}/video</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
