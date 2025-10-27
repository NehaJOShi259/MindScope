const saveBtn = document.getElementById('saveBtn');
const moodSelect = document.getElementById('mood');
const noteInput = document.getElementById('note');
const dateInput = document.getElementById('date');
const warning = document.getElementById('warning');
const entriesDiv = document.getElementById('entries');

const negativeWords = ["sad", "angry", "upset", "tired", "bad", "cry"];
const positiveWords = ["happy", "joy", "excited", "good", "grateful"];

function loadEntries() {
    const data = JSON.parse(localStorage.getItem('moodEntries')) || [];
    entriesDiv.innerHTML = '';
    data.forEach(e => {
        const div = document.createElement('div');
        div.classList.add('entry');
        div.innerHTML = `
            <h3>${e.mood}</h3>
            <p><strong>Date:</strong> ${e.date}</p>
            <p>${e.note}</p>
        `;
        entriesDiv.appendChild(div);
    });
}

function checkMoodMatch(mood, note) {
    const text = note.toLowerCase();
    if (mood === "happy") {
        return !negativeWords.some(w => text.includes(w));
    }
    if (mood === "sad") {
        return !positiveWords.some(w => text.includes(w));
    }
    return true;
}

saveBtn.addEventListener('click', () => {
    const mood = moodSelect.value;
    const note = noteInput.value.trim();
    const date = dateInput.value;

    if (!mood || !note || !date) {
        warning.textContent = "All fields are required.";
        return;
    }

    if (!checkMoodMatch(mood, note)) {
        warning.textContent = "Your note doesn't match the selected mood.";
        return;
    }

    warning.textContent = "";

    const newEntry = { mood, note, date };
    const existing = JSON.parse(localStorage.getItem('moodEntries')) || [];
    existing.push(newEntry);
    localStorage.setItem('moodEntries', JSON.stringify(existing));

    moodSelect.value = "";
    noteInput.value = "";
    dateInput.value = "";
    loadEntries();
});

loadEntries();
