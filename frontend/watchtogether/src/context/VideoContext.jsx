import { createContext, useContext } from 'react';

/**
 * Context chứa state và actions của video player
 */
export const VideoContext = createContext({
  // Video state
  videoUrl: null,           // URL video hiện tại
  isPlaying: false,         // Đang play hay pause
  currentTime: 0,           // Vị trí hiện tại (giây)
  duration: 0,              // Tổng thời lượng
  
  // Actions
  playVideo: () => {},      // Play video
  pauseVideo: () => {},     // Pause video
  seekVideo: (time) => { void time; },  // Kéo tới vị trí mới
  changeVideo: (url) => { void url; }, // Đổi video
  
  // Sync flag (tránh loop)
  isSyncing: false,         // Đang sync từ server?
});

export const useVideo = () => useContext(VideoContext);