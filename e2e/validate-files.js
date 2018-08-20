const fs = require('fs');
const request = require('request');

(async () => {
  const filePaths = await getFiles();
  const passed = await validateFiles(filePaths);
  console.log(`Success: ${passed}`);
  process.exit(passed ? 0 : 1);
})();

async function validateFiles(filePaths) {
  return Promise.all(filePaths.map((filePath) => validateFile(filePath))).then(
    (results) => !results.some((result) => result !== true)
  );
}

async function validateFile(filePath) {
  const url =
    'https://ttpds.sitenv.org:8443/referenceccdaservice/?validationObjective=C-CDA_IG_Plus_Vocab&referenceFileName=Readme.txt';
  return new Promise((resolve, reject) => {
    request.post(
      {
        url,
        formData: {
          ccdaFile: fs.createReadStream(filePath)
        }
      },
      (error, response, body) => {
        if (error) {
          reject(error);
        }
        if (response.statusCode !== 200) {
          reject('non 200 code');
        }
        const results = JSON.parse(body).resultsMetaData.resultMetaData;
        resolve(validateResults(results, filePath));
      }
    );
  });
}

async function getFiles() {
  const testFolder = 'test/fixtures/files/generated/json_to_xml';
  return new Promise((resolve, reject) => {
    fs.readdir(testFolder, (err, files) => {
      resolve(files.map((file) => `${testFolder}/${file}`));
    });
  });
}

function validateResults(results, filePath) {
  const fileName = getFileName(filePath);
  const messageCounts = getReturnedMessageCount(results, fileName);

  if (messageCounts.error !== 0) {
    console.log(`Found ${messageCounts.error} total errors in ${fileName}`);
  }

  return messageCounts.error === 0;
}

function getReturnedMessageCount(results, fileName) {
  return results.reduce((p, c) => {
    const messageType = getMessageType(c);

    if (c.count !== 0) {
      console.log(`Found ${c.count} ${c.type} messages in ${fileName}`);
    }

    p[messageType] = p[messageType] ? p[messageType] + c.count : c.count;

    return p;
  }, {});
}

function getMessageType(message) {
  const messageLabelArray = message.type.split(' ');
  return messageLabelArray[messageLabelArray.length - 1].toLowerCase();
}

function getFileName(path) {
  const fileSections = path.split('/');
  return fileSections[fileSections.length - 1];
}
