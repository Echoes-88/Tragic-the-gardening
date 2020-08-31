const eventListener = require('./eventListener');

var app = {

init: function () {

    eventListener.main();
},
};
document.addEventListener('DOMContentLoaded', app.init);