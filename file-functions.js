const zlib = require('zlib');
const fs = require('fs');
const crypto = require('crypto');
const { Transform } = require('stream');

function handleOperationFailure() {
  console.log('Operation failed.');
}

function changeDirectory (directoryPath) {
  fs.access(directoryPath, fs.constants.F_OK | fs.constants.R_OK, (err) => {
    if (err) {
      handleOperationFailure();
    } else {
      process.chdir(directoryPath);
      printCurrentDirectory();
    }
  });
}

function listDirectory () {
  fs.readdir(process.cwd(), { withFileTypes: true }, (err, files) => {
    if (err) {
      handleOperationFailure();
    } else {
      const sortedFiles = files.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) {
          return -1;
        }
        if (!a.isDirectory() && b.isDirectory()) {
          return 1;
        }
        return a.name.localeCompare(b.name);
      });

      for (const file of sortedFiles) {
        const fileType = file.isDirectory() ? 'Folder' : 'File';
        console.log(`${fileType}: ${file.name}`);
      }
    }
  });
}

function readFile(filePath) {
  const readStream = fs.createReadStream(filePath, 'utf8');
  readStream.pipe(process.stdout);
}

function createFile(fileName) {
  fs.writeFile(fileName, '', (err) => {
    if (err) {
      handleOperationFailure();
    }
  });
}

function renameFile(oldPath, newPath) {
  fs.rename(oldPath, newPath, (err) => {
    if (err) {
      handleOperationFailure();
    }
  });
}

function copyFile(sourcePath, destinationPath) {
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationPath);

  readStream.on('error', handleOperationFailure);
  writeStream.on('error', handleOperationFailure);

  readStream.pipe(writeStream);
}

function moveFile(sourcePath, destinationPath) {
  copyFile(sourcePath, destinationPath);
  fs.unlink(sourcePath, (err) => {
    if (err) {
      handleOperationFailure();
    }
  });
}

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      handleOperationFailure();
    }
  });
}

function compressFile(sourcePath, destinationPath) {
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationPath);
  const compressStream = zlib.createBrotliCompress();

  readStream.on('error', handleOperationFailure);
  writeStream.on('error', handleOperationFailure);
  compressStream.on('error', handleOperationFailure);

  readStream.pipe(compressStream).pipe(writeStream);
}

function decompressFile(sourcePath, destinationPath) {
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destinationPath);
  const decompressStream = zlib.createBrotliDecompress();

  readStream.on('error', handleOperationFailure);
  writeStream.on('error', handleOperationFailure);
  decompressStream.on('error', handleOperationFailure);

  readStream.pipe(decompressStream).pipe(writeStream);
}

function calculateHash(filePath) {
  const hashStream = fs.createReadStream(filePath).pipe(createHashStream());

  hashStream.on('data', (hash) => {
    console.log(`Hash: ${hash.toString()}`);
  });

  hashStream.on('error', handleOperationFailure);
}

function createHashStream() {
  return new Transform({
    transform(chunk, encoding, callback) {
      const hash = crypto.createHash("sha256").update(chunk).digest("hex");
      this.push(hash);
      callback();
    },
    flush(callback) {
      callback();
    }
  });
}

module.exports = {listDirectory, changeDirectory, readFile, createFile, renameFile, copyFile, moveFile, deleteFile, compressFile, decompressFile, calculateHash};