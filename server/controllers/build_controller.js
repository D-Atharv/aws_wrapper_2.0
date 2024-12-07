const { cloneAndBuildRepo } = require('../services/build_service');
const { enableStaticWebsiteHosting, setBucketPolicy } = require('../services/s3_service');
const { bucketName, awsRegion } = require('../configs/config');

async function startBuild(req, resp, next) {
    const { githubURL } = req.body;

    if (!githubURL) {
        return resp.status(400).json({ status: 'failure', message: 'Missing githubURL' });
    }

    try {
        const s3URL = await cloneAndBuildRepo(githubURL);

        await enableStaticWebsiteHosting();
        // await setBucketPolicy();

        resp.status(200).json({
            status: 'success',
            message: 'Build successful',
            s3URL: `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${s3URL}`
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    startBuild
};
