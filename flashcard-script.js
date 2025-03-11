let flashcards = [];
let currentCard = null;
let cardIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
    const checkedSubs = document.querySelectorAll('input[type="checkbox"][data-file]');
    checkedSubs.forEach(sub => {
        sub.addEventListener('change', loadFlashcards);
    });

    loadFlashcards();
});

function loadFlashcards() {
    flashcards = [];
    const checkedSubs = document.querySelectorAll('input[type="checkbox"]:checked[data-file]');
    if (checkedSubs.length === 0) return;

    const promises = Array.from(checkedSubs).map(sub => {
        const file = sub.getAttribute('data-file');
        return fetch(file)
            .then(response => {
                if (!response.ok) return []; // Skip if file doesn’t exist
                return response.text();
            })
            .then(text => {
                if (!text) return; // Skip if no content
                const script = document.createElement('script');
                script.text = text;
                document.body.appendChild(script);
                document.body.removeChild(script);
                flashcards = flashcards.concat(window.flashcardData || []);
            })
            .catch(() => []); // Silently ignore fetch errors (e.g., file not found)
    });

    Promise.all(promises).then(() => {
        if (flashcards.length > 0) showNextCard();
    });
}

function showNextCard() {
    const container = document.getElementById('flashcard-container');
    if (flashcards.length === 0) {
        container.innerHTML = '<div class="completed-box">You are all set for today!</div>';
        return;
    }

    cardIndex = Math.floor(Math.random() * flashcards.length);
    currentCard = flashcards[cardIndex];
    container.innerHTML = `
        <div class="flashcard">
            <div class="card">
                <div class="back">${currentCard.back}</div>
                <div class="front"><img src="../images/${currentCard.front}" alt="Flashcard Image" style="max-width: 100%; max-height: 100%;"></div>
            </div>
        </div>
    `;
}

document.getElementById('flip-btn').addEventListener('click', () => {
    const card = document.querySelector('.card');
    card.classList.toggle('flipped');
});

document.getElementById('next-btn').addEventListener('click', () => {
    flashcards.splice(cardIndex, 1);
    showNextCard();
});
