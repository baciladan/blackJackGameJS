// These functions are more related to the UI so I did not include them in any class

function hideButtons() {
    let hitButton = document.getElementById("hit");
    let stayButton = document.getElementById("stay");
    hitButton.style.display = "none";
    stayButton.style.display = "none";
}

function displayHiddenCard() {
    let hiddenCard = document.querySelectorAll("#dealerContainer > :first-child > *");
    let hiddenCardBackground = document.querySelector("#dealerContainer > :first-child");
    hiddenCardBackground.style.backgroundColor = "white";
    for (var i = 0; i < hiddenCard.length; i++) {
        hiddenCard[i].style.display = "block";
    }
}

//Few Modifications to the Card class

class Card {
    constructor(suit, rank, value) {
        this.suit = suit;
        this.rank = rank;
        this.value = value;
    }

    // Few modifications to paint() method. It seems simpler now

    paint() {

        //Creating the elements

        let cardDiv = document.createElement("DIV");
        let cardSuit = document.createElement("DIV");
        let cardRank = document.createElement("P");
        let cardRankCopy = document.createElement("P");

        // Adding classes so we can change the element in CSS

        cardDiv.classList.add("card");
        cardDiv.classList.add("card-" + this.suit);

        // Filling the created elements with content

        if (this.suit === "hearts") {

            cardSuit.innerHTML = "&hearts;";

        } else if (this.suit === "diamonds") {

            cardSuit.innerHTML = "&diams;";

        } else if (this.suit === "clubs") {

            cardSuit.innerHTML = "&clubs;";

        } else {

            cardSuit.innerHTML = "&spades;";

        }

        cardRank.innerHTML = this.rank;
        cardRankCopy.innerHTML = this.rank;

        // Appending the created elements to the cardDiv

        cardDiv.append(cardRank, cardSuit, cardRankCopy);

        return cardDiv;
    }
}

class Deck {
    constructor() {
        this.cards = [];
    }

    createDeck() {
        let suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        let ranks = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];

        // While playing Black Jack 10 J Q K all have the value of 10
        // A Can be 1 or 11 but in this game it is always 1

        let values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < ranks.length; j++) {
                this.cards.push(new Card(suits[i], ranks[j], values[j]));
            }
        }
    }

    shuffleDeck() {
        const shuffledDeck = [];
        const unshuffledDeck = this.cards;
        while (unshuffledDeck.length) {
            var index = Math.floor(Math.random() * unshuffledDeck.length);
            shuffledDeck.push(unshuffledDeck.splice(index, 1)[0]);
        }
        this.cards = shuffledDeck;
    }
}

// Game logic is applied in the BOARD Class

class Board {

    constructor() {
        this.players = [];
    }

    start(playerOneName, playerTwoName) {

        this.players.push(new Player(playerOneName));
        this.players.push(new Player(playerTwoName));

    }

    // Play hand method that executes after each button PRESS

    playFirstHand(deck) {

        this.players[0].playerCards = deck.cards.splice(0, 2);
        this.players[1].playerCards = deck.cards.splice(0, 2);

    }

    printFirstHand() {
        this.players[1].paintCards(playerContainer);
        this.players[0].paintCards(dealerContainer);
    }

    // playerHits and playerStays are gameBoard methods as they use all the other objects created such as players, deck and cards

    playerHits(deck) {

        let dealerContainer = document.getElementById("dealerContainer");
        let playerContainer = document.getElementById("playerContainer");
        let resultContainer = document.getElementById("resultContainer");

        this.players[1].hit(deck);
        if (this.players[1].calculateTotal() < 21) {
        } else if (this.players[1].calculateTotal() === 21) {
            hideButtons();
            resultContainer.innerHTML = "BLACK JACK FOR PLAYER <br>";
            let totalDealer = this.players[0].calculateTotal();
            while (totalDealer < 17) {
                this.players[0].hit(deck);
                totalDealer = this.players[0].calculateTotal();
            }
            if (totalDealer === 21) {
                resultContainer.innerHTML = resultContainer.innerHTML + "IT'S A DRAW";
                this.players[0].paintCards(dealerContainer);
                displayHiddenCard();
            } else if (totalDealer > 21) {
                resultContainer.innerHTML = resultContainer.innerHTML + " PLAYER WON, DEALER BUSTS";
                this.players[0].paintCards(dealerContainer);
                displayHiddenCard();
            } else if (totalDealer < 21) {
                resultContainer.innerHTML = resultContainer.innerHTML + "PLAYER WON, DEALER IS LOWER";
                this.players[0].paintCards(dealerContainer);
                displayHiddenCard();
            }
        } else if (this.players[1].calculateTotal() > 21) {
            hideButtons();
            resultContainer.innerHTML = "PLAYER BUSTED, HOUSE WON";
            displayHiddenCard();
        }
        this.players[1].paintCards(playerContainer);
    }

    playerStays(deck) {

        let dealerContainer = document.getElementById("dealerContainer");
        let resultContainer = document.getElementById("resultContainer");

        hideButtons();
        let playerScore = this.players[1].calculateTotal();
        let totalDealer = this.players[0].calculateTotal();
        while (totalDealer < 17) {
            this.players[0].hit(deck);
            totalDealer = this.players[0].calculateTotal();
        } if (totalDealer > 21) {
            resultContainer.innerHTML += "DEALER BUSTS, PLAYER WINS";
            this.players[0].paintCards(dealerContainer);
            displayHiddenCard();
        } else if (totalDealer < playerScore) {
            resultContainer.innerHTML += "PLAYER WON, CLOSER TO 21";
            this.players[0].paintCards(dealerContainer);
            displayHiddenCard();
        } else if (totalDealer > playerScore) {
            resultContainer.innerHTML += "PLAYER LOSES, DEALER IS CLOSER TO 21";
            this.players[0].paintCards(dealerContainer);
            displayHiddenCard();
        } else if (totalDealer === playerScore) {
            resultContainer.innerHTML += "IT'S A DRAW";
            this.players[0].paintCards(dealerContainer);
            displayHiddenCard();
        }
    }
}

class Player {
    constructor(name) {
        this.playerName = name;
        this.playerCards = [];
    }

    // Both the player and the dealer have the option to HIT so we made a HIT method on the Player Class
    // Player hits when he thinks it is necessary  Dealer always hits when is is lower than 17

    hit(deck) {
        this.playerCards.push(deck.cards.splice(0, 1)[0]);
    }

    calculateTotal() {
        let total = 0;
        for (let i = 0; i < this.playerCards.length; i++) {
            total += this.playerCards[i].value
        }
        return total;
    }

    // Modifications to the paintCard() method as well
    // We send the player container as a parameter as we want to be able to display the cards in different containers for each player

    paintCards(playerContainer) {
        let allCards = '';
        playerContainer.innerHTML = "";
        for (let i = 0; i < this.playerCards.length; i++) {
            allCards += this.playerCards[i].paint();
            playerContainer.append(this.playerCards[i].paint());
        }
    }
}


// Main Function

// In the main function I tried to keep it as simple as possible and only use the objects and methods defined so far
// Without Applying more game logic or conditions
// This function only listens to player input

window.addEventListener("load", function () {

    // Buttons
    let hitButton = document.getElementById("hit");
    let stayButton = document.getElementById("stay");
    let restartButton = document.getElementById("restartButton");

    // Creating a new gameBoard (STEP 1)
    var gameBoard = new Board();

    // Starting a new Game (STEP 2)
    gameBoard.start('Dealer', 'Player');

    // Creating and shuffeling the deck (STEP 3)
    var deck = new Deck();

    deck.createDeck();
    deck.shuffleDeck();

    // Playing the first hand (STEP 4)

    gameBoard.playFirstHand(deck);

    // Painting initial cards (STEP 5)

    gameBoard.printFirstHand();

    // Applying functions for hit / stay (STEP 6 / 7 deppending on player choices)

    hitButton.addEventListener("click", function () { gameBoard.playerHits(deck) });

    stayButton.addEventListener("click", function () { gameBoard.playerStays(deck) });

    restartButton.addEventListener("click", function () { window.location.reload(); });

})
