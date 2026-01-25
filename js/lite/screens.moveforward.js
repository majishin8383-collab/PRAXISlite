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
        <div class="tileSub">Tap = saved.</div>
        <div class="tileHint">Tap</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    </button>
  `).join("");

  return `
    <section class="card">
      <h2 class="h2">Move Forward</h2>
      <p class="muted">One small useful action. Tap one to save instantly.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="muted" style="font-weight:700; opacity:.8; margin-bottom:6px;">Choose one</div>
      <div class="tileStack">
        ${presetHtml}
      </div>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">Or write your own</div>
          <div class="tileSub">Optional. Press Enter to save.</div>
          <div class="tileBody" style="margin-top:10px;">
            <input
              id="mfAction"
              class="liteInput"
              maxlength="120"
              placeholder="Example: delay message 10 minutes"
              autocomplete="off"
            />
          </div>
        </div>
        <span class="tileDot dotBlue" aria-hidden="true"></span>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" id="mfSaveCustom" type="button">
          <div class="tileMain">
            <div class="tileTitle">Save Custom</div>
            <div class="tileSub">Save what you typed.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>
      </div>

      <div id="mfSavedWrap" style="margin-top:14px; display:none;">
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
  const saveCustomBtn = root.querySelector("#mfSaveCustom");
  const wrap = root.querySelector("#mfSavedWrap");
  const box = root.querySelector("#mfSaved");

  function saveAction(text, source) {
    const clean = (text || "").trim();
    if (!clean) {
      input?.focus?.();
      return;
    }

    const stamp = new Date().toISOString();
    const payload = { text: clean, source, stamp };

    try {
      localStorage.setItem("praxis_lite_last_moveforward", JSON.stringify(payload));
    } catch {}

    wrap.style.display = "block";
    box.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">Saved</div>
        <div class="tileSub"><strong>Action:</strong> ${escapeHtml(clean)}</div>
        <div class="tileHint">Now do the smallest first step.</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    `;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // Preset tap = auto-save (fewest steps)
  root.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.getAttribute("data-preset");
      input.value = val; // visible confirmation in the field
      saveAction(val, "preset");
    });
  });

  // Custom save button
  saveCustomBtn.addEventListener("click", () => {
    saveAction(input.value, "custom");
  });

  // Enter key saves custom instantly
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveAction(input.value, "custom");
    }
  });
};
