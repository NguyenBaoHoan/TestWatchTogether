import React from 'react';
import { Crown, Mic, MicOff, Video, VideoOff, MoreVertical, Wifi, WifiOff } from 'lucide-react';
import { useRoom } from '../../hooks/useRoom';

const ParticipantList = () => {
    const { participants } = useRoom();
    

    return (
        <div className="flex-1 p-4">
            <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">
                    Participants ({participants?.length || 0})
                </h3>
            </div>

            <div className="space-y-2">
                {participants?.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between p-2 bg-[#2c2c34] rounded-lg hover:bg-[#3a3a46] transition-colors">
                        <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                    {participant.displayName?.charAt(0) || 'U'}
                                </div>
                                {participant.role === 'HOST' && (
                                    <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                                )}
                                {/* Online indicator */}
                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[#2c2c34] ${
                                    participant.online ? 'bg-green-500' : 'bg-gray-500'
                                }`} />
                            </div>

                            {/* Name and status */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-white truncate">
                                        {participant.displayName}
                                    </span>
                                    {participant.role === 'HOST' && (
                                        <span className="text-xs bg-yellow-500 text-black px-1.5 py-0.5 rounded">
                                            HOST
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2 mt-1">
                                    {participant.online ? (
                                        <Wifi className="w-3 h-3 text-green-400" />
                                    ) : (
                                        <WifiOff className="w-3 h-3 text-gray-400" />
                                    )}
                                    <span className="text-xs text-gray-400">
                                        Joined {new Date(participant.joinedAt).toLocaleTimeString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <button className="p-1 hover:bg-gray-600 rounded transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>
                )) || (
                    <div className="text-center text-gray-400 mt-8">
                        <p>No participants yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ParticipantList; 