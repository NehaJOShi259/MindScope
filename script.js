const moodSelect = document.getElementById("mood");
const intensityInput = document.getElementById("intensity");
const journalInput = document.getElementById("journal");
const entriesDiv = document.getElementById("entries");
const saveBtn = document.getElementById("saveEntry");
const resetBtn = document.getElementById("resetAll");
const moodChartCanvas = document.getElementById("moodChart");

let entries = JSON.parse(localStorage.getItem("moodEntries")) || [];

function displayEntries() {
  entriesDiv.innerHTML = entries.map(e =>
    `${e.date} - ${e.mood} (Intensity: ${e.intensity}) : ${e.journal}`
  ).join("<br>");
  drawChart();
}

saveBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  const intensity = parseInt(intensityInput.value);
  const journal = journalInput.value.trim();

  if (!mood || !journal) {
    alert("Please select a mood and write something.");
    return;
  }

  const date = new Date().toLocaleString();
  const newEntry = { mood, intensity, journal, date };
  entries.push(newEntry);
  localStorage.setItem("moodEntries", JSON.stringify(entries));
  displayEntries();

  moodSelect.value = "";
  intensityInput.value = 5;
  journalInput.value = "";
});

resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all entries?")) {
    entries = [];
    localStorage.removeItem("moodEntries");
    entriesDiv.innerHTML = "";
    drawChart();
  }
});

function drawChart() {
  const ctx = moodChartCanvas.getContext("2d");
  ctx.clearRect(0, 0, moodChartCanvas.width, moodChartCanvas.height);

  if (entries.length === 0) return;

  const moodCounts = {};
  entries.forEach(e => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const moods = Object.keys(moodCounts);
  const counts = Object.values(moodCounts);

  const maxCount = Math.max(...counts);
  const barWidth = 60;
  const gap = 30;

  moods.forEach((mood, i) => {
    const x = i * (barWidth + gap) + 30;
    const height = (counts[i] / maxCount) * 150;
    const y = 200 - height;
    ctx.fillStyle = "#007bff";
    ctx.fillRect(x, y, barWidth, height);
    ctx.fillStyle = "#000";
    ctx.fillText(mood, x + 10, 220);
  });
}

displayEntries();
