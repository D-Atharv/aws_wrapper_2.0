const { S3Client, PutObjectCommand, PutBucketWebsiteCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');
const { bucketName, awsRegion, accessKeyId, secretAccessKey } = require("../configs/config");
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
});

function getAllFiles(dirPath, filesList = []) {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            getAllFiles(filePath, filesList); // Recursively traverse directories
        } else {
            filesList.push(filePath); // Add file to the list
        }
    }

    return filesList;
}

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

async function enableStaticWebsiteHosting() {
    const params = {
        Bucket: bucketName,
        WebsiteConfiguration: {
            IndexDocument: { Suffix: 'index.html' },
            ErrorDocument: { Key: '404.html' }
        }
    };

    try {
        await s3Client.send(new PutBucketWebsiteCommand(params));
        console.log('Static website hosting enabled for bucket.');
    } catch (error) {
        console.error('Error enabling static website hosting: ', error);
    }
}


async function setBucketPolicy() {
    const policyParams = {
        Bucket: bucketName,
        Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'PublicReadGetObject',
                    Effect: 'Allow',
                    Principal: "*",
                    Action: 's3:GetObject',
                    Resource: `arn:aws:s3:::${bucketName}/*`
                }
            ]
        })
    };

    try {
        await s3Client.send(new PutBucketPolicyCommand(policyParams));
        console.log('Bucket policy updated for public read access.');
    } catch (error) {
        console.error('Error updating bucket policy: ', error);
    }
}

module.exports = {
    uploadToS3,
    enableStaticWebsiteHosting,
    setBucketPolicy
};
