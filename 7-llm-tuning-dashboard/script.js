function randomLatency() {
  return Math.floor(Math.random() * 180) + 100;
}
const RUNS = [
  { name: "Run A - Baseline", lossEnd: 1.24, tokens: 50000 },
  { name: "Run B - Domain Data v1", lossEnd: 0.91, tokens: 120000 },
  { name: "Run C - Cleaned Data", lossEnd: 0.76, tokens: 110000 }
];
function renderRuns() {
  const container = document.getElementById("outputBody");
  container.innerHTML = "";
  RUNS.forEach(run => {
    const card = document.createElement("div");
    card.className = "metric";
    card.innerHTML = `
      <div class="metric-label">${run.name}</div>
      <div class="metric-value">Final loss: ${run.lossEnd.toFixed(2)}</div>
      <p style="margin:4px 0 0; font-size:0.75rem; color:var(--muted);">
        Tokens seen: ${run.tokens.toLocaleString()} • Approx. epochs: ${(run.tokens / 50000).toFixed(1)}
      </p>
    `;
    container.appendChild(card);
  });
}
window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("mainInput");
  const sampleBtn = document.getElementById("sampleBtn");
  const clearBtn = document.getElementById("clearBtn");
  const runBtn = document.getElementById("runBtn");
  const extraControls = document.getElementById("extraControls");
  const outputPanel = document.getElementById("outputPanel");
  const metricConfidence = document.getElementById("metricConfidence");
  const metricLatency = document.getElementById("metricLatency");
  const metricPattern = document.getElementById("metricPattern");
  extraControls.innerHTML = `
    <div class="field">
      <label for="modelFamily">Model family</label>
      <select id="modelFamily">
        <option value="llama">LLaMA-style</option>
        <option value="mpt">MPT-style</option>
        <option value="granite">IBM Granite-style</option>
      </select>
    </div>
  `;
  renderRuns();
  const modelFamily = document.getElementById("modelFamily");
  sampleBtn.addEventListener("click", () => {
    input.value = "Fine-tune a base foundation model on ~100k tokens of internal support conversations to improve answer relevance and tone.";
  });
  clearBtn.addEventListener("click", () => {
    input.value = "";
    renderRuns();
    outputPanel.querySelector(".output-header").innerHTML = '<span>Awaiting input...</span><span class="chip">No run yet</span>';
    metricConfidence.textContent = "-";
    metricLatency.textContent = "-";
    metricPattern.textContent = "-";
  });
  runBtn.addEventListener("click", () => {
    const latency = randomLatency();
    const selectedModel = modelFamily.value;
    const desc = input.value || "General domain adaptation fine-tune.";
    outputPanel.querySelector(".output-header").innerHTML =
      '<span>Fine-tuning plan (simulated)</span><span class="chip">Experiment configuration</span>';
    let bodyHtml = "";
    bodyHtml += "<p><strong>Goal</strong><br>" + desc + "</p>";
    bodyHtml += "<p><strong>Selected model family</strong><br>" + selectedModel + "</p>";
    bodyHtml += "<p><strong>Existing experiments</strong></p>";
    RUNS.forEach(run => {
      bodyHtml += `<p>• ${run.name}: final loss ${run.lossEnd.toFixed(2)}, tokens ~${run.tokens.toLocaleString()}</p>`;
    });
    bodyHtml += "<p>In a real watsonx deployment, this dashboard would be backed by experiment tracking, lineage, and governance metadata.</p>";
    document.getElementById("outputBody").innerHTML = bodyHtml;
    metricConfidence.textContent = "N/A (config summary)";
    metricLatency.textContent = latency.toString();
    metricPattern.textContent = "ML • Fine-tuning Overview";
  });
});