const fs = require('fs');
const util = require('util');
const bbg = require('..');

(async () => {
  getFiles().then((filePaths) => generateCCDs(filePaths));
})();

async function generateCCDs(filePaths) {
  return Promise.all(filePaths.map((filePath) => generateCCD(filePath)));
}

async function generateCCD(filePath) {
  const outFile = `e2e/generated/${getFileName(filePath)}.xml`;
  const readFile = util.promisify(fs.readFile);
  const writeFile = util.promisify(fs.writeFile);

  return readFile(filePath)
    .then((inputJson) => bbg.generateCCD(JSON.parse(inputJson)))
    .then((ccd) => writeFile(outFile, ccd));
}

async function getFiles() {
  const readdir = util.promisify(fs.readdir);
  const testFolder = 'e2e/fixtures';
  return readdir(testFolder).then((files) => files.map((file) => `${testFolder}/${file}`));
}

function getFileName(path) {
  const fileSections = path.split('/');
  return fileSections[fileSections.length - 1];
}
