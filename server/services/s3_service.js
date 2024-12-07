const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { bucketName, awsRegion, accessKeyId, secretAccessKey } = require("../configs/config")
const fs = require('fs');
const path = require('path');

const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey
    }
})

async function uploadToS3(buildDir) {
    const bucket = 'blogplatforms3';
    // Get the list of files and filter out directories
    const files = fs.readdirSync(buildDir).filter(file => {
        const filePath = path.join(buildDir, file);
        return fs.statSync(filePath).isFile(); // Check that it's a regular file, not a directory
    });

    for (let file of files) { 
        const filePath = path.join(buildDir, file);
        const fileStream = fs.createReadStream(filePath);

        const uploadParams = {
            Bucket: bucket,
            Key: file, 
            Body: fileStream
        };

        try {
            await s3Client.send(new PutObjectCommand(uploadParams));
        } catch (error) {
            throw new Error(`Error uploading to S3: ${error.message}`);
        }
    }
    return `https://${bucket}.s3.${awsRegion}.amazonaws.com/`;
}

module.exports = {
    uploadToS3,
};