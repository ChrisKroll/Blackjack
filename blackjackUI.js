// This file contains the user interface code for blackjack.
// Author(s): Christopher Kroll
// Notes: This code requires jQuery.  jQuery should be reference in the html file before this file.

function updateUI() {

    // Update Cards Display
    $('#dealerHand').html(
            getCardHandHTML(dealer.hand.cards)
        );

    $('#playerHand').html(
            getCardHandHTML(player.hand.cards)
        );

    // Update Score Display
    $('#playerHandValue').text(player.hand.getHandValue());
    $('#dealerHandValue').text(dealer.hand.getHandValue());

    // Update Player Money Display
    $('#playerMoney').text(player.money);

    // Update Game State Display (TODO: Remove after debugging complete)
    $('#gameStateMessage').append("<li>" + gameState + "</li>");

    if (gameState === "STARTSCREEN") {
        $('#gameMessage').append("<li>Welcome to Blackjack!</li>");

        $('#standButton').hide();
        $('#hitButton').hide();
        $('#dealButton').show();
    }
    if (gameState === "NEW") {
        $('#gameMessage').append("<li>Press Deal button to start new round.</li>");

        $('#standButton').hide();
        $('#hitButton').hide();
        $('#dealButton').show();
    }
    if (gameState === "PUSH") {
        $('#gameMessage').append("<li>You tied the dealer.  It's a push.</li>");

        $('#standButton').hide();
        $('#hitButton').hide();
        $('#dealButton').show();
    }
    else if (gameState == "PLAYER_TURN") {
        $('#dealButton').hide();
        $('#hitButton').show();
        $('#standButton').show();
    }
    else if (gameState === "PLAYER_BUST") {
        $('#gameMessage').append("<li>You busted!</li>");

        $('#dealButton').show();
        $('#hitButton').hide();
        $('#standButton').hide();
    }
    else if (gameState === "PLAYER_BLACKJACK") {
        $('#gameMessage').append("<li>You got a blackjack!</li>");
        advanceGameState();
    }
    else if (gameState === "PLAYER_WON") {
        $('#gameMessage').append("<li>You won!</li>");

        $('#standButton').hide();
        $('#hitButton').hide();
        $('#dealButton').show();
        advanceGameState();
    }
    else if (gameState === "DEALER_TURN") {
        advanceGameState();
    }
    else if (gameState === "DEALER_BUST") {
        $('#gameMessage').append("<li>The dealer busted!</li>");
        advanceGameState();
    }
    else if (gameState === "DEALER_WON") {
        $('#gameMessage').append("<li>The dealer won.</li>");
        advanceGameState();
    }
    else if (gameState === "PLAYER_PAID") {
        $('#gameMessage').append("<li>Your winnings are " + winnings + ".</li>");
        advanceGameState();
    }
    else if (gameState === "PLAYER_ISBROKE") {
        $('#gameMessage').append("<li>You are broke! Get outta my CASINO!</li>");
    }
}

// This function creates a basic text display of the dealr/player hands.
// TODO: Replace with graphical depictions of cards.
function getCardHandHTML(cards) {
    var HTML = "<ul>";
    for (var cardIndex = 0; cardIndex < cards.length; cardIndex++) {
        if (!cards[cardIndex].hidden) {
            HTML += "<li>" + cards[cardIndex].rank + " of " + cards[cardIndex].suit + "</li>";
        }
        else {
            HTML += "<li>???</li>";
        }
    }
    HTML += "</ul>";
    return HTML;
}

/* Event Handling ***********************************************************************************************/

// Wait until the document has finished loading.
$(document).ready(function () {

    $('#dealButton').on("click", function () {
        $('#gameMessage').empty();
        
        dealer.startNewRound();

        if (gameState !== "PLAYER_ISBROKE") {
            $('#gameMessage').append("<li>New Round Started.</li>");
            $('#gameMessage').append("<li>Your bet is 10.</li>");
        }

        advanceGameState();
    });

    $('#hitButton').on("click", function () {
        dealer.hitPlayer();
        advanceGameState();
    });

    $('#standButton').on("click", function () {
        player.stand();
        advanceGameState();
    });

});

/* End of Event Handling ***********************************************************************************************/