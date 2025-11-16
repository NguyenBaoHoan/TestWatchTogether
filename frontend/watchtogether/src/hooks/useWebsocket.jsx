import { useEffect, useState, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws';

export const useWebSocket = (roomId, username, onVideoAction, onChatMessage) => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!roomId || !username) return;

        const socket = new SockJS(SOCKET_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                setIsConnected(true);

                // 1. Gửi lệnh Join Room
                client.publish({
                    destination: `/app/room/${roomId}/join`,
                    body: username
                });

                // 2. Lắng nghe lệnh điều khiển Video (Play/Pause/Sync)
                client.subscribe(`/topic/room/${roomId}/video`, (message) => {
                    if (onVideoAction) {
                        onVideoAction(JSON.parse(message.body));
                    }
                });

                // 3. Lắng nghe Chat
                client.subscribe(`/topic/room/${roomId}/chat`, (message) => {
                    if (onChatMessage) {
                        onChatMessage(JSON.parse(message.body));
                    }
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            }
        });

        client.activate();
        setStompClient(client);

        return () => {
            client.deactivate();
        };
    }, [roomId, username]);
    // Hàm gửi lệnh Video (Play/Pause/Change)
    const sendVideoAction = (actionType, videoId, timestamp) => {
        // SỬA LẠI ĐOẠN NÀY: Kiểm tra kỹ stompClient và trạng thái connected
        if (stompClient && stompClient.connected) {
            const payload = {
                roomId,
                username,
                type: actionType,
                videoId: videoId,
                timestamp: timestamp || 0,
                playerType: 0
            };
            try {
                stompClient.publish({
                    destination: '/app/video/action',
                    body: JSON.stringify(payload)
                });
            } catch (error) {
                console.error("Lỗi khi gửi lệnh video:", error);
            }
        } else {
            console.warn("Chưa kết nối WebSocket, không thể gửi lệnh!");
            // Có thể thêm logic hiển thị thông báo lỗi cho người dùng ở đây
        }
    };

    //Hàm gửi tin nhắn Chat
    const sendChatMessage = (content) => {
        // SỬA LẠI ĐOẠN NÀY TƯƠNG TỰ
        if (stompClient && stompClient.connected) {
            const payload = {
                type: "CHAT",
                content: content,
                sender: username
            };
            try {
                stompClient.publish({
                    destination: '/app/chat.sendMessage',
                    body: JSON.stringify(payload)
                });
            } catch (error) {
                console.error("Lỗi khi gửi tin nhắn:", error);
            }
        } else {
            console.warn("Chưa kết nối WebSocket, không thể chat!");
        }
    };

    return { isConnected, sendVideoAction, sendChatMessage };
};