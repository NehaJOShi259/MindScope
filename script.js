function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
}

function saveEntry() {
  const mood = document.getElementById('mood').value;
  const journal = document.getElementById('journal').value.trim();
  const date = new Date();

  if (!journal) {
    alert("Please enter a journal note.");
    return;
  }

  const entry = {
    mood,
    journal,
    date: `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`,
    time: formatAMPM(date)
  };

  let entries = JSON.parse(localStorage.getItem('entries')) || [];
  entries.push(entry);
  localStorage.setItem('entries', JSON.stringify(entries));

  document.getElementById('journal').value = "";
  renderEntries();
  renderChart();
}

function renderEntries() {
  const entriesList = document.getElementById('entriesList');
  entriesList.innerHTML = "";

  const entries = JSON.parse(localStorage.getItem('entries')) || [];

  entries.forEach(entry => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${entry.date} (${entry.time})</strong>: ${entry.mood} — ${entry.journal}`;
    entriesList.appendChild(li);
  });
}

function renderChart() {
  const entries = JSON.parse(localStorage.getItem('entries')) || [];

  const moodCounts = {
    "😊": 0,
    "😔": 0,
    "😐": 0,
    "😡": 0,
    "😨": 0
  };

  entries.forEach(entry => {
    moodCounts[entry.mood]++;
  });

  const ctx = document.getElementById('moodChart').getContext('2d');
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(moodCounts),
      datasets: [{
        label: 'Mood Frequency',
        data: Object.values(moodCounts),
        backgroundColor: [
          '#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function clearAllData() {
  const confirmClear = confirm("Are you sure you want to reset all data?");
  if (confirmClear) {
    localStorage.clear();
    renderEntries();
    renderChart();
    alert("Tracker reset successfully.");
  }
}

window.onload = function () {
  renderEntries();
  renderChart();
}
