// This file contains all the logic and game state code for the game of blackjack.
// Author(s): Christopher Kroll

// Possible Game States:
// STARTSCREEN - The game is first loaded, waiting for player to initiate a game
// NEW - New Game, cards delt
// PLAYER_TURN - The player's turn, waiting for input
// PLAYER_BUST - The player busted, waiting for input
// PLAYER_HIT - The player has asked for another card
// PLAYER_STAND - The player chose to stand, waiting for input
// PLAYER_BLACKJACK - The player got a blackjack, waiting for input from UI
// PLAYER_ISBROKE - The player is out of money
// PLAYER_PAID - The player has been paid their winnings
// DEALER_TURN - The dealer's turn
// DEALER_DRAW - The dealer is drawing another card
// DEALER_BUST - The dealer busted
// PUSH - Dealer and player are tied with dealer's hand > 17

var gameState = "STARTSCREEN",
    winnings = -1,  // Keeps track of the last player prize won.
    gameDeck;   // The deck that the dealer deals from

var suits = [
    "Clubs",
    "Diamonds",
    "Hearts",
    "Spades"
];

var ranks = [
    "Ace",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "Jack",
    "Queen",
    "King"
];

// Constructor for a card object
function Card(rank, suit, hidden) {
    this.rank = rank;
    this.suit = suit;
    this.hidden = hidden;
    
    // Set the values of the card based on rank.
    switch (this.rank) {
        case "Ace":
            this.lowValue = 1;
            this.highValue = 11;
            break;
        case "2":
            this.lowValue = 2;
            this.highValue = 2;
            break;
        case "3":
            this.lowValue = 3;
            this.highValue = 3;
            break;
        case "4":
            this.lowValue = 4;
            this.highValue = 4;
            break;
        case "5":
            this.lowValue = 5;
            this.highValue = 5;
            break;
        case "6":
            this.lowValue = 6;
            this.highValue = 6;
            break;
        case "7":
            this.lowValue = 7;
            this.highValue = 7;
            break;
        case "8":
            this.lowValue = 8;
            this.highValue = 8;
            break;
        case "9":
            this.lowValue = 9;
            this.highValue = 9;
            break;
        case "10":
            this.lowValue = 10;
            this.highValue = 10;
            break;
        case "Jack":
            this.lowValue = 10;
            this.highValue = 10;
            break;
        case "Queen":
            this.lowValue = 10;
            this.highValue = 10;
            break;
        case "King":
            this.lowValue = 10;
            this.highValue = 10;
            break;
    }
}

// Constructor for an object that represents an arbitrary number of cards.
function CardSet() {
    this.suits = suits;
    this.ranks = ranks;

    // This array represents the cards in the set.
    this.cards = [];
}
// Prototype for an object that represents an arbitrary number of cards.
CardSet.prototype = {
    shuffle: function () {
        var randomIndex,
            unshuffledSet = this.cards;     // Temporarily store the set of cards in another array.
        // Empty the original array of cards.
        this.cards = [];

        while (unshuffledSet.length > 0) {
            // Remove a random card from the unshuffled set and put it back into the original set.
            randomIndex = Math.floor(Math.random() * unshuffledSet.length);
            this.cards.push(
                unshuffledSet.splice(randomIndex, 1)[0]);
        }
    },
    addCard: function (card) {
        this.cards.push(card);
    },
    drawCard: function (hidden) {
        var card = this.cards.pop();  
        if (hidden === false) {
            card.hidden = hidden;
        }
        return card;
    },
    getHandValue: function () {
        var value = 0;
        for (var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
            value += this.cards[cardIndex].highValue;
        }
        // If the value of this set is over 21 then replace high value of cards with low value until value is 21 or less.
        if (value > 21) {
            for (var cardIndex = 0; cardIndex < this.cards.length; cardIndex++) {
                value -= this.cards[cardIndex].highValue
                value += this.cards[cardIndex].lowValue
                if (value <= 21) {
                    break;
                }
            }
        }
        return value;
    },
    isNaturalBlackjack: function () {
        // TODO: Implement
        return false;
    }
};

// A standard deck of 52 cards, based on the CardSet class
function getStandardDeck() {
    var standardDeck = new CardSet();
    for (var rankIndex = 0; rankIndex < ranks.length; rankIndex++) {
        for (var suitIndex = 0; suitIndex < suits.length; suitIndex++) {
            standardDeck.addCard(
                new Card( ranks[rankIndex], suits[suitIndex], true )
            );
        }
    }
    return standardDeck;
}

// The dealer object.
var dealer = {
    hand: new CardSet(),
    takeBet: function () {
        // Make sure this chump has enough change.
        if (player.money - player.bet < 0) {
            gameState = "PLAYER_ISBROKE";
            return false;
        }

        // Subtract the bet amount.
        player.money -= player.bet;
        return true;
    },
    startNewRound: function () {
        if (!dealer.takeBet()) {
            // Player is out of money, can't start new round.
            return;
        }

        // Clear the player and dealer's hands.
        player.hand = new CardSet();
        dealer.hand = new CardSet();

        // Create a new 52 card deck and shuffle it.
        gameDeck = getStandardDeck();
        gameDeck.shuffle();

        // Deal cards.
        dealer.hand.addCard(gameDeck.drawCard(false));
        player.hand.addCard(gameDeck.drawCard(false));
        dealer.hand.addCard(gameDeck.drawCard(true));
        player.hand.addCard(gameDeck.drawCard(false));

        gameState = "PLAYER_TURN";
    },
    hitPlayer: function () {
        gameState = "PLAYER_HIT";
        player.hand.addCard(gameDeck.drawCard(false));
    },
    checkForPlayerBust: function () {
        if( player.hand.getHandValue() > 21 ) {
            return true;
        }
        else {
            return false;
        }
    },
    checkForDealerBust: function () {
        if( dealer.hand.getHandValue() > 21 ) {
            return true;
        }
        else {
            return false;
        }
    },
    checkForPlayerBlackJack: function () {
        if( player.hand.getHandValue() === 21 ) {
            return true;
        }
        else {
            return false;
        }
    },
    givePlayerWinnings: function (amount) {
        player.money += amount;
        winnings = amount;
    },
    calculateAndGiveWinnings: function () {
        if (dealer.checkForPlayerBlackJack()) {
            dealer.givePlayerWinnings(player.bet * 2.5);
        }
        else {
            dealer.givePlayerWinnings(player.bet * 2);
        }
    },
    push: function () {
        player.money += player.bet;
    }
};

// The player object.
var player = {
    hand: new CardSet(),
    money: 100,
    bet: 10,
    stand: function () {
        gameState = "PLAYER_STAND";
    }
};

// Game State Loop.
// This code represents the finite state machine that implements the game of blackjack.
// Whenever the game requires input from the user or the user interface, the updateUI function is called.
function advanceGameState() {
    if (gameState === "STARTSCREEN") {
        // Wait for player input.
        updateUI();
    }
    else if (gameState === "NEW") {
        updateUI();
    }
    else if (gameState === "PLAYER_TURN") {
        updateUI();
    }
    else if (gameState === "PLAYER_BLACKJACK") {
        gameState = "DEALER_TURN";
        updateUI();
    }
    else if (gameState === "PLAYER_HIT") {
        if (dealer.checkForPlayerBlackJack()) {
            gameState = "PLAYER_BLACKJACK";
        }
        else if (dealer.checkForPlayerBust()) {
            // Advance to bust gamestate and wait for user input.
            gameState = "PLAYER_BUST";
        }
        else {
            // Player didn't bust return control to player.
            gameState = "PLAYER_TURN";
        }
        updateUI();
    }
    else if (gameState === "PLAYER_STAND") {
        gameState = "DEALER_TURN";
        updateUI();
    }
    else if (gameState === "DEALER_TURN") {
        // Flip hidden card
        dealer.hand.cards[1].hidden = false;

        while (!dealer.checkForDealerBust()) {
            if (dealer.hand.getHandValue() > player.hand.getHandValue()) {
                gameState = "DEALER_WON"
                break;
            }
            else if (dealer.hand.getHandValue() < 17) {
                // Dealer has a lower hand than player, and can take another card since their hand is less than 17.
                dealer.hand.addCard(gameDeck.drawCard(false));
                if (dealer.hand.getHandValue() > 21) {
                    gameState = "DEALER_BUST";
                    break;
                }
            }
            else if (dealer.hand.getHandValue() === player.hand.getHandValue()) {
                dealer.push();
                gameState = "PUSH";
                break;
            }
            else {
                // Dealer has a lower hand than player, but must stand because their hand value is 17 or higher.
                gameState = "PLAYER_WON";
                break;
            }
        }
        updateUI();
    }
    else if (gameState === "DEALER_BUST" || gameState === "PLAYER_WON") {
        dealer.calculateAndGiveWinnings();
        gameState = "PLAYER_PAID";
        updateUI();
    }
    else if (gameState === "DEALER_WON") {
        gameState = "NEW";
        updateUI();
    }
    else if (gameState === "PLAYER_PAID") {
        gameState = "NEW";
        updateUI();
    }
    else if (gameState === "PLAYER_ISBROKE") {
        updateUI();
    }
}

// Wait until the document has finished loading to start the game.
$(document).ready(function () {
    advanceGameState();
});