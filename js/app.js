// cards suits and values
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];

let playerHand = [];
let dealerHand = [];

let playerScore = 0;
let dealerScore = 0;

let isGameOver = false;
let playerStand = false;
let winner = null;

let playerCardsEl;
let dealerCardsEl;
let playerScoreEl;
let dealerScoreEl;
let messageEl;
let hitBtn;
let standBtn;
let newGameBtn;


//1. createDeck function

function createDeck() {
  deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < values.length; j++) {
      deck.push({ suit: suits[i], value: values[j] });
    }
  }
}
//2. shuffleDeck function

function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;

}
//3. dealinisialCards function

function dealinisialCards() {
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
}
/*document.addEventListener('DOMContentLoaded', () => {
  game.ui.playerCardsEl = document.getElementById('player-cards');
  game.ui.dealerCardsEl = document.getElementById('dealer-cards');
  game.ui.playerScoreEl = document.getElementById('player-score');
  game.ui.dealerScoreEl = document.getElementById('dealer-score');
  game.ui.messageEl = document.getElementById('message');
  game.ui.hitBtn = document.getElementById('hit-btn');
  game.ui.standBtn = document.getElementById('stand-btn');
  game.ui.newGameBtn = document.getElementById('new-game-btn');

  game.ui.hitBtn.addEventListener('click', () => {
    if (!game.isGameOver) {
      hit();
    }
  });

  game.ui.standBtn.addEventListener('click', () => {
    if (!game.isGameOver) {
      stand();
    }
  });

  game.ui.newGameBtn.addEventListener('click', () => {
    startNewGame();
  });

  startNewGame();
});

function createDeck() {
  game.deck = [];
  for (const suit of game.suits) {
    for (const value of game.values) {
      game.deck.push({ suit, value });
    }
  }
}
*/
