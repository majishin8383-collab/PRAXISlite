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
  "Drink water",
  "Five slow breaths",
  "Stand and stretch",
  "Step near a window",
  "Delay for 10 minutes",
  "One sentence note",
  "Smallest part only",
];

export function screenMoveForward() {
  const presetHtml = PRESETS.map((p) => `
    <button class="tile" data-preset="${escapeHtml(p)}" type="button">
      <div class="tileMain">
        <div class="tileTitle">${escapeHtml(p)}</div>
        <div class="tileSub">Tap.</div>
        <div class="tileHint">Tap</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    </button>
  `).join("");

  return `
    <section class="card">
      <h2 class="h2">Move Forward</h2>
      <p class="muted">One small step.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        ${presetHtml}
      </div>

      <div class="muted" style="font-weight:700; opacity:.8; margin:16px 0 8px;">End</div>

      <div class="tileStack">
        <button class="tile" data-go="home" type="button">
          <div class="tileMain">
            <div class="tileTitle">Done</div>
            <div class="tileSub">You can stop here.</div>
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
  function saveStep(text) {
    try {
      localStorage.setItem(
        "praxis_lite_last_step",
        JSON.stringify({ text, stamp: new Date().toISOString() })
      );
    } catch {}
  }

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  root.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-preset") || "One small step.";
      saveStep(action);
      router.go("home");
    });
  });
};
