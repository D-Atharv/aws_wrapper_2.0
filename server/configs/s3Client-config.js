const { S3Client } = require('@aws-sdk/client-s3')
const { awsRegion, accessKeyId, secretAccessKey } = require('../configs/config')
const s3Client = new S3Client({
    region: awsRegion,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});

module.exports = {
    s3Client
}