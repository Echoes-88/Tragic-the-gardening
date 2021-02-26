var reloadCss = {

    init: function() {

    var link = document.getElementById("cards");

    window.onresize = function(){

        link.href += "";


     }
    },
};

module.exports = reloadCss;