const path = require('path');
const copyFileJS = require('./copy-files');

copyFileJS({
  packageExtraOptions: {
    types: './index.d.ts'
  },
  targetPackageJson: path.resolve('./src/package.json'),
  targetFiles: [path.resolve('./README.md')],
  outdir: path.resolve('./dist'),
});
