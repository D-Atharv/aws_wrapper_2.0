const { execPromise } = require('../utils/logger');
const path = require('path');

async function cloneAndBuildRepo(githubURL) {
    try {
        const repoName = githubURL.split('/').pop().replace('.git', '');
        const buildDir = path.join(__dirname, '..', 'builds', repoName);

        console.log(`Cloning ${githubURL} into ${buildDir}`);
        await execPromise(`git clone ${githubURL} "${buildDir}"`);
        console.log(`Successfully cloned into ${buildDir}`);

        console.log(`Building ${githubURL}`);
        await execPromise(`cd "${buildDir}" && npm install`);

        // Check if the build script exists before running it
        const packageJson = path.join(buildDir, 'package.json');
        const packageData = require(packageJson);
        if (packageData.scripts && packageData.scripts.build) {
            await execPromise(`cd "${buildDir}" && npm run build`);
            console.log(`Successfully built the project`);
        } else {
            console.log('No build script found, skipping build step.');
        }

        return buildDir;
    } catch (error) {
        console.error('Error during clone/build:', error);
        throw error;
    }
}



module.exports = {
    cloneAndBuildRepo
}