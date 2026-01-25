// js/lite/screens.moveforward.js

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[c]));
}

const PRESETS = [
  "Drink a full glass of water",
  "Take 5 slow breaths",
  "Stand up and stretch for 60 seconds",
  "Step outside or near a window",
  "Delay the urge for 10 minutes",
  "Write one sentence (notes app is fine)",
  "Do the smallest part only",
];

export function screenMoveForward() {
  const presetHtml = PRESETS.map((p) => `
    <button class="tile presetTile" data-preset="${escapeHtml(p)}" type="button">
      <div class="tileMain">
        <div class="tileTitle">${p}</div>
        <div class="tileSub">One small step.</div>
        <div class="tileHint">Tap</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    </button>
  `).join("");

  return `
    <section class="card">
      <h2 class="h2">Move Forward</h2>
      <p class="muted">
        One small useful action. No fixing your life. Just create momentum.
      </p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="muted" style="font-weight:700; opacity:.8; margin-bottom:6px;">
        Choose one
      </div>

      <div class="tileStack">
        ${presetHtml}
      </div>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">Or write your own</div>
          <div class="tileSub">Only if needed.</div>
          <div class="tileBody" style="margin-top:10px;">
            <input
              id="mfAction"
              class="liteInput"
              maxlength="120"
              placeholder="Example: delay message 10 minutes"
            />
          </div>
        </div>
        <span class="tileDot dotBlue" aria-hidden="true"></span>
      </div>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        <button class="tile" data-status="done" type="button">
          <div class="tileMain">
            <div class="tileTitle">Done</div>
            <div class="tileSub">I did it.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>

        <button class="tile" data-status="delay" type="button">
          <div class="tileMain">
            <div class="tileTitle">Delay</div>
            <div class="tileSub">Not now. I paused.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>

        <button class="tile" data-status="drop" type="button">
          <div class="tileMain">
            <div class="tileTitle">Drop it</div>
            <div class="tileSub">Not useful right now.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotRed" aria-hidden="true"></span>
        </button>
      </div>
    </section>

    <section class="card" style="margin-top:14px;">
      <div id="mfSavedWrap" style="display:none;">
        <div class="tile tileStatic" id="mfSaved"></div>
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
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.moveforward = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  const input = root.querySelector("#mfAction");
  const wrap = root.querySelector("#mfSavedWrap");
  const box = root.querySelector("#mfSaved");

  // Tap preset fills input
  root.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      input.value = btn.getAttribute("data-preset");
      input.focus();
    });
  });

  function save(status) {
    const text = (input.value || "").trim();
    if (!text) {
      input.focus();
      return;
    }

    const stamp = new Date().toISOString();
    const payload = { text, status, stamp };

    try {
      localStorage.setItem("praxis_lite_last_moveforward", JSON.stringify(payload));
    } catch {}

    wrap.style.display = "block";
    box.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">Saved</div>
        <div class="tileSub"><strong>Action:</strong> ${escapeHtml(text)}</div>
        <div class="tileHint"><strong>Status:</strong> ${escapeHtml(status.toUpperCase())}</div>
      </div>
      <span class="tileDot dotBlue" aria-hidden="true"></span>
    `;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  root.querySelectorAll("[data-status]").forEach((btn) => {
    btn.addEventListener("click", () => save(btn.getAttribute("data-status")));
  });
};
