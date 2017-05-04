var page = require('page');
require('./js/routes/recently-added.js')();
require('./js/routes/episode.js')();

page({
  click: false
});
