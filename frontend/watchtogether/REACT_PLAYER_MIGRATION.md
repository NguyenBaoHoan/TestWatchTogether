# 🎬 ReactPlayer Migration Guide

## Tổng quan

Đã thay thế `<video>` element bằng **react-player** để hỗ trợ nhiều nguồn video hơn.

## ✅ Đã hoàn thành

### 1. Cài đặt
```bash
npm install react-player
```

### 2. Thay đổi VideoPlayer.jsx
- ✅ Import `react-player`
- ✅ Thay `<video>` → `<ReactPlayer>`
- ✅ Cập nhật event handlers
- ✅ Giữ nguyên WebSocket sync logic
- ✅ Custom controls (không dùng built-in controls)

### 3. Tương thích API
```javascript
// API cũ (HTML5 video)
videoElement.play()
videoElement.pause()
videoElement.currentTime = 10

// API mới (ReactPlayer) - đã wrap
playerRef.current.playVideo()    // Gọi playVideo() từ context
playerRef.current.pauseVideo()   // Gọi pauseVideo() từ context
playerRef.current.seekTo(10)     // Direct call to ReactPlayer
```

### 4. Event Handling
| Event | HTML5 Video | ReactPlayer |
|-------|-------------|-------------|
| Play | `onPlay` | `onPlay` |
| Pause | `onPause` | `onPause` |
| Time update | `onTimeUpdate` | `onProgress` |
| Duration | `onLoadedMetadata` | `onDuration` |
| Ready | `onCanPlay` | `onReady` |
| Buffer | `onWaiting` | `onBuffer` / `onBufferEnd` |
| Error | `onError` | `onError` |

## 🎯 Supported Platforms

ReactPlayer hỗ trợ:

### Streaming Platforms
- ✅ **YouTube** - `https://www.youtube.com/watch?v=...`
- ✅ **Vimeo** - `https://vimeo.com/...`
- ✅ **Twitch** - `https://www.twitch.tv/videos/...`
- ✅ **Facebook** - `https://www.facebook.com/...`
- ✅ **SoundCloud** - `https://soundcloud.com/...`
- ✅ **DailyMotion** - `https://www.dailymotion.com/video/...`
- ✅ **Mixcloud** - `https://www.mixcloud.com/...`
- ✅ **Wistia** - `https://home.wistia.com/medias/...`

### Direct Files
- ✅ **MP4** - `.mp4`
- ✅ **WebM** - `.webm`
- ✅ **OGV** - `.ogv`
- ✅ **MP3** - `.mp3`
- ✅ **WAV** - `.wav`
- ✅ **HLS** - `.m3u8`
- ✅ **DASH** - `.mpd`

## 📡 WebSocket Sync

**Không thay đổi gì!** Backend và WebSocket sync logic hoạt động y như cũ:

```javascript
// Events vẫn giữ nguyên format
{
  type: 'PLAY',      // PLAY, PAUSE, SEEK, CHANGE
  currentTime: 10.5,
  videoUrl: 'https://...',
  participantId: '...',
  roomId: '...',
  timestamp: 1234567890
}
```

## 🔧 Configuration

```jsx
<ReactPlayer
  url={videoUrl}
  playing={isPlaying}
  volume={volume}
  muted={isMuted}
  width="100%"
  height="100%"
  controls={false}        // ⭐ Dùng custom controls
  progressInterval={500}  // Update progress mỗi 500ms
  config={{
    youtube: {
      playerVars: { 
        showinfo: 0,
        modestbranding: 1,
      }
    },
    file: {
      attributes: {
        controlsList: 'nodownload'
      }
    }
  }}
/>
```

## 🧪 Testing

### URL Test Examples
```javascript
// YouTube
https://www.youtube.com/watch?v=dQw4w9WgXcQ

// Vimeo
https://vimeo.com/90509568

// Direct MP4
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### Test Flow
1. Tạo/join room
2. Copy test URL từ `/test` page
3. Paste vào VideoPlayer
4. Load video
5. Mở tab thứ 2
6. Test sync: Play → Pause → Seek → Change

### Test Page
Truy cập: `http://localhost:5173/test`
- Chọn "Test 0: ReactPlayer + WebSocket"
- Copy các URL test
- Follow instructions

## ⚠️ Known Issues

### 1. YouTube Autoplay
**Issue**: YouTube có thể block autoplay nếu chưa có user interaction

**Solution**: User phải click Play button trước

### 2. CORS Errors
**Issue**: Một số file URLs bị CORS restrict

**Solution**: 
- Host files trên server của bạn
- Hoặc dùng proxy
- Hoặc dùng public CDN

### 3. Embed Restrictions
**Issue**: Một số YouTube videos bị restrict embed

**Solution**: Test với video khác

### 4. Sync Latency
**Issue**: Sync có độ trễ 100-200ms

**Reason**: Network latency + WebSocket transmission

**Impact**: Minimal - người dùng khó nhận ra

## 🔄 Migration Checklist

- [x] Cài đặt `react-player`
- [x] Update `VideoPlayer.jsx`
- [x] Update event handlers
- [x] Test với file URLs
- [x] Test với YouTube
- [x] Test với Vimeo
- [x] Test WebSocket sync
- [x] Test multiple clients
- [x] Verify controls hoạt động
- [x] Verify volume control
- [x] Verify seek bar
- [x] Verify loading states
- [x] Tạo test page
- [x] Tạo documentation

## 💡 Best Practices

### 1. Always Check Player Ready
```javascript
const handlePlayerReady = () => {
  setIsReady(true);
  // Giờ mới có thể control player
};
```

### 2. Handle Errors Gracefully
```javascript
const handlePlayerError = (error) => {
  console.error('Player error:', error);
  // Show user-friendly message
  // Fallback to alternative video
};
```

### 3. Throttle Progress Updates
```javascript
<ReactPlayer
  progressInterval={500} // Không update quá nhanh
  onProgress={handleProgress}
/>
```

### 4. Prevent Sync Loops
```javascript
if (!isSyncingRef.current) {
  // Chỉ gửi event khi user tương tác
  sendVideoEvent('PLAY');
}
```

## 📚 Resources

- [ReactPlayer Docs](https://github.com/cookpete/react-player)
- [Supported URLs](https://github.com/cookpete/react-player#props)
- [Props API](https://github.com/cookpete/react-player#props)
- [Config Options](https://github.com/cookpete/react-player#config-prop)

## 🎉 Benefits

1. **Multi-platform**: YouTube, Vimeo, Twitch, etc.
2. **Consistent API**: Dùng chung 1 component cho tất cả
3. **Auto-detect**: Tự nhận diện URL type
4. **Fallback**: Tự động fallback nếu player fail
5. **Lightweight**: Chỉ load player cần thiết
6. **Maintained**: Library được maintain tốt

## 🔜 Next Steps

1. Test với nhiều video sources khác nhau
2. Thêm playlist support
3. Thêm quality selector (cho YouTube)
4. Thêm playback rate control
5. Thêm subtitle support
6. Improve loading UI
7. Add video thumbnails
8. Add video suggestions

---

**Prepared by**: AI Assistant  
**Date**: October 25, 2025  
**Version**: 1.0.0
