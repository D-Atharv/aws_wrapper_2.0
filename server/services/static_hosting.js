const { S3Client, PutBucketWebsiteCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3');
const { bucketName } = require("../configs/config");
const {s3Client} = require('../configs/s3Client-config');

/**
 * Enables static website hosting for an S3 bucket.
 */
async function enableStaticWebsiteHosting() {
    const params = {
        Bucket: bucketName,
        WebsiteConfiguration: {
            IndexDocument: { Suffix: 'index.html' },
            ErrorDocument: { Key: '404.html' },
        },
    };

    try {
        await s3Client.send(new PutBucketWebsiteCommand(params));
        console.log('Static website hosting enabled for bucket.');
    } catch (error) {
        console.error('Error enabling static website hosting: ', error);
    }
}


/**
 * Sets a bucket policy to allow public read access.
 */
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
                    Resource: `arn:aws:s3:::${bucketName}/*`,
                },
            ],
        }),
    };

    try {
        await s3Client.send(new PutBucketPolicyCommand(policyParams));
        console.log('Bucket policy updated for public read access.');
    } catch (error) {
        console.error('Error updating bucket policy: ', error);
    }
}

module.exports = {
    enableStaticWebsiteHosting,
    setBucketPolicy,
};