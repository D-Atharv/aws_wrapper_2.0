const {  PutObjectCommand } = require('@aws-sdk/client-s3');
const { bucketName, awsRegion, accessKeyId, secretAccessKey } = require("../configs/config");
const { getAllFiles } = require('../utils/file_utils')
const fs = require('fs');
const path = require('path');
const {s3Client} = require('../configs/s3Client-config');
/**
 * Uploads all files from a directory to S3.
 * @param {string} buildDir - The directory containing the build files.
 * @param {string} folderPrefix - Optional prefix for uploaded files in S3.
 * @returns {string} The default document name (e.g., index.html).
 */

async function uploadToS3(buildDir, repoName) {
    const folderPrefix = '';

    const possibleDirs = ['build', 'dist', 'out', '.next'];
    let outDir;
    for (const dir of possibleDirs) {
        const candidate = path.join(buildDir, dir);
        if (fs.existsSync(candidate)) {
            outDir = candidate;
            break;
        }
    }

    if (!outDir) {
        throw new Error('No valid build directory found!');
    }

    const files = getAllFiles(outDir);

    for (const filePath of files) {
        const relativePath = path.relative(outDir, filePath);
        const fileStream = fs.createReadStream(filePath);

        const uploadParams = {
            Bucket: bucketName,
            Key: folderPrefix + relativePath.replace(/\\/g, '/'), // Ensure S3-compatible paths
            Body: fileStream,
            ContentType: getContentType(filePath),
            ACL: "public-read"
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
            console.log(`Successfully uploaded ${relativePath}`);
        } catch (error) {
            throw new Error(`Error uploading ${relativePath} to S3: ${error.message}`);
        }
    }

    return `index.html`;
}

function getContentType(file) {
    //TODO - > use mime npm package
    const ext = path.extname(file);
    switch (ext) {
        case '.html': return 'text/html';
        case '.js': return 'application/javascript';
        case '.css': return 'text/css';
        case '.json': return 'application/json';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.png': return 'image/png';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

module.exports = {
    uploadToS3,
};