# Tdarr Audio Language Tagger Plugin

Automatically changes undefined (`und`) language tags to a specified language on audio streams only. Video streams are ignored.

## Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target_language` | string | `eng` | ISO 639-2 language code to replace `und` tags |

## Behavior

- **Processes**: Audio streams with `language = "und"`
- **Ignores**: Video streams (regardless of language tag)
- **Changes**: `und` → your specified language (default: `eng`)
- **Preserves**: All other metadata, chapters, and stream properties

## Example

**Before**: Audio stream with `language = "und"`  
**After**: Audio stream with `language = "eng"`

Files with video tracks tagged as `und` but audio tracks already properly tagged will be skipped entirely.

## Installation

Place `auto_tag_und_language.js` in your Tdarr plugins folder or install via the plugin browser.

---

**Author**: UnknownWitcher  
**Version**: 1.31
