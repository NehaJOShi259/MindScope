const moodSelect = document.getElementById("mood");
const intensityRange = document.getElementById("intensity");
const intensityValue = document.getElementById("intensity-value");
const entryInput = document.getElementById("entry");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");
const entriesList = document.getElementById("entriesList");
const moodChartCtx = document.getElementById("moodChart");

let entries = JSON.parse(localStorage.getItem("mindscope_entries")) || [];

intensityRange.addEventListener("input", () => {
  intensityValue.textContent = intensityRange.value;
});

function renderEntries() {
  entriesList.innerHTML = "";
  entries.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.date} - ${item.mood} (Intensity: ${item.intensity}) : ${item.text}`;
    entriesList.appendChild(li);
  });
}

function updateChart() {
  const moodCounts = {};
  entries.forEach((e) => {
    moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
  });

  const data = {
    labels: Object.keys(moodCounts),
    datasets: [{
      data: Object.values(moodCounts),
      backgroundColor: ["#4c8cff", "#f5a623", "#50c878", "#ff6b6b", "#aaaaff"],
    }],
  };

  if (window.moodChart) window.moodChart.destroy();
  window.moodChart = new Chart(moodChartCtx, {
    type: "pie",
    data,
  });
}

saveBtn.addEventListener("click", () => {
  const mood = moodSelect.value;
  const intensity = intensityRange.value;
  const text = entryInput.value.trim();

  if (!mood || !text) {
    alert("Please select a mood and write something.");
    return;
  }

  const newEntry = {
    date: new Date().toLocaleString(),
    mood,
    intensity,
    text,
  };

  entries.push(newEntry);
  localStorage.setItem("mindscope_entries", JSON.stringify(entries));
  renderEntries();
  updateChart();

  moodSelect.value = "";
  entryInput.value = "";
  intensityRange.value = 5;
  intensityValue.textContent = 5;
});

resetBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all entries?")) {
    entries = [];
    localStorage.removeItem("mindscope_entries");
    renderEntries();
    updateChart();
  }
});

renderEntries();
updateChart();
