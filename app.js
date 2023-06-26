const http = require('http');
require('dotenv').config();
const readline = require('readline');

const { changeDirectory, listDirectory, readFile, createFile, renameFile, copyFile, moveFile, compressFile, decompressFile, deleteFile, calculateHash } = require('./file-functions.js');

const {getEOL, getCPUArchitecture, getCPUsInfo, getHomeDirectory, getUsername} = require('./os-functions.js');

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

const username = process.argv.slice(2).find(arg => arg.startsWith('--username=')).split('=')[1];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
});

server.listen(port, hostname, () => {
  if (username) { 
    console.log(`Welcome to the File Manager, ${username}!`);
  } else {
    console.log('Welcome to the File Manager, anonymous!');
  } 

  printCurrentDirectory();

  start();
}); 


function start() {
  rl.question('> ', (input) => {
    if (input === '.exit') {
      if (username) {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
      } else {
        console.log('Thank you for using File Manager, goodbye!');
      } 
      rl.close();
      process.exit();
    } else {
      handleCommand(input);
      start();
    }
  });
}

process.on('SIGINT', () => {  
  if (username) {
    console.log(`Thank you for using File Manager, ${username}, goodbye!`);
  } else {
    console.log('Thank you for using File Manager, goodbye!');
  }
  process.exit(); 
});

function printCurrentDirectory() {
  console.log(`You are currently in ${process.cwd()}`);
}

function handleInvalidInput() {
  console.log('Invalid input.');
}

function goUp() {
  const currentPath = process.cwd();
  const parentPath = path.dirname(currentPath);

  if (parentPath !== currentPath) {
    process.chdir(parentPath);
  }
  printCurrentDirectory();
}

function handleCommand(input) {
  const [command, ...args] = input.trim().split(' ');

  switch (command) {
    case 'up':
      goUp();
      break;
    case 'cd':
      changeDirectory(args[0]);
      break;
    case 'ls':
      listDirectory();
      break;
    case 'cat':
      readFile(args[0]);
      break;
    case 'add':
      createFile(args[0]);
      break;
    case 'rn':
      renameFile(args[0], args[1]);
      break;
    case 'cp':
      copyFile(args[0], args[1]);
      break;
    case 'mv':
      moveFile(args[0], args[1]);
      break;
    case 'rm':
      deleteFile(args[0]);
      break;
    case 'os':
      handleOSCommand(args);
      break;
    case 'hash':
      calculateHash(args[0]);
      break;
    case 'compress':
      compressFile(args[0], args[1]);
      break;
    case 'decompress':
      decompressFile(args[0], args[1]);
      break;
    default:
      handleInvalidInput();
      break;
  }
}

function handleOSCommand(args) {
  const subCommand = args[0];

  switch (subCommand) {
    case '--EOL':
      getEOL();
      break;
    case '--cpus':
      getCPUsInfo();
      break;
    case '--homedir':
      getHomeDirectory();
      break;
    case '--username':
      getUsername();
      break;
    case '--architecture':
      getCPUArchitecture();
      break;
    default:
      handleInvalidInput();
      break;
  }
}