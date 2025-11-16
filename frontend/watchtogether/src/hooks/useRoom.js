import { useContext } from 'react';
import { RoomContext } from '../context/RoomContext';

export function useRoom() {
    const ctx = useContext(RoomContext);
    if (!ctx) {
        throw new Error('useRoom must be used within RoomProvider');
    }
    return ctx;
} 