var nconf = require('nconf');
nconf.set('url', 'myshootinglog.com');

nconf.set('database', 'mongodb://localhost:27017/local');
nconf.set('collection', 'myshootinglog');