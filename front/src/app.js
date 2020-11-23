// const utils = require('./Utils/ReloadCss');

const Menu = require('./Components/Menu');




var app = {

init: function () {

    Menu.unLogged();
    // utils.reloadCss();
    // dragAndDrop.init();
},
};

document.addEventListener('DOMContentLoaded', app.init);