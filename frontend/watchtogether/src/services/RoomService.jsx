export const createRoom = async () => {
    try {
        // ⭐ Dùng relative path để tận dụng Vite proxy
        const response = await fetch('/api/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ⭐ Quan trọng: gửi và nhận cookie
            body: JSON.stringify({}),
        });
        if(!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        const data = await response.json();
        return data; // Assuming the response contains the room details
    } catch (error) {
        console.error('Error creating room:', error);
        throw error;
    }
};



export const joinRoom = async (roomId, body = {}) => {
    try {
        // ⭐ Dùng relative path để tận dụng Vite proxy
        const response = await fetch(`/api/rooms/${roomId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ⭐ Quan trọng: gửi và nhận cookie
            body: JSON.stringify(body),
        });
        if(!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return await response.json();
    } catch (error) {
        console.error('Error joining room:', error);
        throw error;
    }
};

export const getParticipants = async (roomId) => {
    try {
        // ⭐ Dùng relative path để tận dụng Vite proxy
        const response = await fetch(`/api/rooms/${roomId}/participants`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ⭐ Quan trọng: gửi cookie để xác thực
        });
        if(!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching participants:', error);
        throw error;
    }
};
