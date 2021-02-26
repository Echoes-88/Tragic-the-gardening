// const utils = require('./Utils/ReloadCss');

const Menu = require('./Components/Menu');
const reloadCss = require('./Utils/ReloadCss');



var app = {

init: function () {

    Menu.unLogged();
    reloadCss.init();
    // utils.reloadCss();
    // dragAndDrop.init();
},
};

document.addEventListener('DOMContentLoaded', app.init);