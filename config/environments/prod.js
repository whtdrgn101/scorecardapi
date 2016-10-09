var nconf = require('nconf');
nconf.set('url', 'myshootinglog.com');

nconf.set('database', 'mongodb://localhost:27017/local');
nconf.set('collection', 'myshootinglog');
nconf.set('authKeyFile', 'authkey');
nconf.set('mysql-host', 'localhost'),
nconf.set('mysql-user', 'scorecard');
nconf.set('mysql-password', 'F3e_q7ne');
nconf.set('mysql-database', 'myshootinglog');