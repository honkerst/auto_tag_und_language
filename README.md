# Tdarr Language Tagger Plugin

A Tdarr plugin that automatically tags audio and video streams with undefined language tags (`und`) with a user-specified language (default: English).

## Overview

Many media files have audio or video tracks with undefined language tags. This can cause issues with media servers, players, and automated workflows that rely on language tags for proper stream selection. This plugin solves that problem by automatically identifying those undefined streams and tagging them with your preferred language.

## Features

- Automatically identifies audio and video streams with undefined language tags
- Changes `und` language tags to your preferred language (default: English/`eng`)
- Selectively process audio and/or video streams
- Preserves all other metadata including chapters, aspect ratio, and other track properties
- Simple configuration with flexible options
- Fast processing using direct metadata modification (no re-encoding)

## Installation

1. Download the `auto_tag_und_language.js` file from this repository
2. Place it in your Tdarr plugins folder:
   - On Windows: `C:\Users\YOUR_USERNAME\AppData\Roaming\Tdarr\Plugins\Local\`
   - On Linux: `~/.config/Tdarr/Plugins/Local/`
   - On Docker: `/app/server/Tdarr/Plugins/Local/`
   - On Proxmox: `/opt/tdarr/server/Tdarr/Plugins/Local/`
3. Restart Tdarr or refresh the plugins in the UI

## Configuration

The plugin provides the following configuration options:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target_language` | string | `eng` | The ISO 639-2 language code to apply to undefined streams (e.g., `eng`, `fre`, `ger`, `spa`) |
| `process_audio` | boolean | `true` | Whether to process audio streams with undefined language tags |
| `process_video` | boolean | `true` | Whether to process video streams with undefined language tags |

## Usage Examples

### Basic Usage

To use the plugin with default settings (change all `und` to `eng`):

1. Add the plugin to your Tdarr stack
2. Run your library processing

### Custom Language

To tag undefined streams as French:

1. Add the plugin to your Tdarr stack
2. Set `target_language` to `fre`
3. Run your library processing

### Only Process Audio Streams

To only process audio streams and leave video streams unchanged:

1. Add the plugin to your Tdarr stack
2. Set `process_audio` to `true`
3. Set `process_video` to `false`
4. Run your library processing

## How It Works

This plugin uses FFmpeg to directly modify the language metadata tags of your media files without re-encoding the content. The process is:

1. Scan the file for audio and video streams
2. Identify streams with the language tag `und` (undefined)
3. Generate an FFmpeg command to update those specific streams with your preferred language
4. Preserve all other metadata and stream properties
5. Process the file with FFmpeg

## Troubleshooting

### Files Being Processed Multiple Times

If you notice files being processed repeatedly, check if the language tags are being properly applied. Some containers or file formats might have issues with language tag updates.

### No Changes Being Made

If the plugin reports "No undefined language streams found to change," verify that:
- Your files actually have streams with undefined languages
- You have enabled processing for the correct stream types (audio/video)

### Other Issues

For other issues, check the Tdarr logs for detailed information about the processing steps and any errors encountered.

## License

This plugin is licensed under the MIT License. See the LICENSE file for details.

## Credits

- Original author: UnknownWitcher
- Contributors: HonkersTim
