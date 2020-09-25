const utils = require('./utils');
const cardGenerator = require('./cardGenerator');
const dragAndDrop = require('./dragAndDrop');

const play = {

    launchGame: async function(deck) {

        // CLEAR DISPLAY
        utils.clearEverything();

        utils.createBoardGame();

        cpterDeck = await cardGenerator.cpterDeck();
        
        console.log(cpterDeck.monsters)

        console.log(deck.monsters);

        cardGenerator.monsters(cpterDeck.monsters, 'player')
        cardGenerator.boosters(cpterDeck.boosters, 'player')

        dragAndDrop.init();


    }


}

module.exports = play;