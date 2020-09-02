const eventListener = require('./eventListener');

var app = {

init: function () {

    eventListener.login();
},
};
document.addEventListener('DOMContentLoaded', app.init);