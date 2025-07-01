/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
const details = () => ({
    id: 'Tdarr_Plugin_HT01_auto_tag_language',
    Stage: 'Pre-processing',
    Name: 'HonkersTim-Audio language tagger',
    Type: 'Video',
    Operation: 'Transcode',
    Author: "HonkersTim",
    Description: `This plugin finds audio streams with undefined language tag ('und') and changes it to a user-specified language.
            By default, it will set undefined languages to English ('eng'), but this can be configured.
            Video tracks are ignored as they typically don't require language tags.`,
    Version: '1.31',
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
        reQueueAfter: false,
        infoLog: ""
    };

    // Check if file is a video. If it isn't then exit plugin.
    if (file.fileMedium !== "video") {
        response.infoLog += "☒File is not a video. \n";
        return response;
    }

    // Use target language from inputs or default to 'eng'
    const targetLanguage = inputs.target_language || 'eng';

    // Only grab audio streams - ignore video streams
    let streams = file.ffProbeData.streams.filter(
        (row) => row.codec_type === "audio"
    );

    let ffmpegArg = ", -map 0 -c copy";

    if (streams.length === 0) {
        response.infoLog += "☒No Audio tracks found to process. \n";
        return response;
    }

    // Tracks if we've made any changes
    let changesNeeded = false;

    // Get audio stream indices
    const allStreams = file.ffProbeData.streams;
    const audioStreams = allStreams.filter(stream => stream.codec_type === "audio");

    // Loop through audio streams only
    for (let i = 0; i < audioStreams.length; i++) {
        const stream = audioStreams[i];
        // Get language tag, default to "und" if not present
        let language = (stream.tags?.language || "und").toLowerCase();

        // Check if this stream has undefined language
        if (language === "und") {
            response.infoLog += `Changing audio track ${i} language from 'und' to '${targetLanguage}'. \n`;
            ffmpegArg += ` -metadata:s:a:${i} language=${targetLanguage}`;
            changesNeeded = true;
        }
    }

    if (!changesNeeded) {
        response.infoLog += "☒No undefined language audio streams found to change.\n";
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
