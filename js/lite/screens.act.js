// js/lite/screens.act.js
const QUESTIONS = [
  "Have I slept at least 5 hours in the last 24 hours?",
  "Have I eaten a real meal in the last 8 hours?",
  "Have I had alcohol or substances that can distort judgment today?",
  "Has this situation repeatedly harmed my peace or stability?",
  "Have I asked clearly for what I need (once) without escalating?",
  "Is there a time pressure that is real (not imagined) within 24 hours?",
  "Is my next step reversible if it goes poorly?",
  "If a friend described this exact situation, would I advise them to pause?",
  "Do I have enough information to decide, or am I guessing?",
  "Will engaging right now make things measurably better within 48 hours?"
];

function resultFrom(answers) {
  // Simple scoring:
  // "No" on basic stability (sleep/food) increases risk
  // "Yes" to harm/repeat increases risk
  // "Yes" to alcohol/substances increases risk
  // "No" to reversible / information increases risk
  let risk = 0;

  // Q1 sleep
  if (answers[0] === "no") risk += 2;
  // Q2 meal
  if (answers[1] === "no") risk += 2;
  // Q3 substances
  if (answers[2] === "yes") risk += 2;

  // Q4 repeated harm
  if (answers[3] === "yes") risk += 2;

  // Q5 asked clearly (no increases risk slightly)
  if (answers[4] === "no") risk += 1;

  // Q6 real time pressure (yes decreases risk slightly; it can justify action)
  if (answers[5] === "yes") risk -= 1;

  // Q7 reversible (no increases risk)
  if (answers[6] === "no") risk += 2;

  // Q8 would advise pause (yes increases risk)
  if (answers[7] === "yes") risk += 2;

  // Q9 enough info (no increases risk)
  if (answers[8] === "no") risk += 2;

  // Q10 engaging helps in 48h (no increases risk)
  if (answers[9] === "no") risk += 2;

  // Clamp
  risk = Math.max(0, Math.min(14, risk));

  if (risk >= 9) return { verdict: "DISENGAGE", note: "Do not engage today. Protect your peace. Revisit after recovery and time." };
  if (risk >= 5) return { verdict: "PAUSE", note: "Pause. Stabilize first. Set a time to revisit with a clearer head." };
  return { verdict: "PROCEED", note: "Proceed calmly with one clear step. Keep it short and factual." };
}

export function screenAct() {
  const qHtml = QUESTIONS.map((q, i) => `
    <div class="qRow" data-q="${i}">
      <div class="qText"><strong>${i + 1}.</strong> ${q}</div>
      <div class="qBtns">
        <button class="pillBtn" data-a="yes" type="button">Yes</button>
        <button class="pillBtn" data-a="no" type="button">No</button>
      </div>
    </div>
  `).join("");

  return `
    <section class="card">
      <h2 class="h2">Act (DOS Lite)</h2>
      <p class="muted">Answer honestly. The system returns the safest next move.</p>

      <div id="dos" class="dos">
        ${qHtml}
      </div>

      <div class="btnRow" style="margin-top:12px;">
        <button class="ghostBtn" data-go="home" type="button">Back</button>
        <button class="primaryBtn" id="dosSubmit" type="button" disabled>Get Result</button>
      </div>

      <div id="dosResult" class="card" style="margin-top:12px; display:none;"></div>

      <div class="btnRow" style="margin-top:12px;">
        <button class="ghostBtn" data-go="stabilize" type="button">Re-stabilize</button>
        <button class="primaryBtn" data-go="moveforward" type="button">Next: Move Forward</button>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.act = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  const answers = Array(QUESTIONS.length).fill(null);
  const submit = root.querySelector("#dosSubmit");
  const resultBox = root.querySelector("#dosResult");

  function updateSubmit() {
    const done = answers.every(Boolean);
    submit.disabled = !done;
  }

  root.querySelectorAll(".qRow").forEach((row) => {
    const idx = Number(row.getAttribute("data-q"));
    const btns = row.querySelectorAll("[data-a]");
    btns.forEach((b) => {
      b.addEventListener("click", () => {
        const val = b.getAttribute("data-a"); // yes/no
        answers[idx] = val;

        // UI selection
        btns.forEach(x => x.classList.remove("isSelected"));
        b.classList.add("isSelected");

        updateSubmit();
      });
    });
  });

  submit.addEventListener("click", () => {
    const out = resultFrom(answers);
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem("praxis_lite_last_dos", JSON.stringify({ ...out, stamp }));
    } catch {}

    resultBox.style.display = "block";
    resultBox.innerHTML = `
      <h3 class="h3">Result: ${out.verdict}</h3>
      <p class="muted" style="margin-top:6px;">${out.note}</p>
      <p class="muted" style="margin-top:6px;"><small>Saved locally.</small></p>
    `;
    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateSubmit();
};
