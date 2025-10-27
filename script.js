const dateInput = document.getElementById("date");
const moodInput = document.getElementById("mood");
const intensityInput = document.getElementById("intensity");
const entryInput = document.getElementById("entry");
const entriesDiv = document.getElementById("entries");
const percentagesDiv = document.getElementById("percentages");
let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

// Restrict future dates
const today = new Date().toISOString().split("T")[0];
dateInput.max = today;

document.getElementById("save").addEventListener("click", () => {
  const date = dateInput.value;
  const mood = moodInput.value;
  const intensity = parseInt(intensityInput.value);
  const text = entryInput.value.trim();

  if (!date || !mood || !intensity || !text) {
    alert("Please fill all fields.");
    return;
  }

  // prevent contradictory mood words
  const contradictions = {
    Happy: ["sad", "angry", "anxious"],
    Sad: ["happy", "excited"],
    Angry: ["calm", "happy"],
    Calm: ["angry", "anxious"],
    Anxious: ["calm", "relaxed"],
    Excited: ["sad", "tired"]
  };

  const lowerText = text.toLowerCase();
  if (contradictions[mood].some(word => lowerText.includes(word))) {
    alert("Your journal entry contradicts your selected mood. Please revise it.");
    return;
  }

  const entry = { date, mood, intensity, text, time: new Date().toLocaleTimeString() };
  entries.push(entry);
  localStorage.setItem("moodEntries", JSON.stringify(entries));

  displayEntries();
  updateChart(entries);
  resetForm();
});

document.getElementById("reset").addEventListener("click", resetForm);
document.getElementById("clear").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all entries?")) {
    localStorage.removeItem("moodEntries");
    entries = [];
    displayEntries();
    updateChart(entries);
    percentagesDiv.innerHTML = "";
    alert("All entries cleared.");
  }
});

function resetForm() {
  dateInput.value = "";
  moodInput.value = "";
  intensityInput.value = 5;
  entryInput.value = "";
}

function displayEntries() {
  entriesDiv.innerHTML = "";
  if (entries.length === 0) {
    entriesDiv.innerHTML = "<p>No entries yet.</p>";
    return;
  }
  entries.slice().reverse().forEach(e => {
    const div = document.createElement("div");
    div.className = "entry";
    div.textContent = `${e.date}, ${e.time} - ${e.mood} (Intensity: ${e.intensity}) : ${e.text}`;
    entriesDiv.appendChild(div);
  });
}

function updateChart(entries) {
  const moodCounts = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const moods = Object.keys(moodCounts);
  const counts = Object.values(moodCounts);
  const total = counts.reduce((a, b) => a + b, 0);

  percentagesDiv.innerHTML = moods.map(
    (m, i) => `${m}: ${(counts[i] / total * 100).toFixed(1)}%`
  ).join(" | ");

  const ctx = document.getElementById("moodChart").getContext("2d");
  if (window.moodChart) window.moodChart.destroy();

  window.moodChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: moods,
      datasets: [{
        data: counts,
        backgroundColor: [
          "#4CAF50", "#F44336", "#FF9800", "#03A9F4", "#9C27B0", "#FFC107"
        ]
      }]
    },
    options: {
      plugins: { legend: { position: "bottom" } }
    }
  });
}

// initialize
displayEntries();
updateChart(entries);
