/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = () => ({
    id: 'Tdarr_Plugin_HT01_auto_tag_language',
    Stage: 'Pre-processing',
    Name: 'HonkersTim-Audio/Video language tagger',
    Type: 'Video',
    Operation: 'Transcode',
    Author: "HonkersTim",
    Description: `This plugin finds audio and video streams with undefined language tag ('und') and changes it to a user-specified language.
            By default, it will set undefined languages to English ('eng'), but this can be configured.`,
    Version: '1.30',
    Tags: 'pre-processing,ffmpeg,configurable',
    Inputs: [{
        name: 'target_language',
        type: 'string',
        defaultValue: 'eng',
        inputUI: {
            type: 'text',
        },
        tooltip: `Specify the ISO 639-2 code to replace undefined ('und') language tags.\\n
            The default is 'eng' for English.\\n
            Use ISO 639-2 for the language code. https://en.wikipedia.org/wiki/List_of_ISO_639-2_codes\\n
            
            Examples:\\n
            eng - English\\n
            fre - French\\n
            ger - German\\n
            spa - Spanish\\n`,
    }, {
        name: 'process_audio',
        type: 'boolean',
        defaultValue: true,
        inputUI: {
            type: 'dropdown',
            options: [
                'true',
                'false',
            ],
        },
        tooltip: `Process audio streams with undefined language.\\n
            true: Change 'und' to target language in audio streams\\n
            false: Leave audio streams unchanged\\n`,
    }, {
        name: 'process_video',
        type: 'boolean',
        defaultValue: true,
        inputUI: {
            type: 'dropdown',
            options: [
                'true',
                'false',
            ],
        },
        tooltip: `Process video streams with undefined language.\\n
            true: Change 'und' to target language in video streams\\n
            false: Leave video streams unchanged\\n`,
    }],
});

// eslint-disable-next-line no-unused-vars
const plugin = (file, librarySettings, inputs, otherArguments) => {
    const lib = require('../methods/lib')();
    // eslint-disable-next-line no-unused-vars,no-param-reassign
    inputs = lib.loadDefaultValues(inputs, details);
    const response = {
        processFile: false,
        preset: "",
        handBrakeMode: false,
        container: `.${file.container}`,
        FFmpegMode: true,
        reQueueAfter: false, // Change to false to avoid reprocessing
        infoLog: ""
    };

    // Check if file is a video. If it isn't then exit plugin.
    if (file.fileMedium !== "video") {
        response.infoLog += "☒File is not a video. \n";
        return response;
    }

    // Use target language from inputs or default to 'eng'
    const targetLanguage = inputs.target_language || 'eng';

    // Grab our streams (audio and video)
    let streams = file.ffProbeData.streams.filter(
        (row) => (inputs.process_audio && row.codec_type === "audio") || 
                (inputs.process_video && row.codec_type === "video")
    );

    let ffmpegArg = ", -map 0 -c copy";
    let position = { // audio/video positions
        a: 0,
        v: 0,
    }

    if (streams.length === 0) {
        response.infoLog += "☒No Audio/Video tracks found to process. \n";
        return response;
    }

    // Tracks if we've made any changes
    let changesNeeded = false;

    // Get index mappings for each stream type
    const allStreams = file.ffProbeData.streams;
    const typeMap = {};
    
    for (let i = 0; i < allStreams.length; i++) {
        const type = allStreams[i].codec_type;
        if (!typeMap[type]) {
            typeMap[type] = [];
        }
        typeMap[type].push(i);
    }

    // Loops through audio and video streams
    for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        // Get language tag, default to "und" if not present
        let language = (stream.tags?.language || "und").toLowerCase();
        
        // Find the global index of this stream
        const streamType = stream.codec_type;
        const typeIndex = typeMap[streamType].indexOf(allStreams.indexOf(stream));
        
        if (typeIndex === -1) {
            response.infoLog += `Unable to find index for ${streamType} stream. Skipping. \n`;
            continue;
        }

        // Check if this stream has undefined language
        if (language === "und") {
            response.infoLog += `Changing ${streamType} track ${typeIndex} language from 'und' to '${targetLanguage}'. \n`;
            // Use the actual stream index in the file, not just the position among streams of the same type
            ffmpegArg += ` -metadata:s:${streamType[0]}:${typeIndex} language=${targetLanguage}`;
            changesNeeded = true;
        }
    }

    if (!changesNeeded) {
        response.infoLog += "☒No undefined language streams found to change.\n";
        return response;
    }

    // Add specific flags to preserve aspect ratio and all other metadata
    ffmpegArg += " -map_metadata 0 -map_chapters 0";

    response.processFile = true;
    response.preset = ffmpegArg + " -max_muxing_queue_size 9999";
    return response;
}
module.exports.details = details;
module.exports.plugin = plugin;
