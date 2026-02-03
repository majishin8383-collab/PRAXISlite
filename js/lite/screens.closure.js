// js/lite/screens.closure.js

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[c]));
}

function safeParse(json, fallback) {
  try { return JSON.parse(json); } catch { return fallback; }
}

function dotForState(state) {
  const s = String(state || "").toUpperCase();
  if (s === "REST") return "dotBlue";
  if (s === "RELIEF") return "dotYellow";
  return "dotGreen"; // READINESS + default
}

export function screenClosure() {
  const data = safeParse(sessionStorage.getItem("praxis_lite_closure"), {
    flow: "lite",
    state: "REST",
    line: "Stop here."
  });

  const state = String(data.state || "REST");
  const line = String(data.line || "Stop here.");

  const showMoveForward = state.toUpperCase() === "READINESS";
  const dot = dotForState(state);

  return `
    <section class="card">
      <h2 class="h2">End</h2>
      <p class="muted">Done.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">${escapeHtml(state)}</div>
          <div class="tileSub">${escapeHtml(line)}</div>
        </div>
        <span class="tileDot ${dot}" aria-hidden="true"></span>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-go="home" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stop here</div>
            <div class="tileSub">Return to start.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-go="stabilize" type="button">
          <div class="tileMain">
            <div class="tileTitle">Stabilize</div>
            <div class="tileSub">Lower intensity.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotGreen" aria-hidden="true"></span>
        </button>

        ${showMoveForward ? `
        <button class="tile" data-go="moveforward" type="button">
          <div class="tileMain">
            <div class="tileTitle">Move Forward</div>
            <div class="tileSub">One small step.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>
        ` : ``}
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.closure = (root, router) => {
  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });
};
