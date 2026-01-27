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
        <button class="tile" data-end="REST" data-line="Stop here." type="button">
          <div class="tileMain">
            <div class="tileTitle">REST</div>
            <div class="tileSub">Stop here.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-end="READINESS" data-line="One step is available." type="button">
          <div class="tileMain">
            <div class="tileTitle">READINESS</div>
            <div class="tileSub">One step is available.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>

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
  function end(flow, state, line) {
    try {
      sessionStorage.setItem(
        "praxis_lite_closure",
        JSON.stringify({ flow, state, line, stamp: new Date().toISOString() })
      );
    } catch {}
    router.go("closure");
  }

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  root.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const action = btn.getAttribute("data-preset") || "One small step.";
      // preset tap = READINESS with the chosen step as the closure line
      end("moveforward", "READINESS", action);
    });
  });

  root.querySelectorAll("[data-end]").forEach((btn) => {
    btn.addEventListener("click", () => {
      end("moveforward", btn.getAttribute("data-end"), btn.getAttribute("data-line") || "Stop here.");
    });
  });
};
