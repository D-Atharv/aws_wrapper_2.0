const fs = require('fs');
const path = require('path');

/**
 * Recursively fetches all files in a directory.
 * @param {string} dirPath - The directory to traverse.
 * @param {string[]} filesList - The list of files (used for recursion).
 * @returns {string[]} The list of all files.
 */

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

module.exports = {
    getAllFiles,
}