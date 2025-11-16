import { useRoom } from '../hooks/useRoom'; // 1. Import hook để lấy logic
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import navigate để chuyển trang
import Header from '../components/layout/Header.jsx';
import Hero from '../components/features/Hero.jsx';
import About from '../components/features/About.jsx';
import Footer from '../components/layout/Footer.jsx';

const HomePage = () => {
  const { createRoom, isLoading } = useRoom(); // 2. Sử dụng hook để lấy hàm và trạng thái
  const navigate = useNavigate(); // Hook để điều hướng

  // 3. Xử lý tạo phòng và chuyển trang
  const handleCreateRoom = async () => {
    try {
      const roomData = await createRoom(); // Tạo phòng
      if (roomData?.roomId) {
        // Chuyển sang trang phòng vừa tạo
        navigate(`/room/${roomData.roomId}`);
      }
    } catch (error) {
      console.error('Failed to create room:', error);
      // TODO: Hiển thị thông báo lỗi cho user
    }
  };

  return (
    <>
      <Header />
      <main>
        <Hero onCreateRoomClick={handleCreateRoom} isLoading={isLoading} />
        <About />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;

