process.env.PLATFORM === 'workspace_admin' ? module.exports = require('./src') : module.exports = require('./dist');
