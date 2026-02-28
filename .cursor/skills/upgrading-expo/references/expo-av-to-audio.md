# Migrating from expo-av to expo-audio

## Imports

```tsx
// Before
import { Audio } from 'expo-av';

// After
import { useAudioPlayer, useAudioRecorder, RecordingPresets, AudioModule, setAudioModeAsync } from 'expo-audio';
```

## Audio Playback

### Before (expo-av)

```tsx
const [sound, setSound] = useState<Audio.Sound>();

async function playSound() {
  const { sound } = await Audio.Sound.createAsync(require('./audio.mp3'));
  setSound(sound);
  await sound.playAsync();
}

useEffect(() => {
  return sound ? () => { sound.unloadAsync(); } : undefined;
}, [sound]);
```

### After (expo-audio)

```tsx
const player = useAudioPlayer(require('./audio.mp3'));

player.play();
```

## Audio Recording

### Before (expo-av)

```tsx
const [recording, setRecording] = useState<Audio.Recording>();

async function startRecording() {
  await Audio.requestPermissionsAsync();
  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  setRecording(recording);
}

async function stopRecording() {
  await recording?.stopAndUnloadAsync();
  const uri = recording?.getURI();
}
```

### After (expo-audio)

```tsx
const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

async function startRecording() {
  await AudioModule.requestRecordingPermissionsAsync();
  await recorder.prepareToRecordAsync();
  recorder.record();
}

async function stopRecording() {
  await recorder.stop();
  const uri = recorder.uri;
}
```

## API Mapping

| expo-av | expo-audio |
|---------|------------|
| `Audio.Sound.createAsync()` | `useAudioPlayer(source)` |
| `sound.playAsync()` | `player.play()` |
| `sound.pauseAsync()` | `player.pause()` |
| `sound.setPositionAsync(ms)` | `player.seekTo(seconds)` |
| `sound.setVolumeAsync(vol)` | `player.volume = vol` |
| `sound.setRateAsync(rate)` | `player.playbackRate = rate` |
| `sound.setIsLoopingAsync(loop)` | `player.loop = loop` |
| `sound.unloadAsync()` | Automatic via hook |
| `playbackStatus.positionMillis` | `player.currentTime` (seconds) |
| `playbackStatus.durationMillis` | `player.duration` (seconds) |
| `playbackStatus.isPlaying` | `player.playing` |
| `recording.stopAndUnloadAsync()` | `recorder.stop()` |
| `recording.getURI()` | `recorder.uri` |
| `Audio.requestPermissionsAsync()` | `AudioModule.requestRecordingPermissionsAsync()` |

## Key Differences

- **Time in seconds**: expo-audio uses seconds, not milliseconds
- **No auto-reset on finish**: Call `player.seekTo(0)` then `play()` to replay
- **Automatic cleanup**: Hooks handle resource cleanup on unmount
- **Direct property access**: `player.volume = 0.5`

API: https://docs.expo.dev/versions/latest/sdk/audio/
