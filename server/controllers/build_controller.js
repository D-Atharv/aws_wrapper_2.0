const { cloneAndBuildRepo } = require('../services/build_service');
const { uploadToS3 } = require('../services/s3_service');
async function startBuild(req, resp, next) {
    const { githubURL } = req.body;

    if (!githubURL) {
        return resp.status(400).json({ status: 'failure', message: 'Missing githubURL' });
    }

    try {
        //cloning and building project directly onto server
        //TODO -> later switch to using docker
        const buildDir = await cloneAndBuildRepo(githubURL);

        //upload build to s3
        const s3URL = await uploadToS3(buildDir);

        resp.status(200).json({ status: 'success', message: 'Build successful', s3URL });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    startBuild
}