
import React, { useEffect, useRef, useState } from 'react';
import { RoomContext } from './RoomContext';
import {
  createRoom as createRoomAPI,
  joinRoom as joinRoomAPI,
  getParticipants as getParticipantsAPI,
} from '../services/RoomService';

export default function RoomProvider({ children }) {
  const [roomData, setRoomData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // ⭐ PHẦN QUAN TRỌNG 1: Khai báo 2 ref flags
  const hasJoinedRef = useRef(false); // Đánh dấu đã join thành công
  const isJoiningRef = useRef(false); // Đánh dấu đang trong quá trình join

  const createRoom = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await createRoomAPI();
      // ⭐ Không lưu accessToken (đã có trong HttpOnly cookie)
      // eslint-disable-next-line no-unused-vars
      const { accessToken, ...safeData } = data;
      setRoomData(safeData);
      return safeData;
    } catch (err) {
      setError(err?.message || 'Failed to create room');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinRoom = async (roomId, payload) => {
    // ⭐ PHẦN QUAN TRỌNG 2: Guard đầu tiên - Kiểm tra đã join
    if (!roomId || hasJoinedRef.current) {
      return roomData;
    }

    // ⭐ PHẦN QUAN TRỌNG 3: Guard thứ hai - Kiểm tra đang join
    if (isJoiningRef.current) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (hasJoinedRef.current) {
            clearInterval(checkInterval);
            resolve(roomData);
          }
        }, 50);
      });
    }
    // ⭐ PHẦN QUAN TRỌNG 4: Đánh dấu đang join
    isJoiningRef.current = true;
    setIsLoading(true);
    setError(null);
// ⭐ PHẦN QUAN TRỌNG 5: Đánh dấu đã join thành công
    try {
      const data = await joinRoomAPI(roomId, payload ?? { displayName: 'Guest' });
      // ⭐ Không lưu accessToken (đã có trong HttpOnly cookie)
      // eslint-disable-next-line no-unused-vars
      const { accessToken, ...safeData } = data;
      setRoomData(safeData);
      hasJoinedRef.current = true; // ✅ Đánh dấu đã join
      return safeData;
    } catch (err) {
      setError(err?.message || 'Failed to join room');
      throw err;
    } finally {
      setIsLoading(false);
      
    // ⭐ PHẦN QUAN TRỌNG 6: Reset flag đang join
      isJoiningRef.current = false;
    }
  };

  const fetchParticipants = async (roomId) => {
    try {
      if (!roomId) return;
      const list = await getParticipantsAPI(roomId);
      setParticipants(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error('Fetch participants error:', err);
    }
  };

  const refreshParticipants = async () => {
    if (roomData?.roomId) {
      await fetchParticipants(roomData.roomId);
    }
  };

  // ✅ Effect thiết lập WebSocket - chỉ chạy khi có roomId
  useEffect(() => {
    if (!roomData?.roomId) return;

    let retryTimeout;

    const setupConnection = async () => {
      try {
        await fetchParticipants(roomData.roomId);
        // TODO: Setup WebSocket/STOMP connection here
      } catch (e) {
        console.error('Setup error:', e);
        retryTimeout = setTimeout(setupConnection, 2000);
      }
    };

    setupConnection();

    return () => {
      if (retryTimeout) clearTimeout(retryTimeout);
      // TODO: Cleanup WebSocket connection
    };
  }, [roomData?.roomId]);

  const value = {
    roomData,
    setRoomData,
    participants,
    isLoading,
    error,
    createRoom,
    joinRoom,
    fetchParticipants,
    refreshParticipants,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}