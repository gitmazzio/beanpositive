# Migrating from expo-av to expo-video

## Imports

```tsx
// Before
import { Video, ResizeMode } from 'expo-av';

// After
import { useVideoPlayer, VideoView, VideoSource } from 'expo-video';
import { useEvent, useEventListener } from 'expo';
```

## Video Playback

### Before (expo-av)

```tsx
const videoRef = useRef<Video>(null);
const [status, setStatus] = useState({});

<Video
  ref={videoRef}
  source={{ uri: 'https://example.com/video.mp4' }}
  style={{ width: 350, height: 200 }}
  resizeMode={ResizeMode.CONTAIN}
  isLooping
  onPlaybackStatusUpdate={setStatus}
/>

videoRef.current?.playAsync();
videoRef.current?.pauseAsync();
```

### After (expo-video)

```tsx
const player = useVideoPlayer('https://example.com/video.mp4', player => {
  player.loop = true;
});

const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

<VideoView
  player={player}
  style={{ width: 350, height: 200 }}
  contentFit="contain"
/>

player.play();
player.pause();
```

## Status Updates

### Before (expo-av)

```tsx
<Video
  onPlaybackStatusUpdate={status => {
    if (status.isLoaded) {
      console.log(status.positionMillis, status.durationMillis, status.isPlaying);
      if (status.didJustFinish) console.log('finished');
    }
  }}
/>
```

### After (expo-video)

```tsx
const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
useEventListener(player, 'playToEnd', () => console.log('finished'));
console.log(player.currentTime, player.duration, player.playing);
```

## Local Files

```tsx
// Before
<Video source={require('./video.mp4')} />

// After
const player = useVideoPlayer({ assetId: require('./video.mp4') });
```

## API Mapping

| expo-av | expo-video |
|---------|------------|
| `ref={videoRef}` | `player={useVideoPlayer()}` |
| `source={{ uri }}` | Pass to `useVideoPlayer(uri)` |
| `resizeMode={ResizeMode.CONTAIN}` | `contentFit="contain"` |
| `isLooping` | `player.loop = true` |
| `onPlaybackStatusUpdate` | `useEvent` / `useEventListener` |
| `videoRef.current.playAsync()` | `player.play()` |
| `status.positionMillis` | `player.currentTime` (seconds) |
| `status.didJustFinish` | `useEventListener(player, 'playToEnd')` |

## Key Differences

- **Separate player and view**: Player decoupled from view
- **Time in seconds**: Not milliseconds
- **Event system**: `useEvent`/`useEventListener` from `expo` instead of callback props
- **Changing source**: Use `player.replace(newSource)`

## Known Issues

- **Uninstall expo-av first**: On Android, having both can cause VideoView black screen
- **Android: Reusing players**: Same player in multiple VideoViews can cause black screen (works on iOS)

API: https://docs.expo.dev/versions/latest/sdk/video/
