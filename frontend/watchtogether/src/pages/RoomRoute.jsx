
import React, { useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { RoomContext } from '../context/RoomContext';
import RoomPage from './RoomPage';

export default function RoomRoute() {
  const { roomId } = useParams();
  const { roomData, joinRoom, isLoading, error } = useContext(RoomContext);


  // ⭐ PHẦN QUAN TRỌNG 7: Ref guard ở component gọi
  const hasTriedJoinRef = useRef(false);

  useEffect(() => {
    
    // ⭐ PHẦN QUAN TRỌNG 8: Kiểm tra trước khi gọi
    if (!roomId || hasTriedJoinRef.current) return;

    // ⭐ PHẦN QUAN TRỌNG 9: Đánh dấu đã thử join
    hasTriedJoinRef.current = true;
    joinRoom(roomId, { displayName: 'Guest' }).catch((err) => {
      console.error('Join room error:', err);
    });
  }, [roomId, joinRoom]);

  if (isLoading && !roomData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-xl">Joining room...</div>
      </div>
    );
  }

  if (error && !roomData) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-red-400 text-xl">Failed to join: {String(error)}</div>
      </div>
    );
  }

  if (!roomData) {
    return null;
  }

  return <RoomPage />;
}