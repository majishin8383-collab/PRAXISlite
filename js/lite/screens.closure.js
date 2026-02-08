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

function displayState(state) {
  const s = String(state || "").trim().toUpperCase();
  if (s === "DONE") return "That’s enough.";
  // fallback: never show empty
  return s || "That’s enough.";
}

export function screenClosure() {
  const data = safeParse(sessionStorage.getItem("praxis_lite_closure"), {
    flow: "lite",
    state: "DONE",
    line: "You can stop here."
  });

  const flow = String(data.flow || "lite");
  const state = displayState(data.state || "DONE");
  const line = String(data.line || "You can stop here.");

  const runAgainSub =
    flow === "moveforward"
      ? line
      : "Do this again.";

  return `
    <section class="card">
      <h2 class="h2">End</h2>
      <p class="muted">You can stop here.</p>
    </section>

    <section class="card" style="margin-top:14px;">
      <div class="tile tileStatic">
        <div class="tileMain">
          <div class="tileTitle">${escapeHtml(state)}</div>
          <div class="tileSub">${escapeHtml(line)}</div>
          <div class="tileHint">${escapeHtml(flow)}</div>
        </div>
        <span class="tileDot dotGreen" aria-hidden="true"></span>
      </div>

      <div class="tileStack" style="margin-top:14px;">
        <button class="tile" data-go="home" type="button">
          <div class="tileMain">
            <div class="tileTitle">Back to start</div>
            <div class="tileSub">Done for now.</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotBlue" aria-hidden="true"></span>
        </button>

        <button class="tile" data-retry="1" type="button">
          <div class="tileMain">
            <div class="tileTitle">Run Again</div>
            <div class="tileSub">${escapeHtml(runAgainSub)}</div>
            <div class="tileHint">Tap</div>
          </div>
          <span class="tileDot dotYellow" aria-hidden="true"></span>
        </button>
      </div>
    </section>
  `;
}

window.__LITE_HOOKS = window.__LITE_HOOKS || {};
window.__LITE_HOOKS.closure = (root, router) => {
  try { window.scrollTo(0, 0); } catch {}

  const data = (() => {
    try { return JSON.parse(sessionStorage.getItem("praxis_lite_closure") || "{}"); }
    catch { return {}; }
  })();

  const flow = String(data.flow || "home");

  root.querySelectorAll("[data-go]").forEach((btn) => {
    btn.addEventListener("click", () => router.go(btn.getAttribute("data-go")));
  });

  root.querySelectorAll("[data-retry]").forEach((btn) => {
    btn.addEventListener("click", () => {
      router.go(flow);
    });
  });
};
