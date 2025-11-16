/**
 * 📊 DashboardPage.jsx
 * 
 * Trang Dashboard sau khi đăng nhập thành công
 * - Hiển thị thông tin user từ JWT token
 * - Danh sách lịch sử phòng đã tạo
 * - Nút tạo phòng mới
 * - Giao diện hiện đại, responsive
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';

const DashboardPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { createRoom, isLoading } = useRoom();

    // State quản lý lịch sử phòng (mock data - sau này sẽ fetch từ API)
    const [roomHistory] = useState([
        {
            id: 'room-1',
            name: 'Phòng Tạm Thời',
            createdAt: new Date().toISOString(),
            participants: 1,
            isActive: true,
        }
    ]);

    // Xử lý tạo phòng mới
    const handleCreateRoom = async () => {
        try {
            const roomData = await createRoom();
            if (roomData?.roomId) {
                navigate(`/room/${roomData.roomId}`);
            }
        } catch (error) {
            console.error('Lỗi khi tạo phòng:', error);
            alert('Không thể tạo phòng. Vui lòng thử lại!');
        }
    };

    // Xử lý đăng xuất
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    // Xử lý vào phòng từ lịch sử
    const handleJoinRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        {/* Logo */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                                <span className="text-3xl font-bold text-yellow-400">WatchTogether</span>
                            </div>
                            
                        </div>

                        {/* User Info & Actions */}
                        <div className="flex items-center space-x-4">
                            

                            {/* User Menu */}
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-white font-semibold">{user?.name || user?.email || 'User'}</p>
                                    <p className="text-gray-400 text-sm">{user?.email}</p>
                                </div>

                                {/* Avatar & Dropdown */}
                                <div className="relative group">
                                    <button className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg hover:shadow-lg transition-shadow duration-200">
                                        {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <div className="py-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700 transition-colors duration-150"
                                            >
                                                🚪 Đăng Xuất
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title & Action */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Phòng Của Tôi</h1>

                    <div className="flex space-x-3">
                        {/* Nút Làm Mới */}
                        <button
                            onClick={() => window.location.reload()}
                            className="p-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                            title="Làm mới danh sách"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>

                        {/* Nút Tạo Phòng */}
                        <button
                            onClick={handleCreateRoom}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Đang tạo...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>Tạo Phòng Mới</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Room History List */}
                <div className="space-y-4">
                    {roomHistory.length === 0 ? (
                        // Empty State
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
                            <div className="inline-block p-4 bg-gray-700 rounded-full mb-4">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Chưa có lịch sử phòng</h3>
                            <p className="text-gray-400">Tạo phòng mới để bắt đầu xem video cùng bạn bè!</p>
                        </div>
                    ) : (
                        // Room Cards
                        roomHistory.map((room) => (
                            <div
                                key={room.id}
                                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500 transition-all duration-200 group"
                            >
                                <div className="flex items-center justify-between">
                                    {/* Room Info */}
                                    <div className="flex items-center space-x-4 flex-1">
                                        {/* Icon */}
                                        <div className="p-3 bg-gray-700 group-hover:bg-blue-600 rounded-lg transition-colors duration-200">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white mb-1">{room.name}</h3>
                                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                                                <span className="flex items-center space-x-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <span>{room.participants} người</span>
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(room.createdAt).toLocaleDateString('vi-VN')}</span>
                                                {room.isActive && (
                                                    <>
                                                        <span>•</span>
                                                        <span className="text-green-400 font-semibold">● Đang hoạt động</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => handleJoinRoom(room.id)}
                                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
                                    >
                                        <span>Vào Phòng</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Lịch sử phòng được lưu trong 30 ngày</p>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;
