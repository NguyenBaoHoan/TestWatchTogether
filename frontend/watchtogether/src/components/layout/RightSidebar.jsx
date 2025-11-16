import React, { useState } from 'react';
import { ChevronDown, List, Shuffle, Heart, Search, SkipForward, Settings, Users } from 'lucide-react';
import ParticipantList from '../features/ParticipantList';

const RightSidebar = () => {
    const [activeTab, setActiveTab] = useState('Participants');

    return (
        <aside className="w-80 bg-[#3a3a46] flex flex-col h-full">
            {/* Header với tabs */}
            <div className="border-b border-gray-600">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('Participants')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Participants'
                                ? 'text-blue-400 border-blue-400'
                                : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <Users size={16} />
                            <span>Participants</span>
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('Playlists')}
                        className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'Playlists'
                                ? 'text-blue-400 border-blue-400'
                                : 'text-gray-400 border-transparent hover:text-white'
                            }`}
                    >
                        Playlists
                    </button>
                </div>
            </div>

            {/* Participants content */}
            {activeTab === 'Participants' && (
                <ParticipantList />
            )}

            {/* Playlist content */}
            {activeTab === 'Playlists' && (
                <div className="flex-1 p-4">
                    {/* Dropdown selector */}
                    <div className="mb-4">
                        <button className="w-full bg-[#2c2c34] text-white px-4 py-2 rounded-lg flex items-center justify-between hover:bg-gray-600">
                            <span>Watch2Gether Default</span>
                            <ChevronDown size={16} />
                        </button>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-600 rounded transition-colors" title="List view">
                                <List size={18} className="text-blue-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded transition-colors" title="Shuffle">
                                <Shuffle size={18} className="text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded transition-colors" title="Favorites">
                                <Heart size={18} className="text-gray-400" />
                            </button>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button className="p-2 hover:bg-gray-600 rounded transition-colors" title="Search">
                                <Search size={16} className="text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded transition-colors" title="Skip">
                                <SkipForward size={16} className="text-gray-400" />
                            </button>
                            <button className="p-2 hover:bg-gray-600 rounded transition-colors" title="Settings">
                                <Settings size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>

                    {/* Empty playlist message */}
                    <div className="text-center text-gray-400 mt-8">
                        <p>This playlist does not contain any items.</p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default RightSidebar;
