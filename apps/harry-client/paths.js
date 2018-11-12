const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
  src: resolveApp('src'),
  build: resolveApp('build'),
  html: resolveApp('public/index.html'),
  dumbledore: fs.realpathSync(path.join('./node_modules/@hp/dumbledore')),
};