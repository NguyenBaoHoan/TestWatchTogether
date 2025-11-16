import React from 'react';
import { Youtube, Twitch, Video, Film, Cloud } from 'lucide-react';

const Hero = ({ onCreateRoomClick, isLoading}) => {
  return (
    <section className="min-h-screen flex items-center justify-center text-white relative px-4">
      <div className="z-10 flex flex-col items-center bg-blue-950/60 bg-opacity-30 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-lg">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          explore together.
        </h1>
        {/* USE PROPS HERE */}
        <button 
          onClick = {onCreateRoomClick}
          disabled={isLoading}
          className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-300 transition-transform hover:scale-105">
          {isLoading ? 'Creating...' : 'Create Room'}
        </button>
        <p className="mt-3 text-gray-300">(No user account required)</p>
        
        {/* Platform Icons */}
        <div className="flex items-center space-x-6 mt-8">
            <Youtube size={32} className="opacity-70 hover:opacity-100 cursor-pointer"/>
            <Twitch size={32} className="opacity-70 hover:opacity-100 cursor-pointer"/>
            <Video size={32} className="opacity-70 hover:opacity-100 cursor-pointer"/>
            <Film size={32} className="opacity-70 hover:opacity-100 cursor-pointer"/>
            <Cloud size={32} className="opacity-70 hover:opacity-100 cursor-pointer"/>
        </div>
      </div>
    </section>
  );
};

export default Hero;

