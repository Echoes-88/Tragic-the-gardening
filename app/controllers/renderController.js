
const renderController = {

    home: (req, res) => {

        res.render('home', {});
    },

    newGame: (req, res) => {
        res.render('newGame', {});
    }

};

module.exports= renderController;
