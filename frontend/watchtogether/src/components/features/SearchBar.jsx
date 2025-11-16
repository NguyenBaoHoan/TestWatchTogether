import React from 'react';
import { Search, X, Mic, Share2, MoreVertical } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="w-full">
            {/* Dòng chứa tên video và các nút actions */}
            <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-yellow-500 flex items-center justify-center rounded-md mr-3">
                    {/* Placeholder for YouTube icon or similar */}
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </div>
                <h2 className="text-lg font-semibold flex-1">Watch2Gether - Cats vs. Dogs</h2>
                <div className="flex items-center space-x-3 text-gray-400">
                    <button className="hover:text-white">Watch later</button>
                    <button className="flex items-center space-x-1 hover:text-white"><Share2 size={18} /><span>Share</span></button>
                    <button className="hover:text-white"><MoreVertical size={20} /></button>
                </div>
            </div>
            
            {/* Dòng chứa thanh tìm kiếm thật */}
            <div className="flex items-center bg-[#2c2c34] rounded-md p-2">
                <Search size={20} className="text-gray-400" />
                <input
                    type="text"
                    placeholder="Search OR Paste a link to a youtube video"
                    className="flex-1 bg-transparent mx-2 focus:outline-none placeholder-gray-500"
                />
                <div className="flex items-center space-x-2">
                     <Mic size={20} className="text-gray-400 cursor-pointer hover:text-white"/>
                     <X size={20} className="text-gray-400 cursor-pointer hover:text-white"/>
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
