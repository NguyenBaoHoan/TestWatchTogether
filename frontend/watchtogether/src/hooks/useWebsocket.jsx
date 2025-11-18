import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws';

export const useWebSocket = (roomId, username, onVideoAction, onChatMessage) => {
    const stompClientRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    // Dùng ref để lưu callback, tránh re-connect lặp vô tận
    const onVideoActionRef = useRef(onVideoAction);
    const onChatMessageRef = useRef(onChatMessage);
    useEffect(() => {
        onVideoActionRef.current = onVideoAction;
        onChatMessageRef.current = onChatMessage;
    }, [onVideoAction, onChatMessage]);
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
                    if (onVideoActionRef.current) {
                        onVideoActionRef.current(JSON.parse(message.body));
                    }
                });

                // 3. Lắng nghe Chat
                client.subscribe(`/topic/room/${roomId}/chat`, (message) => {
                    if (onChatMessageRef.current) {
                        onChatMessageRef.current(JSON.parse(message.body));
                    }
                });
                // 4. Lắng nghe thông tin phòng (để lấy Host Name)
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const roomInfo = JSON.parse(message.body);
                    console.log("Room Info:", roomInfo); // Debug xem có hostName không

                    // Gọi hàm callback này để App.jsx cập nhật state
                    if (onChatMessageRef.current) {
                        onChatMessageRef.current(roomInfo);
                    }
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
            }
        });

        client.activate();
        // 3. GÁN CLIENT VÀO REF
        stompClientRef.current = client;

        return () => {
            client.deactivate();
            stompClientRef.current = null;
        };
    }, [roomId, username]);
    // Hàm gửi lệnh Video (Play/Pause/Change)
    const sendVideoAction = useCallback((actionType, videoId, timestamp) => {
        const client = stompClientRef.current;
        // SỬA LẠI ĐOẠN NÀY: Kiểm tra kỹ stompClient và trạng thái connected
        if (client && client.connected) {
            const payload = {
                roomId,
                username,
                type: actionType,
                videoId: videoId,
                timestamp: timestamp || 0,
                playerType: 0
            };
            try {
                client.publish({
                    destination: '/app/video/action',
                    body: JSON.stringify(payload)
                });
            } catch (error) {
                console.error("Lỗi khi gửi lệnh video:", error);
            }
        } else {
            console.warn("Chưa kết nối WebSocket, không thể gửi lệnh!", client);
            // Có thể thêm logic hiển thị thông báo lỗi cho người dùng ở đây
        }
    }, [roomId, username]);

    //Hàm gửi tin nhắn Chat
    const sendChatMessage = (content) => {
        const client = stompClientRef.current; // Đọc từ ref
        // SỬA LẠI ĐOẠN NÀY TƯƠNG TỰ
        if (client && client.connected) {
            const payload = {
                type: "CHAT",
                content: content,
                sender: username
            };
            try {
                client.publish({
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