const os = require('os');

function getEOL() {
  console.log(`EOL: ${os.EOL}`);
}

function getCPUsInfo() {
  const cpus = os.cpus();

  console.log('CPUs:');
  for (const cpu of cpus) {
    console.log(`Model: ${cpu.model}`);
    console.log(`Speed: ${cpu.speed / 1000} GHz`);
  }
}

function getHomeDirectory() {
  console.log(`Home Directory: ${os.homedir()}`);
}

function getCPUArchitecture() {
  console.log(`CPU Architecture: ${os.arch()}`);
}

function getUsername() {
  console.log(`Username: ${os.userInfo().username}`);
}

module.exports = {getEOL, getCPUArchitecture, getCPUsInfo, getHomeDirectory, getUsername};