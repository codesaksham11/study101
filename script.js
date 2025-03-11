// Load data dynamically
const divisions = {
    "Chemistry": "data/chemistry.json",
    "Physics": "data/physics.json",
    "Biology": "data/biology.json",
    "Nepali": "data/nepali.json",
    "English": "data/english.json",
    "Math": "data/math.json"
};

let selectedCards = [];
let currentCardIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
    const subjectsDiv = document.getElementById("subjects");
    Object.keys(divisions).forEach(subject => {
        const div = document.createElement("div");
        div.className = "subject";
        div.innerHTML = `
            <input type="checkbox" class="tick-box" data-subject="${subject}">
            <span>${subject}</span>
            <div class="subdivision-list"></div>
        `;
        subjectsDiv.appendChild(div);

        div.querySelector("span").addEventListener("click", () => toggleSubdivisions(subject, div));
        div.querySelector(".tick-box").addEventListener("change", () => selectAllSubdivisions(subject, div));
    });

    document.getElementById("start-btn").addEventListener("click", startFlashcards);
    document.getElementById("back-btn").addEventListener("click", goBack);
    document.getElementById("flip-btn").addEventListener("click", flipCard);
    document.getElementById("next-btn").addEventListener("click", nextCard);
    document.getElementById("restart-btn").addEventListener("click", restart);
});

async function toggleSubdivisions(subject, div) {
    const subList = div.querySelector(".subdivision-list");
    if (subList.innerHTML) {
        subList.style.display = subList.style.display === "block" ? "none" : "block";
        return;
    }

    const response = await fetch(divisions[subject]);
    const data = await response.json();
    Object.keys(data).forEach(sub => {
        const subDiv = document.createElement("div");
        subDiv.className = "subdivision";
        subDiv.innerHTML = `
            <input type="checkbox" class="tick-box" data-subject="${subject}" data-sub="${sub}">
            <span>${sub}</span>
        `;
        subList.appendChild(subDiv);
    });
    subList.style.display = "block";
}

function selectAllSubdivisions(subject, div) {
    const isChecked = div.querySelector(".tick-box").checked;
    div.querySelectorAll(".subdivision .tick-box").forEach(box => box.checked = isChecked);
}

async function startFlashcards() {
    selectedCards = [];
    for (const subject of Object.keys(divisions)) {
        const subjectChecked = document.querySelector(`input[data-subject="${subject}"]`).checked;
        const subs = document.querySelectorAll(`input[data-subject="${subject}"][data-sub]`);
        let selectedSubs = [];
        subs.forEach(sub => {
            if (sub.checked) selectedSubs.push(sub.dataset.sub);
        });

        const response = await fetch(divisions[subject]);
        const data = await response.json();
        if (subjectChecked) {
            selectedCards.push(...Object.values(data).flat());
        } else if (selectedSubs.length > 0) {
            selectedSubs.forEach(sub => selectedCards.push(...data[sub]));
        }
    }

    if (selectedCards.length === 0) return alert("Please select at least one category!");
    
    selectedCards = shuffle(selectedCards);
    currentCardIndex = 0;
    showCard();
    document.getElementById("selection-screen").classList.add("hidden");
    document.getElementById("flashcard-screen").classList.remove("hidden");
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showCard() {
    if (currentCardIndex >= selectedCards.length) {
        document.getElementById("flashcard-screen").classList.add("hidden");
        document.getElementById("completion-screen").classList.remove("hidden");
        return;
    }

    const card = selectedCards[currentCardIndex];
    document.getElementById("card-back").innerText = card.back;
    document.getElementById("card-front").innerHTML = `<img src="images/${card.front}" alt="${card.name}">`;
    document.getElementById("flashcard").classList.remove("flipped");
}

function goBack() {
    document.getElementById("flashcard-screen").classList.add("hidden");
    document.getElementById("selection-screen").classList.remove("hidden");
}

function flipCard() {
    document.getElementById("flashcard").classList.toggle("flipped");
}

function nextCard() {
    currentCardIndex++;
    showCard();
}

function restart() {
    document.getElementById("completion-screen").classList.add("hidden");
    document.getElementById("selection-screen").classList.remove("hidden");
}
