const moodSelect = document.getElementById('mood');
const intensitySlider = document.getElementById('intensity');
const intensityValue = document.getElementById('intensity-value');
const journalInput = document.getElementById('journal');
const entryList = document.getElementById('entryList');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const ctx = document.getElementById('moodChart');

let entries = JSON.parse(localStorage.getItem('moodEntries')) || [];

intensitySlider.oninput = () => {
    intensityValue.textContent = intensitySlider.value;
};

function renderEntries() {
    entryList.innerHTML = '';
    entries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'entry';
        div.textContent = `${entry.time} - ${entry.mood} (Intensity: ${entry.intensity}) : ${entry.journal}`;
        entryList.prepend(div);
    });
}

function updateChart() {
    if (entries.length === 0) {
        ctx.style.display = "none";
        return;
    }

    ctx.style.display = "block";

    const labels = entries.map(e => e.time);
    const data = entries.map(e => e.intensity);
    const colors = entries.map(e => {
        switch(e.mood) {
            case 'Happy': return 'rgba(255, 205, 86, 0.8)';
            case 'Sad': return 'rgba(54, 162, 235, 0.8)';
            case 'Angry': return 'rgba(255, 99, 132, 0.8)';
            case 'Calm': return 'rgba(75, 192, 192, 0.8)';
            case 'Stressed': return 'rgba(153, 102, 255, 0.8)';
            case 'Excited': return 'rgba(255, 159, 64, 0.8)';
            default: return 'rgba(201, 203, 207, 0.8)';
        }
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Intensity Over Time',
                data: data,
                fill: false,
                borderColor: '#2e3a59',
                tension: 0.3,
                pointBackgroundColor: colors,
                pointRadius: 6
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, max: 10 }
            }
        }
    });
}

saveBtn.onclick = () => {
    const mood = moodSelect.value;
    const intensity = intensitySlider.value;
    const journal = journalInput.value.trim();

    if (!mood) {
        alert('Please select a mood first.');
        return;
    }

    const time = new Date().toLocaleString();
    entries.push({ time, mood, intensity, journal });
    localStorage.setItem('moodEntries', JSON.stringify(entries));

    renderEntries();
    updateChart();

    journalInput.value = '';
};

resetBtn.onclick = () => {
    if (confirm('Are you sure you want to clear all entries?')) {
        entries = [];
        localStorage.removeItem('moodEntries');
        renderEntries();
        updateChart();
    }
};

// Initial render
renderEntries();
if (entries.length) updateChart();
