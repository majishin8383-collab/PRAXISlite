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
      <p class="muted">One small step.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tileStack">
        ${presetHtml}
      </div>

      <div class="muted" style="font-weight:700; opacity:.8; margin:16px 0 8px;">Closure</div>

      <div class="tileStack">
        <button class="tile" data-close="REST" type="button">
          <div class="tileMain">
            <div class="tileTitle">REST</div>
            <div class="tileSub">Stop here.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-close="READINESS" type="button">
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

      <div id="mfSavedWrap" style="margin-top:14px; display:none;">
        <div class="tile tileStatic" id="mfSaved"></div>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.moveforward = (root, router) => {
  const wrap = root.querySelector("#mfSavedWrap");
  const box = root.querySelector("#mfSaved");

  function saveAction(text) {
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem("praxis_lite_last_moveforward", JSON.stringify({ text, stamp }));
    } catch {}

    wrap.style.display = "block";
    box.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">READINESS</div>
        <div class="tileSub">${escapeHtml(text)}</div>
        <div class="tileHint">Closure named.</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    `;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function saveClosure(state) {
    const stamp = new Date().toISOString();
    try {
      localStorage.setItem("praxis_lite_last_closure", JSON.stringify({ flow: "moveforward", state, stamp }));
    } catch {}

    wrap.style.display = "block";
    box.innerHTML = `
      <div class="tileMain">
        <div class="tileTitle">${state}</div>
        <div class="tileSub">Closure named.</div>
        <div class="tileHint">Return when ready.</div>
      </div>
      <span class="tileDot dotGreen" aria-hidden="true"></span>
    `;
    box.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  root.querySelectorAll("[data-preset]").forEach((btn) => {
    btn.addEventListener("click", () => saveAction(btn.getAttribute("data-preset")));
  });

  root.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => saveClosure(btn.getAttribute("data-close")));
  });
};
