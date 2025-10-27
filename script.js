const saveBtn = document.getElementById('saveBtn');
const moodSelect = document.getElementById('mood');
const noteInput = document.getElementById('note');
const dateInput = document.getElementById('date');
const warning = document.getElementById('warning');
const entriesDiv = document.getElementById('entries');
const ctx = document.getElementById('moodChart').getContext('2d');

const positiveWords = ["happy", "joy", "calm", "peace", "relaxed", "grateful"];
const negativeWords = ["sad", "angry", "upset", "tired", "bad", "stress", "cry", "mad"];
let chart;

function loadEntries() {
    const data = JSON.parse(localStorage.getItem('moodEntries')) || [];
    entriesDiv.innerHTML = '';
    data.forEach(e => {
        const div = document.createElement('div');
        div.classList.add('entry', e.mood);
        div.innerHTML = `
            <h3>${e.mood}</h3>
            <p><strong>Date:</strong> ${e.date}</p>
            <p>${e.note}</p>
        `;
        entriesDiv.appendChild(div);
    });
    updateChart(data);
}

function updateChart(data) {
    const moods = ["happy", "calm", "neutral", "sad", "angry", "stressed"];
    const counts = moods.map(m => data.filter(e => e.mood === m).length);

    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: moods,
            datasets: [{
                data: counts,
                backgroundColor: [
                    "#b6fcb6", "#c0ebff", "#dddddd", "#f9b3b3", "#ffb088", "#ffe38b"
                ]
            }]
        },
        options: {
            plugins: { legend: { position: 'bottom' } }
        }
    });
}

function checkMoodMatch(mood, note) {
    const text = note.toLowerCase();
    if (["happy", "calm"].includes(mood)) return !negativeWords.some(w => text.includes(w));
    if (["sad", "angry", "stressed"].includes(mood)) return !positiveWords.some(w => text.includes(w));
    return true;
}

saveBtn.addEventListener('click', () => {
    const mood = moodSelect.value;
    const note = noteInput.value.trim();
    const date = dateInput.value;
    const today = new Date().toISOString().split("T")[0];

    if (!mood || !note || !date) {
        warning.textContent = "All fields are required.";
        return;
    }
    if (date > today) {
        warning.textContent = "You cannot select a future date.";
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
