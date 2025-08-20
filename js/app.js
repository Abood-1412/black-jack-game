// Blackjack Game Logic
const BJgame = {
    players: { // useing nested objects for players
        you: { scoreSpan: '#yourscore', div: '#your-box', score: 0 },
        dealer: { scoreSpan: '#dealerscore', div: '#dealer-box', score: 0, visibleScore: 0 }
    },
    cards: [
        '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'KC', 'QC', 'JC', 'AC',
        '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'KD', 'QD', 'JD', 'AD',
        '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'KH', 'QH', 'JH', 'AH',
        '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'KS', 'QS', 'JS', 'AS'
    ],
    cardsMap: {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 
        'K': 10, 'Q': 10, 'J': 10, 'A': [1, 11]
    },
    wins: 0,
    losses: 0,
    draws: 0,
    gameInProgress: false,
    dealerTurn: false,
    dealerHidden: [] // Empty Array to Track all dealer's hidden cards
};
// Destructure players for easier access
const { you: You, dealer: Dealer } = BJgame.players;

// Sound Effects - You can replace these URLs with local file paths
const soundEffects = {
    hitSound: new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'),
    standSound: new Audio('https://www.soundjay.com/misc/sounds/typewriter-key-1.wav'),
    dealSound: new Audio('https://www.soundjay.com/misc/sounds/shuffle-cards.wav'),
    resetSound: new Audio('https://www.soundjay.com/misc/sounds/button-10.wav'),
    cardFlip: new Audio('https://www.soundjay.com/misc/sounds/paper-flip-01.wav'),
    winSound: new Audio('https://www.soundjay.com/misc/sounds/ta-da.wav'),
    loseSound: new Audio('https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav'),
    bustSound: new Audio('https://www.soundjay.com/misc/sounds/beep-28.wav')
};

// Alternative: Create simple beep sounds programmatically if external sounds don't work
function createBeepSound(frequency, duration) {
    const audioContext = new (window.AudioContext || window.AudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

// Fallback sound functions if external audio files don't load
const fallbackSounds = {
    hit: () => createBeepSound(800, 0.2),
    stand: () => createBeepSound(600, 0.3),
    deal: () => createBeepSound(400, 0.5),
    reset: () => createBeepSound(300, 0.4),
    cardFlip: () => createBeepSound(700, 0.15),
    win: () => {
        createBeepSound(523, 0.2);
        setTimeout(() => createBeepSound(659, 0.2), 100);
        setTimeout(() => createBeepSound(784, 0.3), 200);
    },
    lose: () => createBeepSound(200, 0.5),
    bust: () => createBeepSound(150, 0.8)
};

// Function to play sound with fallback
function playSound(soundName) {
    try {
        switch(soundName) {
            case 'hit':
                soundEffects.hitSound.currentTime = 0;
                soundEffects.hitSound.play().catch(() => fallbackSounds.hit());
                break;
            case 'stand':
                soundEffects.standSound.currentTime = 0;
                soundEffects.standSound.play().catch(() => fallbackSounds.stand());
                break;
            case 'deal':
                soundEffects.dealSound.currentTime = 0;
                soundEffects.dealSound.play().catch(() => fallbackSounds.deal());
                break;
            case 'reset':
                soundEffects.resetSound.currentTime = 0;
                soundEffects.resetSound.play().catch(() => fallbackSounds.reset());
                break;
            case 'cardFlip':
                soundEffects.cardFlip.currentTime = 0;
                soundEffects.cardFlip.play().catch(() => fallbackSounds.cardFlip());
                break;
            case 'win':
                soundEffects.winSound.currentTime = 0;
                soundEffects.winSound.play().catch(() => fallbackSounds.win());
                break;
            case 'lose':
                soundEffects.loseSound.currentTime = 0;
                soundEffects.loseSound.play().catch(() => fallbackSounds.lose());
                break;
            case 'bust':
                soundEffects.bustSound.currentTime = 0;
                soundEffects.bustSound.play().catch(() => fallbackSounds.bust());
                break;
        }
    } catch (error) {
        console.log('Sound playback failed:', error);
        // Use fallback sound
        if (fallbackSounds[soundName]) {
            fallbackSounds[soundName]();
        }
    }
}

// Card mapping for images
const cardImageMap = {
    '2C': 'https://deckofcardsapi.com/static/img/2C.png',
    '3C': 'https://deckofcardsapi.com/static/img/3C.png',
    '4C': 'https://deckofcardsapi.com/static/img/4C.png',
    '5C': 'https://deckofcardsapi.com/static/img/5C.png',
    '6C': 'https://deckofcardsapi.com/static/img/6C.png',
    '7C': 'https://deckofcardsapi.com/static/img/7C.png',
    '8C': 'https://deckofcardsapi.com/static/img/8C.png',
    '9C': 'https://deckofcardsapi.com/static/img/9C.png',
    '10C': 'https://deckofcardsapi.com/static/img/0C.png',
    'JC': 'https://deckofcardsapi.com/static/img/JC.png',
    'QC': 'https://deckofcardsapi.com/static/img/QC.png',
    'KC': 'https://deckofcardsapi.com/static/img/KC.png',
    'AC': 'https://deckofcardsapi.com/static/img/AC.png',
    '2D': 'https://deckofcardsapi.com/static/img/2D.png',
    '3D': 'https://deckofcardsapi.com/static/img/3D.png',
    '4D': 'https://deckofcardsapi.com/static/img/4D.png',
    '5D': 'https://deckofcardsapi.com/static/img/5D.png',
    '6D': 'https://deckofcardsapi.com/static/img/6D.png',
    '7D': 'https://deckofcardsapi.com/static/img/7D.png',
    '8D': 'https://deckofcardsapi.com/static/img/8D.png',
    '9D': 'https://deckofcardsapi.com/static/img/9D.png',
    '10D': 'https://deckofcardsapi.com/static/img/0D.png',
    'JD': 'https://deckofcardsapi.com/static/img/JD.png',
    'QD': 'https://deckofcardsapi.com/static/img/QD.png',
    'KD': 'https://deckofcardsapi.com/static/img/KD.png',
    'AD': 'https://deckofcardsapi.com/static/img/AD.png',
    '2H': 'https://deckofcardsapi.com/static/img/2H.png',
    '3H': 'https://deckofcardsapi.com/static/img/3H.png',
    '4H': 'https://deckofcardsapi.com/static/img/4H.png',
    '5H': 'https://deckofcardsapi.com/static/img/5H.png',
    '6H': 'https://deckofcardsapi.com/static/img/6H.png',
    '7H': 'https://deckofcardsapi.com/static/img/7H.png',
    '8H': 'https://deckofcardsapi.com/static/img/8H.png',
    '9H': 'https://deckofcardsapi.com/static/img/9H.png',
    '10H': 'https://deckofcardsapi.com/static/img/0H.png',
    'JH': 'https://deckofcardsapi.com/static/img/JH.png',
    'QH': 'https://deckofcardsapi.com/static/img/QH.png',
    'KH': 'https://deckofcardsapi.com/static/img/KH.png',
    'AH': 'https://deckofcardsapi.com/static/img/AH.png',
    '2S': 'https://deckofcardsapi.com/static/img/2S.png',
    '3S': 'https://deckofcardsapi.com/static/img/3S.png',
    '4S': 'https://deckofcardsapi.com/static/img/4S.png',
    '5S': 'https://deckofcardsapi.com/static/img/5S.png',
    '6S': 'https://deckofcardsapi.com/static/img/6S.png',
    '7S': 'https://deckofcardsapi.com/static/img/7S.png',
    '8S': 'https://deckofcardsapi.com/static/img/8S.png',
    '9S': 'https://deckofcardsapi.com/static/img/9S.png',
    '10S': 'https://deckofcardsapi.com/static/img/0S.png',
    'JS': 'https://deckofcardsapi.com/static/img/JS.png',
    'QS': 'https://deckofcardsapi.com/static/img/QS.png',
    'KS': 'https://deckofcardsapi.com/static/img/KS.png',
    'AS': 'https://deckofcardsapi.com/static/img/AS.png'
};

// Card back image for hidden cards
const cardBackImage = 'https://deckofcardsapi.com/static/img/back.png';

// Initialize deck
function initializeDeck() {
    BJgame.cards = [
        '2C', '3C', '4C', '5C', '6C', '7C', '8C', '9C', '10C', 'KC', 'QC', 'JC', 'AC',
        '2D', '3D', '4D', '5D', '6D', '7D', '8D', '9D', '10D', 'KD', 'QD', 'JD', 'AD',
        '2H', '3H', '4H', '5H', '6H', '7H', '8H', '9H', '10H', 'KH', 'QH', 'JH', 'AH',
        '2S', '3S', '4S', '5S', '6S', '7S', '8S', '9S', '10S', 'KS', 'QS', 'JS', 'AS'
    ];
    // Shuffle the deck ( Fisher-Yates shuffle algorithm )
    for (let i = BJgame.cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [BJgame.cards[i], BJgame.cards[j]] = [BJgame.cards[j], BJgame.cards[i]];
    }
}

function drawCard(activePlayer) {
    if (BJgame.cards.length === 0) {
        initializeDeck();
    }
    
    const currentCardIdx = Math.floor(Math.random() * BJgame.cards.length);
    const [currentCard] = BJgame.cards.splice(currentCardIdx, 1);
    
    let cardImage = document.createElement('img');
    
    // Hide ALL dealer cards until dealer's turn
    if (activePlayer === Dealer && !BJgame.dealerTurn) {
        cardImage.src = cardBackImage;
        cardImage.alt = 'hidden';
        cardImage.dataset.actualCard = currentCard; // Store the actual card
        BJgame.dealerHidden.push(currentCard);
    } else {
        cardImage.src = cardImageMap[currentCard];
        cardImage.alt = currentCard;
        // Only update score for visible cards
        updateScore(currentCard, activePlayer);
        showScore(activePlayer);
    }
    
    cardImage.style.opacity = '0';
    cardImage.style.transform = 'translateY(-20px)';
    document.querySelector(activePlayer.div).appendChild(cardImage);
    
    // Play card flip sound
    playSound('cardFlip');
    
    // Animate card appearance
    setTimeout(() => {
        cardImage.style.transition = 'all 0.5s ease';
        cardImage.style.opacity = '1';
        cardImage.style.transform = 'translateY(0)';
    }, 100);
    
    // Show dealer's score as hidden during player's turn
    if (activePlayer === Dealer && !BJgame.dealerTurn) {
        showDealerHiddenScore();
    }
    
    return currentCard;
}

function updateScore(currentCard, activePlayer) {
    const cardValue = currentCard.replace(/[CDHS]/g, ''); // Remove suit
    if (cardValue === 'A') {
        // Handle Ace - choose 1 or 11 based on current score
        activePlayer.score += (activePlayer.score + BJgame.cardsMap[cardValue][1] <= 21) ? 
            BJgame.cardsMap[cardValue][1] : 
            BJgame.cardsMap[cardValue][0];
    } else {
        activePlayer.score += BJgame.cardsMap[cardValue];
    }
}

function showScore(activePlayer) {
    const scoreDisplay = document.querySelector(activePlayer.scoreSpan);
    if (activePlayer.score > 21) {
        scoreDisplay.textContent = 'BUST!';
        scoreDisplay.className = 'bust';
        if (activePlayer === You) {
            playSound('bust');
        }
    } else if (activePlayer.score === 21) {
        scoreDisplay.textContent = '21!';
        scoreDisplay.className = 'blackjack';
    } else {
        scoreDisplay.textContent = activePlayer.score;
        scoreDisplay.className = '';
    }
}

function showDealerHiddenScore() {
    const scoreDisplay = document.querySelector(Dealer.scoreSpan);
    scoreDisplay.textContent = '?';
    scoreDisplay.className = '';
}

function revealAllDealerCards() {
    // Process all hidden cards and add to dealer's score
    BJgame.dealerHidden.forEach(hiddenCard => {
        updateScore(hiddenCard, Dealer);
    });
    
    // Update all card images to show actual cards
    const dealerImages = document.querySelectorAll('#dealer-box img');
    dealerImages.forEach((img, index) => {
        if (img.alt === 'hidden') {
            const actualCard = img.dataset.actualCard;
            img.src = cardImageMap[actualCard];
            img.alt = actualCard;
            
            // Add flip animation with staggered timing
            img.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                img.style.transition = 'transform 0.6s ease';
                img.style.transform = 'rotateY(0deg)';
                playSound('cardFlip'); // Play flip sound for each card
            }, index * 200); // Stagger the reveal animation
        }
    });
    
    // Clear hidden cards array
    BJgame.dealerHidden = [];
    
    // Show dealer's actual score
    setTimeout(() => {
        showScore(Dealer);
    }, dealerImages.length * 200 + 300); // Wait for all cards to flip
}

function findWinner() {
    if (You.score > 21) {
        BJgame.losses++;
        return 'dealer';
    }
    if (Dealer.score > 21) {
        BJgame.wins++;
        return 'player';
    }
    if (Dealer.score > You.score) {
        BJgame.losses++;
        return 'dealer';
    }
    if (You.score > Dealer.score) {
        BJgame.wins++;
        return 'player';
    }
    BJgame.draws++;
    return 'draw';
}

function showResults(winner) {
    const resultText = document.querySelector('#command');
    
    if (winner === 'player') {
        resultText.textContent = 'You Won!';
        resultText.style.color = 'green';
        playSound('win');
    } else if (winner === 'dealer') {
        resultText.textContent = "You Lost!";
        resultText.style.color = 'red';
        playSound('lose');
    } else {
        resultText.textContent = 'Draw!';
        resultText.style.color = 'orange';
    }
    
    updateScoreboard();
}

function updateScoreboard() {
    document.querySelector('#wins').textContent = BJgame.wins;
    document.querySelector('#losses').textContent = BJgame.losses;
    document.querySelector('#draws').textContent = BJgame.draws;
}

function clearCards() {
    document.querySelectorAll('#your-box img, #dealer-box img').forEach(img => {
        img.style.transition = 'all 0.3s ease';
        img.style.opacity = '0';
        img.style.transform = 'translateY(-20px)';
        setTimeout(() => img.remove(), 300);
    });
}

function resetGame() {
    You.score = 0;
    Dealer.score = 0;
    Dealer.visibleScore = 0;
    BJgame.gameInProgress = false;
    BJgame.dealerTurn = false;
    BJgame.dealerHidden = [];
    
    showScore(You);
    
    // Reset dealer score display
    const dealerScoreDisplay = document.querySelector(Dealer.scoreSpan);
    dealerScoreDisplay.textContent = '0';
    dealerScoreDisplay.className = '';
    
    document.querySelector('#command').textContent = "Let's Play";
    document.querySelector('#command').style.color = 'black';
    
    // Enable buttons
    document.querySelector('#hit').disabled = false;
    document.querySelector('#stand').disabled = false;
    document.querySelector('#deal').disabled = false;
}

// Automated dealer logic
function dealerPlay() {
    BJgame.dealerTurn = true;
    
    // First reveal all dealer's cards
    revealAllDealerCards();
    
    // Wait for reveal animation to complete before dealer starts playing
    setTimeout(() => {
        const dealerInterval = setInterval(() => {
            if (Dealer.score < 17) {
                drawCard(Dealer); // Now cards will be visible since dealerTurn = true
                if (Dealer.score >= 17 || Dealer.score > 21) {
                    clearInterval(dealerInterval);
                    setTimeout(() => {
                        const winner = findWinner();
                        showResults(winner);
                        BJgame.gameInProgress = false;
                        BJgame.dealerTurn = false;
                        // Disable hit and stand buttons after game ends
                        document.querySelector('#hit').disabled = true;
                        document.querySelector('#stand').disabled = true;
                    }, 1000);
                }
            } else {
                clearInterval(dealerInterval);
                setTimeout(() => {
                    const winner = findWinner();
                    showResults(winner);
                    BJgame.gameInProgress = false;
                    BJgame.dealerTurn = false;
                    // Disable hit and stand buttons after game ends
                    document.querySelector('#hit').disabled = true;
                    document.querySelector('#stand').disabled = true;
                }, 1000);
            }
        }, 1500); // Dealer draws a card every 1.5 seconds
    }, 1500); // Wait for card reveal animations to complete
}

// Event Listeners with Sound Effects
document.querySelector('#hit').addEventListener('click', () => {
    if (!BJgame.gameInProgress || BJgame.dealerTurn) return;
    
    playSound('hit'); // Play hit sound
    
    drawCard(You);
    
    if (You.score > 21) {
        setTimeout(() => {
            revealAllDealerCards(); // Reveal dealer cards even if player busts
            setTimeout(() => {
                const winner = findWinner();
                showResults(winner);
                BJgame.gameInProgress = false;
                BJgame.dealerTurn = false;
                document.querySelector('#hit').disabled = true;
                document.querySelector('#stand').disabled = true;
            }, 1500);
        }, 1000);
    } else if (You.score === 21) {
        setTimeout(() => {
            dealerPlay();
        }, 1000);
    }
});

document.querySelector('#stand').addEventListener('click', () => {
    if (!BJgame.gameInProgress || BJgame.dealerTurn) return;
    
    playSound('stand'); // Play stand sound
    
    document.querySelector('#hit').disabled = true;
    document.querySelector('#stand').disabled = true;
    
    setTimeout(() => {
        dealerPlay();
    }, 500);
});

document.querySelector('#deal').addEventListener('click', () => {
    if (BJgame.gameInProgress) return;
    
    playSound('deal'); // Play deal sound
    
    clearCards();
    setTimeout(() => {
        resetGame();
        initializeDeck();
        
        // Deal initial cards - ALL dealer cards are hidden
        drawCard(You);
        setTimeout(() => drawCard(Dealer), 300); // Hidden
        setTimeout(() => drawCard(You), 600);
        setTimeout(() => {
            drawCard(Dealer); // Also hidden
            BJgame.gameInProgress = true;
            
            // Check for natural blackjack (only check player since all dealer cards are hidden)
            if (You.score === 21) {
                setTimeout(() => {
                    dealerPlay(); // This will reveal all dealer cards
                }, 1000);
            }
        }, 900);
    }, 500);
});

document.querySelector('#reset').addEventListener('click', () => {
    playSound('reset'); // Play reset sound
    
    BJgame.wins = 0;
    BJgame.losses = 0;
    BJgame.draws = 0;
    updateScoreboard();
    clearCards();
    setTimeout(() => resetGame(), 500);
});

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeDeck();
    resetGame();
});