const BoardGame = {
    render: () => {
        
        return `
            <div class="side-and-drop">
                <div class="sideArea">
                    <button class ="endOfRound inactive">END OF ROUND</button>
                    <div class="infosField"></div>
                    <div class="infosField-bubble"></div>
                    <div class="vault-boy"></div>
                </div>
                <div class="boardArea">
                    <div class="cpterCards"></div>
                    <div class="drop-area"></div>
                </div>
            </div>
            <div class="playerArea">
                <div class="border-player-area"></div>
                <div class="playerCards"></div>
                <div class="border-player-area"></div>
            </div>
        `
    }
}

module.exports = BoardGame;