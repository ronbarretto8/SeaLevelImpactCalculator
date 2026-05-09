const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const inputVideo = path.join(__dirname, 'public', '338904.mp4');
const outputVideo = path.join(__dirname, 'public', 'hero-optimized.mp4');

// FFmpeg command to highly compress the video for web
// -an removes audio
// -vcodec libx264 -crf 28 -preset fast gives great compression
// -vf scale=-2:1080 scales to 1080p height
// -movflags +faststart optimizes for web streaming
const args = [
    '-i', inputVideo,
    '-an',
    '-vcodec', 'libx264',
    '-crf', '28',
    '-preset', 'fast',
    '-vf', 'scale=-2:1080',
    '-movflags', '+faststart',
    '-y', // overwrite output if exists
    outputVideo
];

console.log('Starting FFmpeg optimization to standard web-optimized MP4...');
const ffmpeg = spawn(ffmpegPath, args);

ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ffmpeg.on('close', (code) => {
    console.log(`FFmpeg process exited with code ${code}`);
    if (code === 0) {
        console.log('Successfully optimized video.');
    }
});
