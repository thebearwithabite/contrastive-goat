# Placeholder Audio Files

These are placeholder audio files for the multimedia experience. Replace with high-quality recordings:

## Files

- **soft_rain.m4a** - Gentle rain ambience (5-10 seconds, loopable)
- **metal_scrape.m4a** - Harsh metallic texture (2-3 seconds)
- **distant_piano.m4a** - Melancholic piano melody (3-5 seconds)
- **alarm_beep.m4a** - Urgent alert sound (2-3 seconds)
- **ambient_drone.m4a** - Background atmosphere (10+ seconds, loopable)

## Generating Placeholders

You can generate placeholder WAV files using the browser console:

1. Open the app in a browser
2. Open the console (F12)
3. Run: `window.generatePlaceholderAudio()`
4. Convert the WAV files to M4A using ffmpeg:
   ```bash
   ffmpeg -i soft_rain.wav -c:a aac -b:a 128k soft_rain.m4a
   ```

## Requirements (from ops/policy.json)

- Maximum file size: 3MB per file
- Required: Alt text for all audio (included in feelings_items.json)
- Required: Transcripts (described in alt text)

## Current Status

Currently using minimal silent placeholders. Replace with real audio for full experience.
