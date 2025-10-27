const saveBtn = document.getElementById("saveBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const entriesDiv = document.getElementById("entries");
const moodChartCanvas = document.getElementById("moodChart");
const moodPercentagesDiv = document.getElementById("moodPercentages");
const dateInput = document.getElementById("date");

dateInput.max = new Date().toISOString().split("T")[0];

let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];
let moodChart;

function saveEntries() {
  localStorage.setItem("moodEntries", JSON.stringify(entries));
}

function renderEntries() {
  entriesDiv.innerHTML = entries.length
    ? entries.map(e => `<p>${e.date} - ${e.mood} (Intensity: ${e.intensity}) : ${e.journal}</p>`).join("")
    : "<p>No entries yet.</p>";
  updateChart();
}

function updateChart() {
  const moodCounts = { Happy: 0, Sad: 0, Angry: 0, Calm: 0, Anxious: 0, Excited: 0 };
  entries.forEach(e => {
    const m = e.mood.charAt(0).toUpperCase() + e.mood.slice(1).toLowerCase();
    if (moodCounts[m] !== undefined) moodCounts[m]++;
  });

  const labels = Object.keys(moodCounts);
  const data = Object.values(moodCounts);
  const total = data.reduce((a, b) => a + b, 0);
  const percentages = labels.map((l, i) => `${l}: ${(total ? (data[i] / total * 100).toFixed(1) : 0)}%`);
  moodPercentagesDiv.innerHTML = percentages.join(" | ");

  if (moodChart) moodChart.destroy();
  moodChart = new Chart(moodChartCanvas, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ffcc00', '#ff6b6b', '#ff8c00', '#82ca9d', '#8e44ad', '#00bcd4']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  });
}

saveBtn.onclick = () => {
  const mood = document.getElementById("mood").value.trim();
  const intensity = parseInt(document.getElementById("intensity").value);
  const journal = document.getElementById("journal").value.trim();
  const date = dateInput.value;

  if (!mood || !date || !journal) {
    alert("Please fill all fields.");
    return;
  }

  if (intensity < 1 || intensity > 10) {
    alert("Intensity must be between 1 and 10.");
    return;
  }

  const lowerMood = mood.toLowerCase();
  const contradictoryWords = {
    happy: ["sad", "angry", "upset", "cry", "bad"],
    sad: ["happy", "excited", "great", "joy"],
    angry: ["calm", "peace", "relaxed"],
    calm: ["angry", "furious", "mad"],
    anxious: ["calm", "peaceful", "relaxed"],
    excited: ["sad", "bored", "tired"]
  };

  if (contradictoryWords[lowerMood]?.some(w => journal.toLowerCase().includes(w))) {
    alert("Your journal text doesn't match your selected mood.");
    return;
  }

  entries.push({ mood, intensity, journal, date });
  saveEntries();
  renderEntries();
  document.getElementById("mood").value = "";
  document.getElementById("intensity").value = "5";
  document.getElementById("journal").value = "";
};

clearAllBtn.onclick = () => {
  if (confirm("Are you sure you want to clear all entries?")) {
    entries = [];
    saveEntries();
    renderEntries();
  }
};

renderEntries();
