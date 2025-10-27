const moodSelect = document.getElementById("mood");
const journalInput = document.getElementById("journal");
const intensityInput = document.getElementById("intensity");
const entriesList = document.getElementById("entriesList");
const promptDiv = document.getElementById("prompt");
const toggleMode = document.getElementById("toggleMode");

let entries = JSON.parse(localStorage.getItem("entries")) || [];

// Mood Prompts
const prompts = {
  Happy: "What made you feel happy today?",
  Sad: "What caused your sadness?",
  Calm: "What helped you stay calm?",
  Angry: "What made you angry?",
  Anxious: "What triggered your anxiety?",
};

// Update prompt dynamically
moodSelect.addEventListener("change", () => {
  const mood = moodSelect.value;
  promptDiv.textContent = mood ? prompts[mood] : "";
  document.body.style.backgroundColor = getMoodColor(mood);
});

function getMoodColor(mood) {
  const colors = {
    Happy: "#fff9c4",
    Sad: "#cfd8dc",
    Calm: "#c8e6c9",
    Angry: "#ffcdd2",
    Anxious: "#ffe0b2",
  };
  return colors[mood] || "#fafafa";
}

// Save entry
document.getElementById("saveEntry").addEventListener("click", () => {
  const mood = moodSelect.value;
  const journal = journalInput.value.trim();
  const intensity = intensityInput.value;

  if (!mood || !journal) {
    alert("Please select mood and write your journal.");
    return;
  }

  const entry = {
    date: new Date().toLocaleString(),
    mood,
    intensity,
    journal,
  };

  entries.push(entry);
  localStorage.setItem("entries", JSON.stringify(entries));

  displayEntries();
  updateChart();
  journalInput.value = "";
  moodSelect.value = "";
  promptDiv.textContent = "";
  document.body.style.backgroundColor = "#fafafa";
});

// Display entries
function displayEntries() {
  entriesList.innerHTML = "";
  entries.slice().reverse().forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${entry.mood}</strong> (Intensity: ${entry.intensity})<br>
                    ${entry.journal}<br>
                    <small>${entry.date}</small>`;
    entriesList.appendChild(li);
  });
}

// Reset all
document.getElementById("resetData").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all data?")) {
    localStorage.removeItem("entries");
    entries = [];
    displayEntries();
    updateChart();
  }
});

// Mood Chart
const ctx = document.getElementById("moodChart").getContext("2d");
let moodChart = new Chart(ctx, {
  type: "bar",
  data: { labels: [], datasets: [{ label: "Mood Frequency", data: [], backgroundColor: "#6c63ff" }] },
});

function updateChart() {
  const moodCounts = entries.reduce((acc, e) => {
    acc[e.mood] = (acc[e.mood] || 0) + 1;
    return acc;
  }, {});

  moodChart.data.labels = Object.keys(moodCounts);
  moodChart.data.datasets[0].data = Object.values(moodCounts);
  moodChart.update();
}

// Dark Mode
toggleMode.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleMode.textContent = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// Initial Load
displayEntries();
updateChart();
