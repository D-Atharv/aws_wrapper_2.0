const { execPromise } = require('../utils/logger');
const { uploadToS3 } = require('./s3_service');
const path = require('path');
const fs = require('fs');

async function cloneAndBuildRepo(githubURL) {
    //TODO -> BUILD IN DOCKER FILE
    try {
        const repoName = githubURL.split('/').pop().replace('.git', '');
        const buildDir = path.join(__dirname, '..', 'builds', repoName);

        //removing build if it already exists
        if (fs.existsSync(buildDir)) {
            console.log("buildDir already exists. Removing it first");
            fs.rmSync(buildDir, { recursive: true, force: true });
            console.log("removed buildDir and will create a new one");
        }else{
            console.log("build directory doesnt exist. proceeding further")
        }

        console.log(`Cloning ${githubURL} into ${buildDir}`);
        await execPromise(`git clone ${githubURL} "${buildDir}"`);
        console.log(`Successfully cloned into ${buildDir}`);

        console.log(`Building ${githubURL}`);
        const hasYarn = fs.existsSync(path.join(buildDir, 'yarn.lock'));
        const installCommand = hasYarn ? 'yarn install' : 'npm install';
        await execPromise(`cd "${buildDir}" && ${installCommand}`);
        console.log(`Successfully installed dependencies in ${buildDir}`);
        // await execPromise(`cd "${buildDir}" && npm install`);

        // Check if the build script exists before running it
        const packageJson = path.join(buildDir, 'package.json');
        const packageData = require(packageJson);
        if (packageData.scripts && packageData.scripts.build) {
            await execPromise(`cd "${buildDir}" && npm run build`);
            console.log(`Successfully built the project`);
        } else {
            console.log('No build script found, skipping build step.');
        }

        const s3URL = await uploadToS3(buildDir, repoName);
        return s3URL;
    } catch (error) {
        console.error('Error during clone/build:', error);
        throw error;
    }
}

module.exports = {
    cloneAndBuildRepo
};
