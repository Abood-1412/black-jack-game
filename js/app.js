/*----------------- Blackjack Game -----------------*/
/*-----------------Variables-----------------*/

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let wins = 0;
let losses = 0;
let draws = 0;
let gameOver = false;

/* -------------- Helper Functions -------------- */
// function to create and loop over the deck of cards
function createDeck() {
   const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
   const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
   deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    shuffleDeck();

}
// Function to shuffle the deck( Fisher–Yates algorithm )
function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    // pickes a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));
    // swaps the elements at i and j
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function dealinitialCards() {
    playerHand = [deck.pop(), deck.pop()]; // Dealing 2 cards to the player
    dealerHand = [deck.pop(), deck.pop()]; // Dealing 2 cards to the dealer
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
   // updateScores();
    //renderHands();
    //checkForBlackjack();
}

function calculatehandValue(hand) {
  // Creating variable to hold the value of the hand
  let value = 0;
  let aces = 0;
  let card = null;
  for (card of hand) {
    if (card.value === 'Jack' || card.value === 'Queen' || card.value === 'King') {
      value += 10; 
    }
    else if (card.value === 'Ace') {
      value += 11;
      aces += 1;
    }
    else {
      value += parseInt(card.value);
    }
  }
  while (value > 21 && aces > 0) {
    value -= 10; // convert the vslue of an Ace from 11 to 1
    aces -= 1;
  }
  return value;
}

function updateScores() {
  document.getElementById('myScore').textContent = playerScore;
  document.getElementById('dealerscore').textContent = dealerScore;
  // optional effect is to update the displayed cards

}

function playerHit() {
  if (gameOver) return; // prevent hitting if the game ended
}

/* Remaining functions:

f) playerHit()

    Player draws one card (pop deck, push to playerHand)

    Update score and UI

    Check if player busts (score > 21) → end round with loss

g) playerStand()

    Player ends turn; dealer’s turn begins

    Dealer draws cards according to blackjack rules (hit until score ≥ 17)

    Update UI after each dealer draw

    Determine winner and update scoreboard

h) determineWinner()

    Compare playerScore and dealerScore, considering busts

    Update wins/losses/draws counters and display in table

    Update command span with game result message

i) resetGame()

    Reset all variables and UI to initial state

    Ready for new round.
*/