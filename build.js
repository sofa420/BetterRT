var path = require('path');
var fs = require('fs');
var bundlefile = fs.createWriteStream(path.resolve('./','build', 'bundle.js'));
var browserify = require('browserify');
var b = browserify();
b.add('./main.js');
b.bundle().pipe(bundlefile);

fs.createReadStream('./inject/inject.js').pipe(fs.createWriteStream('./build/inject.js'));
fs.createReadStream('./inject/inject.css').pipe(fs.createWriteStream('./build/inject.css'));
fs.createReadStream('./manifest.json').pipe(fs.createWriteStream('./build/manifest.json'));

if (!fs.existsSync('./build/icons')) {
    fs.mkdirSync('./build/icons');
}

fs.createReadStream('./icons/icon16.png').pipe(fs.createWriteStream('./build/icons/icon16.png'));
fs.createReadStream('./icons/icon19.png').pipe(fs.createWriteStream('./build/icons/icon19.png'));
fs.createReadStream('./icons/icon32.png').pipe(fs.createWriteStream('./build/icons/icon32.png'));
fs.createReadStream('./icons/icon48.png').pipe(fs.createWriteStream('./build/icons/icon48.png'));
fs.createReadStream('./icons/icon128.png').pipe(fs.createWriteStream('./build/icons/icon128.png'));
