# Tdarr Language Tagger Plugin

A Tdarr plugin that automatically tags audio streams with undefined language tags (`und`) with a user-specified language (default: English).

## Overview

Many media files have audio tracks with undefined language tags. This can cause issues with media servers, players, and automated workflows that rely on language tags for proper stream selection. This plugin solves that problem by automatically identifying those undefined audio streams and tagging them with your preferred language.

**Note**: This plugin only processes audio streams. Video tracks are ignored as they typically don't require language tags.

## Features

- Automatically identifies audio streams with undefined language tags
- Changes `und` language tags to your preferred language (default: English/`eng`)
- Ignores video streams entirely (as they typically don't need language tags)
- Preserves all other metadata including chapters, aspect ratio, and other track properties
- Simple configuration with minimal options
- Fast processing using direct metadata modification (no re-encoding)

## Installation

### Option 1: Automatic Installation (via Tdarr Plugin Browser)

1. In Tdarr, navigate to the "Plugins" tab
2. Click on "Plugins Manager"
3. Search for "Language Tagger" or "UW01"
4. Click "Install" next to the "Witcher-Audio/Video language tagger" plugin

### Option 2: Manual Installation

1. Download the `auto_tag_und_language.js` file from this repository
2. Place it in your Tdarr plugins folder:
   - On Windows: `C:\Users\YOUR_USERNAME\AppData\Roaming\Tdarr\Plugins\Local\`
   - On Linux: `~/.config/Tdarr/Plugins/Local/`
   - On Docker: `/app/server/Tdarr/Plugins/Local/`
3. Restart Tdarr or refresh the plugins in the UI

## Configuration

The plugin provides the following configuration option:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target_language` | string | `eng` | The ISO 639-2 language code to apply to undefined audio streams (e.g., `eng`, `fre`, `ger`, `spa`) |

## Usage Examples

### Basic Usage

To use the plugin with default settings (change all audio `und` to `eng`):

1. Add the plugin to your Tdarr stack
2. Run your library processing

### Custom Language

To tag undefined audio streams as French:

1. Add the plugin to your Tdarr stack
2. Set `target_language` to `fre`
3. Run your library processing

### Common Language Codes

| Language | ISO 639-2 Code |
|----------|----------------|
| English | `eng` |
| French | `fre` |
| German | `ger` |
| Spanish | `spa` |
| Italian | `ita` |
| Portuguese | `por` |
| Dutch | `dut` |
| Japanese | `jpn` |
| Korean | `kor` |
| Chinese | `chi` |

## How It Works

This plugin uses FFmpeg to directly modify the language metadata tags of your media files without re-encoding the content. The process is:

1. Scan the file for audio streams only (video streams are ignored)
2. Identify audio streams with the language tag `und` (undefined)
3. Generate an FFmpeg command to update those specific audio streams with your preferred language
4. Preserve all other metadata and stream properties
5. Process the file with FFmpeg

## Example Scenarios

### Scenario 1: Mixed Language Tags
**Before**: 
- Video stream: language = `und`
- Audio stream 1: language = `und`
- Audio stream 2: language = `eng`

**After**: 
- Video stream: language = `und` (unchanged - ignored)
- Audio stream 1: language = `eng` (changed)
- Audio stream 2: language = `eng` (unchanged)

### Scenario 2: All Undefined
**Before**: 
- Video stream: language = `und`
- Audio stream 1: language = `und`
- Audio stream 2: language = `und`

**After**: 
- Video stream: language = `und` (unchanged - ignored)
- Audio stream 1: language = `eng` (changed)
- Audio stream 2: language = `eng` (changed)

## Troubleshooting

### Files Being Processed Multiple Times

If you notice files being processed repeatedly, check if the language tags are being properly applied. Some containers or file formats might have issues with language tag updates.

### No Changes Being Made

If the plugin reports "No undefined language audio streams found to change," verify that:
- Your files actually have audio streams with undefined languages (`und`)
- The audio streams don't already have the target language set

### Plugin Triggers on Video with 'und' but Audio with 'eng'

This plugin is designed to ignore video streams entirely. If you have a file with:
- Video: language = `und`  
- Audio: language = `eng`

The plugin will correctly ignore both streams (video because it's a video stream, audio because it's already tagged with a language).

### Other Issues

For other issues, check the Tdarr logs for detailed information about the processing steps and any errors encountered.

## License

This plugin is licensed under the MIT License. See the LICENSE file for details.

## Credits

- Original author: UnknownWitcher
- Contributors: Tim Houghton

## Changelog

### Version 1.31 
- Simplified plugin to only process audio streams
- Removed video stream processing (video tracks are now ignored)
- Removed configuration options for stream type selection
- Updated to prevent false triggers on video streams with 'und' language tags
