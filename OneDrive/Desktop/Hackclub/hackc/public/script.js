class MemoryGame {
    constructor() {
        this.cards = [];
        this.flippedCards = [];
        this.matchedPairs = 0;
        this.score = 0;
        this.timer = 0;
        this.gameStarted = false;
        this.timerInterval = null;
        this.gameBoard = document.getElementById('gameBoard');
        this.difficultySelect = document.getElementById('difficulty');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.sounds = {
            flip: document.getElementById('flipSound'),
            match: document.getElementById('matchSound'),
            wrong: document.getElementById('wrongSound')
        };
        this.cardImages = [
            'images/icons8-viking-ship-100.png',     // ship
            'images/icons8-treasure-chest-100.png',   // treasure
            'images/icons8-skull-100.png',           // skull
            'images/icons8-parrot-100.png',          // parrot
            'images/icons8-map-100.png',             // map
            'images/icons8-compass-100.png',         // compass
            'images/icons8-anchor-100.png',          // anchor
            'images/icons8-sword-100.png',           // sword
            'images/icons8-cannon-100.png',          // cannon
            'images/icons8-telescope-100.png',       // telescope
            'images/icons8-mermaid-128.png',         // mermaid
            'images/icons8-octopus-100.png',         // octopus
            'images/icons8-programming-flag-100.png'  // flag
        ];
        this.initializeGame();
    }
    initializeGame() {
        this.startGame();
    }
    startGame() {
        this.resetGame();
        this.gameStarted = true;
        this.startTimer();
        this.createBoard();
    }
    resetGame() {
        this.gameBoard.innerHTML = '';
        this.matchedPairs = 0;
        this.score = 0;
        this.timer = 0;
        this.flippedCards = [];
        clearInterval(this.timerInterval);
        this.updateDisplay();
    }
    createBoard() {
        const gridSize = { cols: 6, rows: 3 };
        const pairs = (gridSize.cols * gridSize.rows) / 2;
        
        this.gameBoard.setAttribute('data-difficulty', 'easy');
        this.gameBoard.style.gridTemplateColumns = `repeat(${gridSize.cols}, 1fr)`;
        
        const shuffledImages = this.shuffleArray([...this.cardImages.slice(0, pairs), ...this.cardImages.slice(0, pairs)]);
        shuffledImages.forEach((image, index) => {
            const card = this.createCard(image);
            this.gameBoard.appendChild(card);
        });
    }
    createCard(image) {
        const card = document.createElement('div');
        card.className = 'card';
        const front = document.createElement('div');
        front.className = 'card-front';
        const back = document.createElement('div');
        back.className = 'card-back';
        const img = document.createElement('img');
        img.loading = 'lazy';
        img.src = image;
        img.alt = image.split('/').pop().split('.')[0];
        back.appendChild(img);
        card.appendChild(front);
        card.appendChild(back);
        card.addEventListener('click', () => this.flipCard(card, image));
        return card;
    }
    flipCard(card, image) {
        if (!this.gameStarted || this.flippedCards.length >= 2 || card.classList.contains('flipped')) {
            return;
        }
        this.sounds.flip.play();
        card.classList.add('flipped');
        this.flippedCards.push({ card, image });
        if (this.flippedCards.length === 2) {
            setTimeout(() => this.checkMatch(), 1000);
        }
    }
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        if (card1.image === card2.image) {
            this.sounds.match.play();
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            
            // Add fade out animation and remove cards
            setTimeout(() => {
                card1.card.style.animation = 'fadeOut 0.5s ease-out forwards';
                card2.card.style.animation = 'fadeOut 0.5s ease-out forwards';
                
                // Remove cards after animation
                setTimeout(() => {
                    card1.card.style.visibility = 'hidden';
                    card2.card.style.visibility = 'hidden';
                }, 500);
            }, 500);

            this.matchedPairs++;
            this.score += 10;
            this.createMatchParticles(card1.card);
            this.createMatchParticles(card2.card);
            this.checkWin();
        } else {
            this.sounds.wrong.play();
            card1.card.classList.add('wrong');
            card2.card.classList.add('wrong');
            setTimeout(() => {
                card1.card.classList.remove('wrong', 'flipped');
                card2.card.classList.remove('wrong', 'flipped');
            }, 1000);
            this.score = Math.max(0, this.score - 2);
        }
        this.flippedCards = [];
        this.updateDisplay();
    }
    createMatchParticles(card) {
        const particles = 5;
        const colors = ['#FFD700', '#FFA500', '#FF6347'];
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            card.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }
    checkWin() {
        const totalPairs = (this.gameBoard.children.length / 2);
        if (this.matchedPairs === totalPairs) {
            clearInterval(this.timerInterval);
            setTimeout(() => {
                alert(`Congratulations! You won!\nScore: ${this.score}\nTime: ${this.formatTime(this.timer)}`);
            }, 500);
        }
    }
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateDisplay();
        }, 1000);
    }
    updateDisplay() {
        this.scoreDisplay.textContent = this.score;
        this.timerDisplay.textContent = this.formatTime(this.timer);
    }
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}
// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});




