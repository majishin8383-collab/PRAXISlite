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

function computeResult(answers) {
  // answers: "yes" | "no"
  let risk = 0;

  // Stability basics (no = risk)
  if (answers[0] === "no") risk += 2; // sleep
  if (answers[1] === "no") risk += 2; // food
  if (answers[2] === "yes") risk += 2; // substances

  // Pattern harm
  if (answers[3] === "yes") risk += 2;

  // Communication done (no = slight risk)
  if (answers[4] === "no") risk += 1;

  // Real deadline (yes = slight reduce)
  if (answers[5] === "yes") risk -= 1;

  // Reversible (no = risk)
  if (answers[6] === "no") risk += 2;

  // Would advise pause (yes = risk)
  if (answers[7] === "yes") risk += 2;

  // Enough info (no = risk)
  if (answers[8] === "no") risk += 2;

  // Engagement helps (no = risk)
  if (answers[9] === "no") risk += 2;

  risk = Math.max(0, Math.min(14, risk));

  if (risk >= 9) return { verdict: "DISENGAGE", dot: "dotRed", note: "Do not engage today. Protect your peace. Revisit after recovery and time." };
  if (risk >= 5) return { verdict: "PAUSE", dot: "dotYellow", note: "Pause. Stabilize first. Set a time to revisit with a clearer head." };
  return { verdict: "PROCEED", dot: "dotGreen", note: "Proceed calmly with one clear step. Keep it short and factual." };
}

export function screenAct() {
  const qHtml = QUESTIONS.map((q, i) => `
    <div class="tile dosTile" data-q="${i}" role="group" aria-label="DOS question ${i + 1}">
      <div class="tileMain">
        <div class="tileTitle">${i + 1}. ${q}</div>
        <div class="tileSub">One tap. No debating.</div>

        <div class="segRow" role="radiogroup" aria-label="Answer yes or no">
          <button class="segBtn" data-a="yes" type="button" aria-pressed="false">Yes</button>
          <button class="segBtn" data-a="no" type="button" aria-pressed="false">No</button>
        </div>
      </div>
      <span class="tileDot dotBlue" aria-hidden="true"></span>
    </div>
  `).join("");

  return `
    <section class="card">
      <h2 class="h2">Act (DOS)</h2>
      <p class="muted">Answer honestly. The system returns the safest next move.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack" id="dos">
        ${qHtml}
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-go="home" type="button">
          <div class="tileMain">
            <div class="tileTitle">Back</div>
            <div class="tileSub">Return to start.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile tileDisabled" id="dosSubmit" type="button" disabled>
          <div class="tileMain">
            <div class="tileTitle">Get Result</div>
            <div class="tileSub">Complete all answers first.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>
      </div>

      <div id="dosResultWrap" style="margin-top:14px; display:none;">
        <div class="tile tileStatic" id="dosResult"></div>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-go="stabilize" type="button">
          <div class="tileMain">
            <div class="tileTitle">Re-stabilize</div>
            <div class="tileSub">Lower intensity first.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>

        <button class="tile" data-go="moveforward" type="button">
          <div class="tileMain">
            <div class="tileTitle">Next: Move Forward</div>
            <div class="tileSub">Do one small useful thing.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>
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
  const resultWrap = root.querySelector("#dosResultWrap");
  const resultBox = root.querySelector("#dosResult");

  function updateSubmit() {
    const done = answers.every(Boolean);
    submit.disabled = !done;
    submit.classList.toggle("tileDisabled", !done);
    submit.querySelector(".tileSub").textContent = done ? "Tap to compute your safest next move." : "Complete all answers first.";
  }

  root.querySelectorAll(".dosTile").forEach((tile) => {
    const idx = Number(tile.getAttribute("data-q"));
    const yesBtn = tile.querySelector('[data-a="yes"]');
    const noBtn = tile.querySelector('[data-a="no"]');

    function setSelected(val) {
      answers[idx] = val;

      // visual selection
      yesBtn.classList.toggle("isSelected", val === "yes");
      noBtn.classList.toggle("isSelected", val === "no");

      // aria pressed
      yesBtn.setAttribute("aria-pressed", String(val === "yes"));
      noBtn.setAttribute("aria-pressed", String(val === "no"));

      updateSubmit();
    }

    yesBtn.addEventListener("click", () => setSelected("yes"));
    noBtn.addEventListener("click", () => setSelected("no"));
  });

  submit.addEventListener("click", () => {
    const out = computeResult(answers);
    const stamp = new Date().toISOString();

    try {
      localStorage.setItem("praxis_lite_last_dos", JSON.stringify({ ...out, stamp }));
    } catch {}

    resultWrap.style.display = "block";
    resultBox.className = "tile tileStatic"; // reset
    resultBox.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">Result: ${out.verdict}</div>
        <div class="tileSub">${out.note}</div>
        <div class="tileHint">Saved locally.</div>
      </div>
      <span class="tileDot ${out.dot}" aria-hidden="true"></span>
    `;

    resultBox.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateSubmit();
};
