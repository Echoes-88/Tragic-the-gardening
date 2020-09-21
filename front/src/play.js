const utils = require('./utils');
const cardGenerator = require('./cardGenerator');

const play = {

    launchGame: function(deck) {

        // CLEAR DISPLAY
        utils.clearEverything();

        utils.createBoardGame();

        cardGenerator.createDeck('cpter-deck');
        // utils.insertPlayerCards();


    }


}

module.exports = play;