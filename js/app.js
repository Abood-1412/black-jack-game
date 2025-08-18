

// Card and deck setup
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
let wins = 0;
let losses = 0;
let draws = 0;

// DOM elements
const yourScoreDisplay = document.getElementById('yourscore');
const dealerScoreDisplay = document.getElementById('dealerscore');
const commandDisplay = document.getElementById('command');
const winsDisplay = document.getElementById('wins');
const lossesDisplay = document.getElementById('losses');
const drawsDisplay = document.getElementById('draws');
const yourBox = document.getElementById('your-box');
const dealerBox = document.getElementById('dealer-box');

// Initialize the game
function initGame() {
    deck = createDeck();
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;
    yourScoreDisplay.textContent = playerScore;
    dealerScoreDisplay.textContent = dealerScore;
    commandDisplay.textContent = "Let's Play";
    yourBox.querySelectorAll('img').forEach(img => img.remove());
    dealerBox.querySelectorAll('img').forEach(img => img.remove());
    document.getElementById('hit').disabled = false;
    document.getElementById('stand').disabled = false;
    document.getElementById('deal').disabled = false;
}

// Create a deck of cards
function createDeck() {
    const deck = [];
    for (let suit of suits) {
        for (let value of values) {
            deck.push({ suit, value });
        }
    }
    return shuffle(deck);
}

// Shuffle the deck
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}

// Deal initial cards
function deal() {
    initGame();
    playerHand.push(deck.pop(), deck.pop());
    dealerHand.push(deck.pop(), deck.pop());
    showCards(); // Show cards immediately after dealing
    updateScores();
}

// Show card images
function showCards() {
    yourBox.querySelectorAll('img').forEach(img => img.remove());
    dealerBox.querySelectorAll('img').forEach(img => img.remove());

    for (let card of playerHand) {
        const img = document.createElement('img');
        img.src = getCardImage(card); // Get the correct image path
        yourBox.appendChild(img);
    }
    for (let card of dealerHand) {
        const img = document.createElement('img');
        img.src = getCardImage(card); // Get the correct image path
        dealerBox.appendChild(img);
    }
}

// Get the correct image path for a given card
function getCardImage(card) {
    // Map suit names to initials for file naming
    const suitMapping = {
        'Hearts': 'H',
        'Diamonds': 'D',
        'Clubs': 'C',
        'Spades': 'S'
    };

    // Construct the card identifier (e.g., '2C', 'AH')
    const suitInitial = suitMapping[card.suit]; // Get the suit initial
    return `./static/${card.value}${suitInitial}.png`; // Return the path to the image
}

// Update scores and display
function updateScores() {
    playerScore = calculateScore(playerHand);
    dealerScore = calculateScore(dealerHand);
    yourScoreDisplay.textContent = playerScore;
    dealerScoreDisplay.textContent = dealerScore;

    if (playerScore === 21) {
        commandDisplay.textContent = "Blackjack! You win!";
        wins++;
        winsDisplay.textContent = wins;
        endGame();
    } else if (playerScore > 21) {
        commandDisplay.textContent = "You bust! Dealer wins!";
        losses++;
        lossesDisplay.textContent = losses;
        endGame();
    }
}

// Calculate score
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    for (let card of hand) {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else if (['K', 'Q', 'J'].includes(card.value)) {
            score += 10;
        } else {
            score += parseInt(card.value);
        }
    }

    while (score > 21 && aces) {
        score -= 10;
        aces--;
    }

    return score;
}

// Hit function
function hit() {
    if (playerScore < 21) {
        playerHand.push(deck.pop());
        showCards();
        updateScores();
    }
}

// Stand function
function stand() {
    while (dealerScore < 17) {
        dealerHand.push(deck.pop());
        dealerScore = calculateScore(dealerHand);
        showCards();
    }
    dealerScoreDisplay.textContent = dealerScore;

    if (dealerScore > 21) {
        commandDisplay.textContent = "Dealer busts! You win!";
        wins++;
        winsDisplay.textContent = wins;
    } else if (dealerScore > playerScore) {
        commandDisplay.textContent = "Dealer wins!";
        losses++;
        lossesDisplay.textContent = losses;
    } else if (dealerScore < playerScore) {
        commandDisplay.textContent = "You win!";
        wins++;
        winsDisplay.textContent = wins;
    } else {
        commandDisplay.textContent = "It's a draw!";
        draws++;
        drawsDisplay.textContent = draws;
    }
    endGame();
}

// End game function
function endGame() {
    document.getElementById('hit').disabled = true;
    document.getElementById('stand').disabled = true;
    document.getElementById('deal').disabled = false;
}

// Reset game function
function reset() {
    wins = 0;
    losses = 0;
    draws = 0;
    winsDisplay.textContent = wins;
    lossesDisplay.textContent = losses;
    drawsDisplay.textContent = draws;
    initGame();
}

// Event listeners
document.getElementById('deal').addEventListener('click', deal);
document.getElementById('hit').addEventListener('click', hit);
document.getElementById('stand').addEventListener('click', stand);
document.getElementById('reset').addEventListener('click', reset);
document.addEventListener('DOMContentLoaded', initGame);